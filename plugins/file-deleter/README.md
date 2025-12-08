# File Deleter Plugin

A comprehensive Claude Code plugin that provides safe file deletion by moving files to a recoverable `.deleted/` trash folder instead of permanently deleting them. The plugin combines a PreToolUse hook that blocks dangerous `rm` commands with a skill that provides safe deletion functionality.

## Features

### PreToolUse Hook
- **Blocks dangerous `rm` commands**: Prevents `rm -rf`, `rm -fr`, and all variations
- **Blocks `.env` file access**: Protects sensitive environment files from accidental exposure
- **Helpful error messages**: Directs Claude to use the safe deletion skill when rm commands are blocked
- **Comprehensive pattern matching**: Detects various forms of dangerous deletion commands

### File Deleter Skill
- **Safe deletion**: Moves files/directories to `.deleted/` instead of permanent removal
- **Preserves structure**: Maintains original directory hierarchy within `.deleted/`
- **Automatic `.gitignore`**: Creates/maintains `.gitignore` in `.deleted/` to ignore all contents
- **Supports both files and directories**: Handles individual files and entire directory trees
- **Handles absolute and relative paths**: Works regardless of how paths are specified
- **Overwrites existing**: Replaces files/directories if they already exist in `.deleted/`
- **Recoverable**: All deleted files remain in `.deleted/` and can be manually restored

## Installation

This plugin is installed as a local user plugin at:
```
~/.claude/plugins/file-deleter/
```

The plugin should be automatically detected by Claude Code. If not, you may need to restart Claude Code.

## Usage

### Automatic Hook Behavior

When Claude Code attempts to execute dangerous `rm` commands, the hook will automatically block them and show an error message:

```
BLOCKED: Dangerous rm command detected and prevented

Use the 'file-deleter' skill instead to safely move files to .deleted/ folder.
The skill will preserve directory structure and allow recovery if needed.
```

Claude will then automatically use the file-deleter skill to perform safe deletion.

### Manual Skill Usage

The deletion script can also be invoked directly:

```bash
node <skill-base-dir>/scripts/delete-file.js <path1> [path2] [path3] ...
```

**Examples:**
```bash
# Delete single file
node ~/.claude/plugins/file-deleter/skills/file-deleter/scripts/delete-file.js src/old-component.tsx

# Delete multiple files
node ~/.claude/plugins/file-deleter/skills/file-deleter/scripts/delete-file.js file1.txt file2.js dir/file3.md

# Delete entire directory
node ~/.claude/plugins/file-deleter/skills/file-deleter/scripts/delete-file.js old-features/

# Delete multiple directories and files
node ~/.claude/plugins/file-deleter/skills/file-deleter/scripts/delete-file.js temp/ build/ old-file.txt
```

## How It Works

### Project Root Detection

The deletion script automatically finds the project root by searching upward from the current working directory for both `.git` and `.claude` directories. This ensures the `.deleted/` folder is created at the project root regardless of where the script is executed from.

### File Movement Process

1. Script resolves all file paths (absolute or relative)
2. Verifies files exist (skips non-existent with warnings)
3. Calculates relative path from project root
4. Creates destination directory structure in `.deleted/`
5. Moves files while preserving directory hierarchy
6. Creates/updates `.gitignore` in `.deleted/` to ignore all contents

### Hook Blocking Patterns

The PreToolUse hook blocks:

**Dangerous rm patterns:**
- `rm -rf`, `rm -fr`, `rm -Rf` and all flag variations
- `rm --recursive --force` and similar long-form flags
- `rm -r` with dangerous paths (root, home, wildcards, parent references)
- Recursive rm with wildcards, current directory, or dangerous targets

**Protected files:**
- `.env` files (but allows `.env.sample`)
- Blocks Read, Edit, MultiEdit, Write, and Bash access to `.env` files

## Recovery

To recover deleted files:

1. Navigate to `.deleted/` in your project root
2. Find the file at its preserved path structure
3. Manually move it back to its original location

Example:
```bash
# Original file was at: src/components/Button.tsx
# After deletion it's at: .deleted/src/components/Button.tsx

# To recover:
mv .deleted/src/components/Button.tsx src/components/Button.tsx
```

## Plugin Structure

```
file-deleter/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── hooks/
│   └── hooks.json               # PreToolUse hook configuration
├── scripts/
│   └── hook_pre_tool_use.js     # Hook script that blocks rm commands
├── skills/
│   └── file-deleter/
│       ├── SKILL.md              # Skill definition
│       └── scripts/
│           └── delete-file.js    # Safe deletion script
└── README.md                     # This file
```

## Environment Variables

The hook uses the following environment variables:

- `${CLAUDE_PLUGIN_ROOT}`: Automatically set by Claude Code to the plugin directory
- `${CLAUDE_PROJECT_DIR}`: Project root directory (if available)

## Script Behavior

### Success Cases
- Files/directories moved successfully
- Provides confirmation message for each item
- Shows summary count of moved vs skipped items

### Skip Cases (with warnings)
- File/directory does not exist
- Path is invalid

### Overwrite Behavior
- If destination already exists in `.deleted/`, it will be overwritten
- No prompts or confirmations (automatic overwrite)

## Security Notes

This plugin:
- ✅ Prevents accidental permanent deletion
- ✅ Blocks dangerous rm commands before execution
- ✅ Protects sensitive `.env` files
- ✅ Maintains file recoverability
- ✅ Uses exit code 2 to properly block dangerous operations

## License

MIT

## Author

meckert

## Version

1.0.0
