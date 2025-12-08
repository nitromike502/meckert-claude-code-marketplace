#!/bin/bash
# Archive a session summary with timestamp
# Usage: archive-summary.sh <path-to-session-summary.md>

set -e

if [ -z "$1" ]; then
  echo "Error: No summary file path provided" >&2
  echo "Usage: $0 <path-to-session-summary.md>" >&2
  exit 1
fi

SUMMARY_FILE="$1"

if [ ! -f "$SUMMARY_FILE" ]; then
  echo "Error: Summary file not found: $SUMMARY_FILE" >&2
  exit 1
fi

# Get the directory containing the summary (should be .claude/)
CLAUDE_DIR=$(dirname "$SUMMARY_FILE")

# Create summaries directory if it doesn't exist
SUMMARIES_DIR="$CLAUDE_DIR/summaries"
mkdir -p "$SUMMARIES_DIR"

# Generate timestamp: YYYY-MM-DD-HHmmss
TIMESTAMP=$(date +%Y-%m-%d-%H%M%S)

# Create archived filename
ARCHIVE_FILE="$SUMMARIES_DIR/${TIMESTAMP}-summary.md"

# Copy the summary to archive
cp "$SUMMARY_FILE" "$ARCHIVE_FILE"

# Output the archived path for the agent to report
echo "$ARCHIVE_FILE"
