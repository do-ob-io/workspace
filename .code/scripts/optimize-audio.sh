#!/usr/bin/env bash

set -euo pipefail

# ---------------------------------------------------
# Ultra-optimized audio -> OGG (Opus) encoder
#
# Usage:
#   ./optimize-audio.sh <input-file> <output-file> [bitrate]
#
# Examples:
#   ./optimize-audio.sh input.mp3 output.ogg
#   ./optimize-audio.sh input.mp3 output.ogg 32k
#
# Default bitrate = 16k (ultra small)
# ---------------------------------------------------

if [[ $# -lt 2 || $# -gt 3 ]]; then
  echo "Usage: $0 <input-file> <output-file> [bitrate]"
  exit 1
fi

INPUT="$1"
OUTPUT="$2"
BITRATE="${3:-16k}"   # Optional arg with default

# Validate input exists
if [[ ! -f "$INPUT" ]]; then
  echo "Error: Input file does not exist: $INPUT"
  exit 1
fi

echo "Encoding '$INPUT' -> '$OUTPUT'"
echo "Bitrate: $BITRATE (Opus ultra-optimized)"

ffmpeg -y \
  -i "$INPUT" \
  -map_metadata -1 \
  -vn \
  -ac 1 \
  -ar 16000 \
  -c:a libopus \
  -b:a "$BITRATE" \
  -vbr on \
  -compression_level 10 \
  -frame_duration 60 \
  "$OUTPUT"

echo "Done."