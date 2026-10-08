param(
  [Parameter(Mandatory = $true)]
  [string]$Name
)

$PascalName = $Name.Substring(0, 1).ToUpper() + $Name.Substring(1)

$ComponentDir = "packages/ui/src/components/$Name"
$ComponentsIndex = "packages/ui/src/components/index.ts"
$BarrelExport = "export * from './$Name'"

# Create component directory
New-Item -ItemType Directory -Force -Path $ComponentDir | Out-Null

# Create component
@"
import type { Component, JSX } from 'solid-js'
import { splitProps } from 'solid-js'
import { cx } from '@solidcx/cx'

import './$Name.scss'

export interface ${PascalName}Props
  extends JSX.HTMLAttributes<HTMLDivElement> {
  class?: string
}

export const ${PascalName}: Component<${PascalName}Props> = (props) => {
  const [local, rest] = splitProps(props, ['class'])

  return (
    <div
      {...rest}
      class={cx('scx-$Name', local.class)}
    />
  )
}
"@ | Set-Content "$ComponentDir/$PascalName.tsx"

# Create styles
@"
.scx-$Name {
}
"@ | Set-Content "$ComponentDir/$Name.scss"

# Create component barrel
@"
export { $PascalName } from './$PascalName'

export type {
  ${PascalName}Props,
} from './$PascalName'
"@ | Set-Content "$ComponentDir/index.ts"

# Update components/index.ts
if (-not (Test-Path $ComponentsIndex)) {
  New-Item -ItemType File -Force -Path $ComponentsIndex | Out-Null
}

$ExistingIndex = Get-Content $ComponentsIndex -Raw

if ($ExistingIndex -notmatch [regex]::Escape($BarrelExport)) {
  if ($ExistingIndex.Length -gt 0 -and -not $ExistingIndex.EndsWith("`n")) {
    Add-Content $ComponentsIndex ""
  }

  Add-Content $ComponentsIndex $BarrelExport
}

Write-Host ""
Write-Host "Created ${PascalName}:"
Write-Host "  $ComponentDir/$PascalName.tsx"
Write-Host "  $ComponentDir/$Name.scss"
Write-Host "  $ComponentDir/index.ts"
Write-Host ""
Write-Host "Updated:"
Write-Host "  $ComponentsIndex"
Write-Host ""