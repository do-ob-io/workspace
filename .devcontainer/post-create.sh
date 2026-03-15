#!/usr/bin/env zsh

echo "============================== POST CREATE ========================================"

# ------------------------------------------------------------------------------
# Install Astral.sh UV and TY
# ------------------------------------------------------------------------------
if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

uv tool install ty@latest
uv tool install ruff@latest
uv sync --all-packages

npm install -g eslint@9 typescript vitest @go-task/cli shadcn

# ------------------------------------------------------------------------------
# Install git-all shell function into .zshrc
# ------------------------------------------------------------------------------
if ! grep -q 'git-all()' ~/.zshrc 2>/dev/null; then
  cat >> ~/.zshrc << 'GITALL'

# ------------------------------------------------------------------------------
# git-all: Run git commands across all repos under nodejs/
# Usage: git-all add .
#        git-all commit -m "my message"
#        git-all status
# ------------------------------------------------------------------------------
git-all() {
  local base="${GIT_ALL_BASE:-nodejs}"
  for dir in "$base"/*/; do
    if [[ -d "$dir/.git" ]]; then
      echo "=== $dir ==="
      git -C "$dir" "$@"
    fi
  done
}
GITALL
fi

# ------------------------------------------------------------------------------
# Install project dependencies
# ------------------------------------------------------------------------------
pnpm install

# ------------------------------------------------------------------------------
# Install Playwright browser binaries and OS dependencies
# ------------------------------------------------------------------------------
pnpm exec playwright install --with-deps chromium firefox webkit

echo "============================== POST CREATE COMPLETE ================================="