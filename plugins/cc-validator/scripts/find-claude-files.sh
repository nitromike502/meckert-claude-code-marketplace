#!/bin/bash
# find-claude-files.sh
# Locates Claude Code agent and command markdown files
#
# Usage: ./find-claude-files.sh <search_path> [--type agents|commands|all]
#
# Examples:
#   ./find-claude-files.sh /home/meckert                    # Find all in path
#   ./find-claude-files.sh /home/marketplace --type agents  # Find only agents
#   ./find-claude-files.sh . --type commands                # Find only commands

set -e

# Defaults
SEARCH_PATH=""
FILE_TYPE="all"

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --type)
            FILE_TYPE="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 <search_path> [--type agents|commands|all]"
            echo ""
            echo "Locates Claude Code agent and command markdown files"
            echo ""
            echo "Options:"
            echo "  --type    Filter by type: agents, commands, or all (default: all)"
            echo "  -h        Show this help message"
            exit 0
            ;;
        *)
            if [[ -z "$SEARCH_PATH" ]]; then
                SEARCH_PATH="$1"
            else
                echo "Error: Unknown argument '$1'" >&2
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate search path
if [[ -z "$SEARCH_PATH" ]]; then
    echo "Error: Search path is required" >&2
    echo "Usage: $0 <search_path> [--type agents|commands|all]" >&2
    exit 1
fi

if [[ ! -d "$SEARCH_PATH" ]]; then
    echo "Error: '$SEARCH_PATH' is not a valid directory" >&2
    exit 1
fi

# Convert to absolute path
SEARCH_PATH=$(cd "$SEARCH_PATH" && pwd)

# If path doesn't end with .claude but .claude exists inside, use that
# This allows passing a project root and automatically finding .claude
if [[ ! "$SEARCH_PATH" =~ /\.claude$ ]] && [[ -d "$SEARCH_PATH/.claude" ]]; then
    SEARCH_PATH="$SEARCH_PATH/.claude"
fi

# Find files based on type
find_agents() {
    find "$SEARCH_PATH" -type f \( -path "*/.claude/agents/*.md" -o -path "*/agents/*.md" \) 2>/dev/null | grep -v ".deleted" | sort
}

find_commands() {
    find "$SEARCH_PATH" -type f \( -path "*/.claude/commands/*.md" -o -path "*/commands/*.md" \) 2>/dev/null | grep -v ".deleted" | sort
}

case "$FILE_TYPE" in
    agents)
        find_agents
        ;;
    commands)
        find_commands
        ;;
    all)
        find_agents
        find_commands
        ;;
    *)
        echo "Error: Invalid type '$FILE_TYPE'. Use: agents, commands, or all" >&2
        exit 1
        ;;
esac
