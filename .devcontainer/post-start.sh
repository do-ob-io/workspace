#!/usr/bin/env zsh

# Configure git signing key from environment variable if it exists
if [[ -n "$SIGNING_KEY" ]]; then
  echo "Configuring git signing key from SIGNING_KEY environment variable..."
  git config --global user.signingkey "$SIGNING_KEY"
  echo "Git signing key configured: $SIGNING_KEY"
fi
