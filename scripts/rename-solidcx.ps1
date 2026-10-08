
param(
    [switch]$Preview
)

$ErrorActionPreference = "Stop"

# ============================================================
# SolidCX Namespace Migration
#
# SolidCN -> SolidCX
# solidcn -> solidcx
# scn-*   -> scx-*
#
# Usage:
#
#   .\scripts\rename-solidcx.ps1 -Preview
#
#   .\scripts\rename-solidcx.ps1
# ============================================================

$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path

# ============================================================
# Configuration
# ============================================================

$ExcludedDirectories = @(
    ".git",
    "node_modules",
    ".turbo",
    "dist",
    "build",
    ".output",
    ".vinxi",
    ".vercel",
    "coverage"
)

$ExcludedFiles = @(
    "scripts/rename-solidcx.ps1"
)

$AllowedExtensions = @(
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".scss",
    ".css",
    ".html",
    ".md",
    ".mdx",
    ".yaml",
    ".yml",
    ".ps1"
)

# ============================================================
# Replacement rules
#
# IMPORTANT:
# The order matters.
#
# Specific references are migrated before generic references.
# ============================================================

$Replacements = @(
    @{
        Name = "Project URL"
        Pattern = "https://solidcn\.dev"
        Replacement = "https://solidcx.vercel.app"
    },
    @{
        Name = "Package namespace"
        Pattern = "@solidcn/"
        Replacement = "@solidcx/"
    },
    @{
        Name = "Brand name"
        Pattern = "SolidCN"
        Replacement = "SolidCX"
    },
    @{
        Name = "Package/project name"
        Pattern = "solidcn"
        Replacement = "solidcx"
    },
    @{
        Name = "CSS custom properties"
        Pattern = "--scn-"
        Replacement = "--scx-"
    },
    @{
        Name = "Data attributes"
        Pattern = "data-scn-"
        Replacement = "data-scx-"
    },
    @{
        Name = "CSS namespace"
        Pattern = "scn-"
        Replacement = "scx-"
    }
)

# ============================================================
# Helper: determine whether a file should be processed
# ============================================================

function Test-ShouldProcessFile {
    param(
        [System.IO.FileInfo]$File
    )

    $RelativePath = $File.FullName.Substring(
        $Root.Length + 1
    ).Replace("\", "/")

    # Excluded files
    if ($ExcludedFiles -contains $RelativePath) {
        return $false
    }

    # Excluded directories
    $PathParts = $RelativePath.Split("/")

    foreach ($Part in $PathParts) {

        if ($ExcludedDirectories -contains $Part) {
            return $false
        }
    }

    # Allowed extensions
    if ($AllowedExtensions -notcontains $File.Extension.ToLowerInvariant()) {
        return $false
    }

    return $true
}

# ============================================================
# Header
# ============================================================

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "        SolidCN -> SolidCX Migration" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Repository: " -NoNewline
Write-Host $Root -ForegroundColor Yellow

Write-Host ""

if ($Preview) {

    Write-Host "Mode: " -NoNewline
    Write-Host "PREVIEW" -ForegroundColor Yellow
}
else {

    Write-Host "Mode: " -NoNewline
    Write-Host "MIGRATION" -ForegroundColor Green
}

Write-Host ""

# ============================================================
# Discover files
# ============================================================

$Files = Get-ChildItem `
    -Path $Root `
    -Recurse `
    -File `
    -ErrorAction SilentlyContinue |
    Where-Object {
        Test-ShouldProcessFile $_
    }

Write-Host "Files scanned: $($Files.Count)" -ForegroundColor DarkGray
Write-Host ""

# ============================================================
# Counters
# ============================================================

$ChangedFiles = 0
$ChangedOccurrences = 0

$ReplacementStatistics = @{}

foreach ($Replacement in $Replacements) {
    $ReplacementStatistics[$Replacement.Name] = 0
}

# ============================================================
# Process files
# ============================================================

foreach ($File in $Files) {

    $Content = Get-Content `
        -LiteralPath $File.FullName `
        -Raw `
        -Encoding UTF8

    if ($null -eq $Content) {
        continue
    }

    $OriginalContent = $Content

    foreach ($Replacement in $Replacements) {

        $Pattern = $Replacement.Pattern
        $New = $Replacement.Replacement
        $Name = $Replacement.Name

        $FoundMatches = [regex]::Matches(
            $Content,
            $Pattern
        )

        if ($FoundMatches.Count -eq 0) {
            continue
        }

        $Count = $FoundMatches.Count

        $ChangedOccurrences += $Count
        $ReplacementStatistics[$Name] += $Count

        $Content = [regex]::Replace(
            $Content,
            $Pattern,
            $New
        )
    }

    if ($Content -eq $OriginalContent) {
        continue
    }

    $ChangedFiles++

    $RelativePath = $File.FullName.Substring(
        $Root.Length + 1
    )

    Write-Host "CHANGE: " -ForegroundColor Green -NoNewline
    Write-Host $RelativePath

    if (-not $Preview) {

        Set-Content `
            -LiteralPath $File.FullName `
            -Value $Content `
            -Encoding UTF8 `
            -NoNewline
    }
}

# ============================================================
# Summary
# ============================================================

Write-Host ""
Write-Host "----------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

if ($Preview) {

    Write-Host "PREVIEW ONLY" -ForegroundColor Yellow
}
else {

    Write-Host "MIGRATION COMPLETE" -ForegroundColor Green
}

Write-Host ""

Write-Host "Files scanned:                  $($Files.Count)"
Write-Host "Files that would change:       $ChangedFiles"
Write-Host "Occurrences that would change: $ChangedOccurrences"

Write-Host ""

Write-Host "Replacement breakdown:" -ForegroundColor Cyan
Write-Host ""

foreach ($Replacement in $Replacements) {

    $Name = $Replacement.Name
    $Count = $ReplacementStatistics[$Name]

    Write-Host ("  {0,-25} {1}" -f $Name, $Count)
}

Write-Host ""

if ($Preview) {

    Write-Host "No files were modified." -ForegroundColor Yellow

    Write-Host ""
    Write-Host "If the preview looks correct, run:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "    .\scripts\rename-solidcx.ps1" -ForegroundColor White
}
else {

    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "1. Search for remaining SolidCN references:"
    Write-Host ""

    Write-Host "   Get-ChildItem . -Recurse -File |"
    Write-Host "       Where-Object {"
    Write-Host "           `$_.FullName -notmatch '\\(node_modules|\.git|dist|build|\.turbo|coverage)\\'"
    Write-Host "       } |"
    Write-Host "       Select-String -Pattern 'scn-|@solidcn/|solidcn|SolidCN'"

    Write-Host ""

    Write-Host "2. Check types:"
    Write-Host ""
    Write-Host "   pnpm check-types"

    Write-Host ""

    Write-Host "3. Build:"
    Write-Host ""
    Write-Host "   pnpm build"

    Write-Host ""

    Write-Host "4. Review changes:"
    Write-Host ""
    Write-Host "   git diff --stat"
    Write-Host ""
    Write-Host "   git diff"

    Write-Host ""

    Write-Host "5. Commit:"
    Write-Host ""
    Write-Host '   git add .'
    Write-Host '   git commit -m "refactor: rename SolidCN namespace to SolidCX"'
    Write-Host '   git push'

    Write-Host ""
}

