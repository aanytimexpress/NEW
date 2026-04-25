param(
  [string]$RepoName = "bogura-kothon",
  [string]$Visibility = "public"
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI (gh) is required."
}

if (-not (Test-Path ".git")) {
  git init
}

git add .
git commit -m "Initial newsroom platform scaffold" --allow-empty

gh repo create $RepoName --$Visibility --source . --remote origin --push

Write-Host "Repository created and pushed: $RepoName"
