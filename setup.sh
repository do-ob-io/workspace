#!/bin/bash

# Clone core projects
git clone https://github.com/do-ob-io/core.git nodejs/core
git clone https://github.com/do-ob-io/data.git nodejs/data
git clone https://github.com/do-ob-io/hook.git nodejs/hook
git clone https://github.com/do-ob-io/ui.git nodejs/ui

# Install dependencies
pnpm install