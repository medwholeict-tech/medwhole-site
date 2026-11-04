[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

function Invoke-Checked {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Command,

    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
  )

  & $Command @Arguments
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $Command $($Arguments -join ' ')"
  }
}

Invoke-Checked git rev-parse --is-inside-work-tree | Out-Null

$workingTreeChanges = @(git status --porcelain)
if ($LASTEXITCODE -ne 0) {
  throw "Unable to read the Git working tree."
}

if ($workingTreeChanges.Count -gt 0) {
  throw "Production deployment stopped: commit every intended change first. This keeps the deployed files tied to one exact Git commit."
}

$commitSha = (git rev-parse HEAD).Trim()
$branchName = (git branch --show-current).Trim()

if ([string]::IsNullOrWhiteSpace($branchName)) {
  $branchName = "detached-head"
}

Write-Host "Verifying commit $commitSha on $branchName..."
Invoke-Checked pnpm run verify

Write-Host "Deploying the verified source for commit $commitSha..."
Invoke-Checked npx --yes vercel@59.16.0 deploy --prod --yes `
  --meta "gitCommitSha=$commitSha" `
  --meta "gitBranch=$branchName" `
  --meta "deploymentSource=local-git"

Write-Host "Production now corresponds to Git commit $commitSha."
