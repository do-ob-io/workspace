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

npm install -g eslint typescript vitest @go-task/cli shadcn

# ------------------------------------------------------------------------------
# Install project dependencies
# ------------------------------------------------------------------------------
pnpm install

echo "============================== POST CREATE COMPLETE ================================="