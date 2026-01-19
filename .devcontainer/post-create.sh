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

npm install -g eslint typescript vitest @go-task/cli

# ------------------------------------------------------------------------------
# Install project dependencies
# ------------------------------------------------------------------------------
pnpm install

# Configure subuid/subgid for rootless Podman (if not already configured)
if ! grep -q "^vscode:" /etc/subuid 2>/dev/null; then
    sudo sh -c 'echo "vscode:100000:65536" >> /etc/subuid'
    sudo sh -c 'echo "vscode:100000:65536" >> /etc/subgid'
fi

# Configure Podman storage for rootless operation
mkdir -p ~/.config/containers
cat > ~/.config/containers/storage.conf << 'EOF'
[storage]
driver = "overlay"

[storage.options.overlay]
mount_program = "/usr/bin/fuse-overlayfs"
EOF

echo "============================== POST CREATE COMPLETE ================================="