#!/usr/bin/env bash

set -euo pipefail

# ---------------------------------------------------
# Convert any image file to WEBP using ffmpeg
#
# Usage:
#   ./image-to-webp.sh <input-image> <output-image> [quality]
#
# Example:
#   ./.code/scripts/image-to-webp.sh ./myimage.png ./public/out_image.webp
#
# Default quality = 80
# Quality range = 0-100 (higher is better quality, larger file)
# ---------------------------------------------------

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <input-image> <output-image> [quality]"
  exit 1
fi

INPUT_IMAGE="$1"
OUTPUT_IMAGE="$2"
QUALITY="${3:-80}"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "Error: ffmpeg is not installed or not available on PATH"
  exit 1
fi

if [[ ! -f "$INPUT_IMAGE" ]]; then
  echo "Error: Input image does not exist: $INPUT_IMAGE"
  exit 1
fi

if [[ ! "$QUALITY" =~ ^[0-9]+$ ]] || (( QUALITY < 0 || QUALITY > 100 )); then
  echo "Error: quality must be an integer between 0 and 100"
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_IMAGE")"

echo "Converting '$INPUT_IMAGE' -> '$OUTPUT_IMAGE'"
echo "Quality: $QUALITY"

ffmpeg -y \
  -i "$INPUT_IMAGE" \
  -vcodec libwebp \
  -quality "$QUALITY" \
  "$OUTPUT_IMAGE"

echo "Done."