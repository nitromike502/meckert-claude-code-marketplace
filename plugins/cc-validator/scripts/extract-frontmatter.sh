#!/bin/bash
# extract-frontmatter.sh
# Extracts frontmatter (first X lines) from Claude Code files
#
# Usage:
#   ./extract-frontmatter.sh <file_or_directory> [--lines N]
#   cat file_list.txt | ./extract-frontmatter.sh --stdin [--lines N]
#
# Examples:
#   ./extract-frontmatter.sh /path/to/agent.md                    # Single file
#   ./extract-frontmatter.sh /home/meckert/.claude/agents/        # Directory
#   ./find-claude-files.sh /home | ./extract-frontmatter.sh --stdin  # Pipe from finder
#   ./extract-frontmatter.sh file.md --lines 30                   # Custom line count

set -e

# Defaults
LINES=20
INPUT_PATH=""
USE_STDIN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --lines)
            LINES="$2"
            shift 2
            ;;
        --stdin)
            USE_STDIN=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 <file_or_directory> [--lines N]"
            echo "       $0 --stdin [--lines N]"
            echo ""
            echo "Extracts frontmatter from Claude Code markdown files"
            echo ""
            echo "Options:"
            echo "  --lines N   Number of lines to extract (default: 20)"
            echo "  --stdin     Read file paths from stdin (one per line)"
            echo "  -h          Show this help message"
            echo ""
            echo "Output format:"
            echo "  === FILE: <filepath> ==="
            echo "  === PROJECT: <project_directory> ==="
            echo "  <first N lines of file>"
            echo "  === END ==="
            exit 0
            ;;
        *)
            if [[ -z "$INPUT_PATH" ]]; then
                INPUT_PATH="$1"
            else
                echo "Error: Unknown argument '$1'" >&2
                exit 1
            fi
            shift
            ;;
    esac
done

# Function to extract project directory from file path
get_project_dir() {
    local filepath="$1"
    local dir=$(dirname "$filepath")

    # Walk up looking for .claude or .git directory
    while [[ "$dir" != "/" && "$dir" != "." ]]; do
        if [[ -d "$dir/.claude" ]] || [[ -d "$dir/.git" ]]; then
            echo "$dir"
            return
        fi
        dir=$(dirname "$dir")
    done

    # If no project root found, use parent of .claude/agents or .claude/commands
    dir=$(dirname "$filepath")
    if [[ "$dir" == *"/.claude/agents"* ]] || [[ "$dir" == *"/.claude/commands"* ]]; then
        echo "$dir" | sed 's|/.claude/.*||'
    else
        echo "unknown"
    fi
}

# Function to process a single file
process_file() {
    local filepath="$1"

    if [[ ! -f "$filepath" ]]; then
        echo "Warning: File not found: $filepath" >&2
        return
    fi

    local project_dir=$(get_project_dir "$filepath")

    echo "=== FILE: $filepath ==="
    echo "=== PROJECT: $project_dir ==="
    head -n "$LINES" "$filepath"
    echo ""
    echo "=== END ==="
    echo ""
}

# Main logic
if $USE_STDIN; then
    # Read file paths from stdin
    while IFS= read -r filepath; do
        [[ -n "$filepath" ]] && process_file "$filepath"
    done
elif [[ -z "$INPUT_PATH" ]]; then
    echo "Error: Provide a file/directory path or use --stdin" >&2
    echo "Usage: $0 <file_or_directory> [--lines N]" >&2
    exit 1
elif [[ -f "$INPUT_PATH" ]]; then
    # Single file
    process_file "$INPUT_PATH"
elif [[ -d "$INPUT_PATH" ]]; then
    # Directory - find all .md files
    find "$INPUT_PATH" -type f -name "*.md" | while read -r filepath; do
        process_file "$filepath"
    done
else
    echo "Error: '$INPUT_PATH' is not a valid file or directory" >&2
    exit 1
fi
