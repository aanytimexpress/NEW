#!/usr/bin/env bash
set -euo pipefail

REPO_NAME="${1:-bogura-kothon}"
VISIBILITY="${2:-public}"

command -v gh >/dev/null 2>&1 || { echo "GitHub CLI (gh) is required"; exit 1; }

if [ ! -d ".git" ]; then
  git init
fi

git add .
git commit -m "Initial newsroom platform scaffold" --allow-empty
gh repo create "$REPO_NAME" --"$VISIBILITY" --source . --remote origin --push

echo "Repository created and pushed: $REPO_NAME"
