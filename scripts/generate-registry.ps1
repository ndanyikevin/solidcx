param(
    [switch]$Write
)

$ErrorActionPreference = "Stop"

# ============================================================
# SolidCX Registry Generator
# ============================================================
#
# Preview:
#   .\scripts\generate-registry.ps1
#
# Write:
#   .\scripts\generate-registry.ps1 -Write
#
# Source of truth:
#   packages/ui/src/components
#
# Generated:
#   registry/components/*.json
#   registry/registry.json
#
# ============================================================


# ------------------------------------------------------------
# Paths
# ------------------------------------------------------------

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

$ComponentsRoot = Join-Path $Root "packages\ui\src\components"
$RegistryRoot = Join-Path $Root "registry"
$RegistryComponentsRoot = Join-Path $RegistryRoot "components"

$RegistrySchemaPath = Join-Path $RegistryRoot "registry.schema.json"
$ComponentSchemaPath = Join-Path $RegistryRoot "component.schema.json"
$RegistryJsonPath = Join-Path $RegistryRoot "registry.json"


# ------------------------------------------------------------
# Output helpers
# ------------------------------------------------------------

function Write-Section {
    param(
        [string]$Title
    )

    Write-Host ""
    Write-Host "============================================================" -ForegroundColor DarkGray
    Write-Host $Title -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor DarkGray
}


function Write-Status {
    param(
        [string]$Label,
        [string]$Value,
        [ConsoleColor]$Color = [ConsoleColor]::Gray
    )

    Write-Host ("  {0,-30} {1}" -f $Label, $Value) -ForegroundColor $Color
}


function Write-Utf8NoBom {
    param(
        [string]$Path,
        [string]$Content
    )

    $encoding = New-Object System.Text.UTF8Encoding($false)

    [System.IO.File]::WriteAllText(
        $Path,
        $Content,
        $encoding
    )
}


function Read-JsonFile {
    param(
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        return $null
    }

    try {
        $content = Get-Content -LiteralPath $Path -Raw

        if ([string]::IsNullOrWhiteSpace($content)) {
            return $null
        }

        return $content | ConvertFrom-Json
    }
    catch {
        Write-Host ""
        Write-Host "Invalid JSON file:" -ForegroundColor Red
        Write-Host "  $Path" -ForegroundColor Red
        Write-Host "  $($_.Exception.Message)" -ForegroundColor Red
        throw
    }
}


# ------------------------------------------------------------
# Naming
# ------------------------------------------------------------

function ConvertTo-Title {
    param(
        [string]$Name
    )

    $parts = $Name -split "-"

    $result = @()

    foreach ($part in $parts) {
        if ([string]::IsNullOrWhiteSpace($part)) {
            continue
        }

        if ($part.Length -eq 1) {
            $result += $part.ToUpperInvariant()
            continue
        }

        $result += (
            $part.Substring(0, 1).ToUpperInvariant() +
            $part.Substring(1)
        )
    }

    return ($result -join " ")
}


# ------------------------------------------------------------
# Path helpers
# ------------------------------------------------------------

function Get-RelativeUnixPath {
    param(
        [string]$BasePath,
        [string]$TargetPath
    )

    $base = (Resolve-Path $BasePath).Path
    $target = (Resolve-Path $TargetPath).Path

    $baseUri = New-Object System.Uri(
        ($base.TrimEnd("\") + "\")
    )

    $targetUri = New-Object System.Uri($target)

    $relative = $baseUri.MakeRelativeUri($targetUri).ToString()

    return $relative.Replace("\", "/")
}


function Get-ComponentNameFromPath {
    param(
        [string]$FilePath
    )

    $resolvedRoot = (Resolve-Path $ComponentsRoot).Path
    $resolvedFile = (Resolve-Path $FilePath).Path

    $rootUri = New-Object System.Uri(
        $resolvedRoot.TrimEnd("\") + "\"
    )

    $fileUri = New-Object System.Uri(
        $resolvedFile
    )

    $relative = $rootUri.MakeRelativeUri($fileUri).ToString()

    $parts = $relative -split '/'

    if ($parts.Count -lt 2) {
        return $null
    }

    return $parts[0]
}


# ------------------------------------------------------------
# Resolve local imports
# ------------------------------------------------------------

function Resolve-SourceImport {
    param(
        [string]$ImporterFile,
        [string]$ImportPath
    )

    if (-not $ImportPath.StartsWith(".")) {
        return $null
    }

    $importerDirectory = Split-Path -Parent $ImporterFile

    $candidateBase = Join-Path `
        $importerDirectory `
        $ImportPath

    $candidates = @(
        $candidateBase,
        "$candidateBase.ts",
        "$candidateBase.tsx",
        "$candidateBase.scss",
        "$candidateBase.css",
        (Join-Path $candidateBase "index.ts"),
        (Join-Path $candidateBase "index.tsx")
    )

    foreach ($candidate in $candidates) {
        if (Test-Path -LiteralPath $candidate -PathType Leaf) {
            return (Resolve-Path $candidate).Path
        }
    }

    return $null
}


# ------------------------------------------------------------
# Import parser
# ------------------------------------------------------------

function Get-ImportsFromFile {
    param(
        [string]$FilePath
    )

    $content = Get-Content -LiteralPath $FilePath -Raw

    $imports = @()

    # import X from "package"
    # import type X from "package"
    # import "package"
    $pattern1 = '(?m)\bimport\s+(?:type\s+)?(?:(?:[\s\S]*?)\s+from\s+)?["'']([^"'']+)["'']'

    # export { X } from "package"
    $pattern2 = '(?m)\bexport\s+(?:type\s+)?[\s\S]*?\s+from\s+["'']([^"'']+)["'']'

    # import("package")
    $pattern3 = '(?m)\bimport\s*\(\s*["'']([^"'']+)["'']\s*\)'

    foreach ($match in [regex]::Matches($content, $pattern1)) {
        $imports += $match.Groups[1].Value
    }

    foreach ($match in [regex]::Matches($content, $pattern2)) {
        $imports += $match.Groups[1].Value
    }

    foreach ($match in [regex]::Matches($content, $pattern3)) {
        $imports += $match.Groups[1].Value
    }

    return @(
        $imports |
        Where-Object {
            -not [string]::IsNullOrWhiteSpace($_)
        } |
        Sort-Object -Unique
    )
}


# ------------------------------------------------------------
# Dependency detection
# ------------------------------------------------------------

function Get-Dependencies {
    param(
        [string[]]$SourceFiles,
        [hashtable]$ComponentLookup
    )

    $npmDependencies = @{}
    $registryDependencies = @{}

    foreach ($file in $SourceFiles) {

        if (
            (-not $file.EndsWith(".ts")) -and
            (-not $file.EndsWith(".tsx"))
        ) {
            continue
        }

        $imports = Get-ImportsFromFile -FilePath $file

        foreach ($importPath in $imports) {

            # ------------------------------------------------
            # Local / relative imports
            # ------------------------------------------------

            if ($importPath.StartsWith(".")) {

                $resolved = Resolve-SourceImport `
                    -ImporterFile $file `
                    -ImportPath $importPath

                if ($null -eq $resolved) {

                    Write-Host ""
                    Write-Host "  WARNING: unresolved relative import" -ForegroundColor Yellow
                    Write-Host "    File:   $file" -ForegroundColor Yellow
                    Write-Host "    Import: $importPath" -ForegroundColor Yellow

                    continue
                }

                $currentComponent = Get-ComponentNameFromPath `
                    -FilePath $file

                $dependencyComponent = Get-ComponentNameFromPath `
                    -FilePath $resolved

                # Same component = internal file.
                if (
                    $null -ne $dependencyComponent -and
                    $dependencyComponent -ne $currentComponent
                ) {

                    if ($ComponentLookup.ContainsKey($dependencyComponent)) {
                        $registryDependencies[$dependencyComponent] = $true
                    }
                }

                continue
            }


            # ------------------------------------------------
            # SolidJS runtime packages
            # ------------------------------------------------
            #
            # These are intentionally ignored because the
            # consuming project is already expected to be
            # a SolidJS application.
            #
            if (
                $importPath -eq "solid-js" -or
                $importPath -eq "solid-js/web"
            ) {
                continue
            }


            # ------------------------------------------------
            # SolidCX CSS package
            # ------------------------------------------------

            if ($importPath -eq "@solidcx/styles") {
                continue
            }


            # ------------------------------------------------
            # SolidCX packages
            # ------------------------------------------------

            if ($importPath.StartsWith("@solidcx/")) {
                $npmDependencies[$importPath] = $true
                continue
            }


            # ------------------------------------------------
            # Ignore special imports
            # ------------------------------------------------

            if ($importPath.StartsWith("node:")) {
                continue
            }

            if ($importPath.StartsWith("virtual:")) {
                continue
            }

            if ($importPath.StartsWith("#")) {
                continue
            }

            if ($importPath.StartsWith("/")) {
                continue
            }


            # ------------------------------------------------
            # External npm package
            # ------------------------------------------------

            $npmDependencies[$importPath] = $true
        }
    }

    $dependencies = @(
        $npmDependencies.Keys |
        Sort-Object
    )

    $registry = @(
        $registryDependencies.Keys |
        Sort-Object
    )

    return @{
        Dependencies = $dependencies
        RegistryDependencies = $registry
    }
}


# ------------------------------------------------------------
# File classification
# ------------------------------------------------------------

function Get-FileType {
    param(
        [System.IO.FileInfo]$File
    )

    if ($File.Name -eq "index.ts") {
        return "barrel"
    }

    switch ($File.Extension.ToLowerInvariant()) {

        ".tsx" {
            return "component"
        }

        ".scss" {
            return "style"
        }

        ".ts" {
            return "utility"
        }

        default {
            return $null
        }
    }
}


# ------------------------------------------------------------
# Discover component files
# ------------------------------------------------------------

function Get-ComponentFiles {
    param(
        [System.IO.DirectoryInfo]$Directory
    )

    return @(
        Get-ChildItem `
            -LiteralPath $Directory.FullName `
            -File `
            -Recurse |
        Where-Object {
            $_.Extension.ToLowerInvariant() -in @(
                ".ts",
                ".tsx",
                ".scss"
            )
        } |
        Sort-Object FullName
    )
}


# ------------------------------------------------------------
# Generate one component entry
# ------------------------------------------------------------

function New-ComponentEntry {
    param(
        [System.IO.DirectoryInfo]$Directory,
        [hashtable]$ComponentLookup
    )

    $name = $Directory.Name

    $sourceFiles = Get-ComponentFiles -Directory $Directory


    # --------------------------------------------------------
    # Verify index.ts
    # --------------------------------------------------------

    $indexPath = Join-Path `
        $Directory.FullName `
        "index.ts"

    if (-not (Test-Path -LiteralPath $indexPath)) {

        Write-Host ""
        Write-Host "  WARNING: missing index.ts" -ForegroundColor Yellow
        Write-Host "    Component: $name" -ForegroundColor Yellow
    }


    # --------------------------------------------------------
    # Files
    # --------------------------------------------------------

    $files = @()

    foreach ($file in $sourceFiles) {

        $fileType = Get-FileType -File $file

        if ($null -eq $fileType) {
            continue
        }

        $relativePath = Get-RelativeUnixPath `
            -BasePath $Root `
            -TargetPath $file.FullName

        $files += [ordered]@{
            path = $relativePath
            type = $fileType
        }
    }


    # --------------------------------------------------------
    # Dependencies
    # --------------------------------------------------------

    $dependencyResult = Get-Dependencies `
        -SourceFiles @($sourceFiles.FullName) `
        -ComponentLookup $ComponentLookup


    # --------------------------------------------------------
    # Existing registry entry
    # --------------------------------------------------------

    $existingPath = Join-Path `
        $RegistryComponentsRoot `
        "$name.json"

    $existing = Read-JsonFile -Path $existingPath


    # --------------------------------------------------------
    # Description
    # --------------------------------------------------------

    $description = $null

    if ($null -ne $existing) {

        if (
            $existing.PSObject.Properties.Name -contains "description" -and
            -not [string]::IsNullOrWhiteSpace($existing.description)
        ) {
            $description = $existing.description
        }
    }

    if ([string]::IsNullOrWhiteSpace($description)) {

        $title = ConvertTo-Title -Name $name

        $description = (
            "A reusable $title component for SolidJS applications."
        )
    }


    # --------------------------------------------------------
    # Registry entry
    # --------------------------------------------------------

    return [ordered]@{
        '$schema' = "../component.schema.json"
        name = $name
        type = "registry:ui"
        title = ConvertTo-Title -Name $name
        description = $description
        files = @($files)
        dependencies = @($dependencyResult.Dependencies)
        registryDependencies = @($dependencyResult.RegistryDependencies)
        cssDependencies = @("@solidcx/styles")
    }
}


# ------------------------------------------------------------
# Validate generated entry
# ------------------------------------------------------------

function Test-ComponentEntry {
    param(
        [object]$Entry
    )

    $valid = $true

    if ([string]::IsNullOrWhiteSpace($Entry.name)) {

        Write-Host "  ERROR: missing component name" -ForegroundColor Red

        $valid = $false
    }

    if ($Entry.name -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {

        Write-Host `
            "  ERROR: invalid component name: $($Entry.name)" `
            -ForegroundColor Red

        $valid = $false
    }

    if ($Entry.type -ne "registry:ui") {

        Write-Host `
            "  ERROR: invalid registry type" `
            -ForegroundColor Red

        $valid = $false
    }

    if (@($Entry.files).Count -eq 0) {

        Write-Host `
            "  ERROR: component contains no source files" `
            -ForegroundColor Red

        $valid = $false
    }

    foreach ($file in @($Entry.files)) {

        $normalized = $file.path.Replace(
            "/",
            [System.IO.Path]::DirectorySeparatorChar
        )

        $absolutePath = Join-Path `
            $Root `
            $normalized

        if (-not (Test-Path -LiteralPath $absolutePath)) {

            Write-Host ""
            Write-Host "  ERROR: missing source file" -ForegroundColor Red
            Write-Host "    $($file.path)" -ForegroundColor Red

            $valid = $false
        }
    }

    return $valid
}


# ============================================================
# MAIN
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Yellow
Write-Host "              SolidCX Registry Generator" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Yellow

Write-Host ""

if ($Write) {
    Write-Status "Mode" "WRITE" ([ConsoleColor]::Green)
}
else {
    Write-Status "Mode" "PREVIEW" ([ConsoleColor]::Cyan)
}

Write-Status "Repository" $Root
Write-Status "Components" $ComponentsRoot
Write-Status "Registry" $RegistryRoot


# ------------------------------------------------------------
# Preconditions
# ------------------------------------------------------------

Write-Section "Checking registry structure"

$requiredPaths = @(
    $ComponentsRoot,
    $RegistryRoot,
    $RegistryComponentsRoot,
    $RegistrySchemaPath,
    $ComponentSchemaPath,
    $RegistryJsonPath
)

foreach ($path in $requiredPaths) {

    if (-not (Test-Path -LiteralPath $path)) {

        throw "Required path does not exist: $path"
    }
}

Write-Host "  Registry structure looks good." -ForegroundColor Green


# ------------------------------------------------------------
# Discover components
# ------------------------------------------------------------

Write-Section "Discovering components"

$componentDirectories = @(
    Get-ChildItem `
        -LiteralPath $ComponentsRoot `
        -Directory |
    Sort-Object Name
)

if ($componentDirectories.Count -eq 0) {

    throw "No component directories were found."
}

Write-Status `
    "Components discovered" `
    "$($componentDirectories.Count)" `
    ([ConsoleColor]::Green)


# ------------------------------------------------------------
# Component lookup
# ------------------------------------------------------------

$componentLookup = @{}

foreach ($directory in $componentDirectories) {

    $componentLookup[$directory.Name] = $true
}


# ------------------------------------------------------------
# Generate entries
# ------------------------------------------------------------

Write-Section "Analyzing components"

$generatedEntries = @()
$validationFailures = @()

foreach ($directory in $componentDirectories) {

    Write-Host ""
    Write-Host "[$($directory.Name)]" -ForegroundColor Yellow

    $entry = New-ComponentEntry `
        -Directory $directory `
        -ComponentLookup $componentLookup

    $valid = Test-ComponentEntry `
        -Entry $entry

    if (-not $valid) {

        $validationFailures += $directory.Name

        continue
    }

    $generatedEntries += $entry

    Write-Status `
        "Files" `
        "$(@($entry.files).Count)"

    if (@($entry.dependencies).Count -eq 0) {

        Write-Status `
            "Dependencies" `
            "none"
    }
    else {

        Write-Status `
            "Dependencies" `
            ($entry.dependencies -join ", ")
    }

    if (@($entry.registryDependencies).Count -eq 0) {

        Write-Status `
            "Registry dependencies" `
            "none"
    }
    else {

        Write-Status `
            "Registry dependencies" `
            ($entry.registryDependencies -join ", ")
    }

    Write-Status `
        "CSS dependencies" `
        ($entry.cssDependencies -join ", ")
}


# ------------------------------------------------------------
# Find stale registry entries
# ------------------------------------------------------------

$existingRegistryFiles = @(
    Get-ChildItem `
        -LiteralPath $RegistryComponentsRoot `
        -Filter "*.json" `
        -File |
    Sort-Object Name
)

$generatedNames = @(
    $generatedEntries |
    ForEach-Object {
        $_.name
    }
)

$staleEntries = @(
    $existingRegistryFiles |
    Where-Object {
        $_.BaseName -notin $generatedNames
    }
)


# ------------------------------------------------------------
# Summary
# ------------------------------------------------------------

Write-Section "Registry summary"

Write-Status `
    "Components discovered" `
    "$($componentDirectories.Count)"

Write-Status `
    "Entries generated" `
    "$($generatedEntries.Count)"

Write-Status `
    "Validation failures" `
    "$($validationFailures.Count)"

Write-Status `
    "Stale registry entries" `
    "$($staleEntries.Count)"

if ($validationFailures.Count -gt 0) {

    Write-Host ""
    Write-Host "Validation failures:" -ForegroundColor Red

    foreach ($name in $validationFailures) {

        Write-Host `
            "  - $name" `
            -ForegroundColor Red
    }
}

if ($staleEntries.Count -gt 0) {

    Write-Host ""
    Write-Host "Stale registry entries:" -ForegroundColor Yellow

    foreach ($file in $staleEntries) {

        Write-Host `
            "  - $($file.Name)" `
            -ForegroundColor Yellow
    }
}


# ------------------------------------------------------------
# Stop if invalid
# ------------------------------------------------------------

if ($validationFailures.Count -gt 0) {

    Write-Host ""
    Write-Host `
        "Registry generation stopped because validation failed." `
        -ForegroundColor Red

    exit 1
}


# ------------------------------------------------------------
# PREVIEW MODE
# ------------------------------------------------------------

if (-not $Write) {

    Write-Section "Preview"

    foreach ($entry in $generatedEntries) {

        $target = Join-Path `
            $RegistryComponentsRoot `
            "$($entry.name).json"

        if (Test-Path -LiteralPath $target) {

            Write-Host `
                "  UPDATE  $($entry.name).json" `
                -ForegroundColor Cyan
        }
        else {

            Write-Host `
                "  CREATE  $($entry.name).json" `
                -ForegroundColor Green
        }
    }

    foreach ($file in $staleEntries) {

        Write-Host `
            "  DELETE  $($file.Name)" `
            -ForegroundColor Red
    }

    Write-Host ""
    Write-Host "Preview complete. No files were changed." `
        -ForegroundColor Cyan

    Write-Host ""
    Write-Host "To write the registry:" `
        -ForegroundColor Gray

    Write-Host ""
    Write-Host "  .\scripts\generate-registry.ps1 -Write" `
        -ForegroundColor Green

    Write-Host ""

    exit 0
}


# ------------------------------------------------------------
# WRITE MODE
# ------------------------------------------------------------

Write-Section "Writing component registry entries"

foreach ($entry in $generatedEntries) {

    $target = Join-Path `
        $RegistryComponentsRoot `
        "$($entry.name).json"

    $json = $entry | ConvertTo-Json -Depth 20

    Write-Utf8NoBom `
        -Path $target `
        -Content $json

    Write-Host `
        "  WROTE  $($entry.name).json" `
        -ForegroundColor Green
}


# ------------------------------------------------------------
# Remove stale entries
# ------------------------------------------------------------

if ($staleEntries.Count -gt 0) {

    Write-Section "Removing stale registry entries"

    foreach ($file in $staleEntries) {

        Remove-Item `
            -LiteralPath $file.FullName `
            -Force

        Write-Host `
            "  REMOVED  $($file.Name)" `
            -ForegroundColor Yellow
    }
}


# ------------------------------------------------------------
# Generate registry.json
# ------------------------------------------------------------

Write-Section "Generating registry.json"

$registryNames = @(
    $generatedEntries |
    ForEach-Object {
        $_.name
    } |
    Sort-Object
)

$existingRegistry = Read-JsonFile `
    -Path $RegistryJsonPath

$registryName = "solidcx"
$registryVersion = "0.1.0"
$registryHomepage = "https://solidcx.vercel.app"

if ($null -ne $existingRegistry) {

    if (
        $existingRegistry.PSObject.Properties.Name -contains "name" -and
        -not [string]::IsNullOrWhiteSpace($existingRegistry.name)
    ) {
        $registryName = $existingRegistry.name
    }

    if (
        $existingRegistry.PSObject.Properties.Name -contains "version" -and
        -not [string]::IsNullOrWhiteSpace($existingRegistry.version)
    ) {
        $registryVersion = $existingRegistry.version
    }

    if (
        $existingRegistry.PSObject.Properties.Name -contains "homepage" -and
        -not [string]::IsNullOrWhiteSpace($existingRegistry.homepage)
    ) {
        $registryHomepage = $existingRegistry.homepage
    }
}

$registry = [ordered]@{
    '$schema' = "./registry.schema.json"
    name = $registryName
    version = $registryVersion
    homepage = $registryHomepage
    components = @($registryNames)
}

$registryJson = $registry | ConvertTo-Json -Depth 10

Write-Utf8NoBom `
    -Path $RegistryJsonPath `
    -Content $registryJson

Write-Host `
    "  WROTE  registry.json" `
    -ForegroundColor Green


# ------------------------------------------------------------
# Final report
# ------------------------------------------------------------

Write-Section "Complete"

Write-Status `
    "Component entries" `
    "$($generatedEntries.Count)" `
    ([ConsoleColor]::Green)

Write-Status `
    "Stale entries removed" `
    "$($staleEntries.Count)" `
    ([ConsoleColor]::Yellow)

Write-Status `
    "Registry" `
    "updated" `
    ([ConsoleColor]::Green)

Write-Host ""
Write-Host "SolidCX registry generated successfully." `
    -ForegroundColor Green

Write-Host ""