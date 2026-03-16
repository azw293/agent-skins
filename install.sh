#!/usr/bin/env bash
# skins.sh installer
# Usage: ./install.sh <skin-name> [--target <file>] [--global]
#
# Examples:
#   ./install.sh jack-sparrow                    # append to ./CLAUDE.md
#   ./install.sh yoda --target AGENTS.md         # append to custom file
#   ./install.sh sherlock-holmes --global         # install to ~/.claude/skins/

set -e

SKIN_NAME="$1"
TARGET="CLAUDE.md"
GLOBAL=false
SKINS_DIR="$(dirname "$0")/skins"

# Parse args
shift
while [[ $# -gt 0 ]]; do
  case "$1" in
    --target) TARGET="$2"; shift 2 ;;
    --global) GLOBAL=true; shift ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

# Validate skin name
if [ -z "$SKIN_NAME" ]; then
  echo "Usage: ./install.sh <skin-name> [--target <file>] [--global]"
  echo ""
  echo "Available skins:"
  ls "$SKINS_DIR"
  exit 1
fi

SKIN_FILE="$SKINS_DIR/$SKIN_NAME/SKIN.md"

if [ ! -f "$SKIN_FILE" ]; then
  echo "❌ Skin not found: $SKIN_NAME"
  echo ""
  echo "Available skins:"
  ls "$SKINS_DIR"
  exit 1
fi

if [ "$GLOBAL" = true ]; then
  # Global install: copy to ~/.claude/skins/
  GLOBAL_DIR="$HOME/.claude/skins/$SKIN_NAME"
  mkdir -p "$GLOBAL_DIR"
  cp "$SKIN_FILE" "$GLOBAL_DIR/SKIN.md"
  echo "✓ Installed $SKIN_NAME globally to ~/.claude/skins/$SKIN_NAME/SKIN.md"
  echo ""
  echo "To activate, add this to your CLAUDE.md:"
  echo "  $(cat "$GLOBAL_DIR/SKIN.md" | head -5)"
else
  # Project install: append to target file
  if [ ! -f "$TARGET" ]; then
    touch "$TARGET"
    echo "Created $TARGET"
  fi

  # Check if skin already installed
  DISPLAY_NAME=$(grep "^display-name:" "$SKIN_FILE" | sed 's/display-name: *//' | tr -d '"')
  if grep -q "# $DISPLAY_NAME" "$TARGET" 2>/dev/null; then
    echo "⚠️  $SKIN_NAME is already installed in $TARGET"
    exit 0
  fi

  echo "" >> "$TARGET"
  echo "---" >> "$TARGET"
  echo "# Skin: $SKIN_NAME" >> "$TARGET"
  cat "$SKIN_FILE" >> "$TARGET"
  echo "" >> "$TARGET"

  echo "✓ Installed skin '$SKIN_NAME' → $TARGET"
  echo ""
  echo "Your agent will now respond as: $DISPLAY_NAME"
fi
