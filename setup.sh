#!/usr/bin/env bash
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Clone core projects
git clone https://github.com/do-ob-io/core.git "${SCRIPT_DIR}/nodejs/core"
git clone https://github.com/do-ob-io/data.git "${SCRIPT_DIR}/nodejs/data"
git clone https://github.com/do-ob-io/hook.git "${SCRIPT_DIR}/nodejs/hook"
git clone https://github.com/do-ob-io/ui.git "${SCRIPT_DIR}/nodejs/ui"

# Install dependencies
pnpm install --prefix "${SCRIPT_DIR}"