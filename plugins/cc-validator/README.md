# cc-validator

Validate and fix YAML frontmatter in Claude Code agent and command files.

## Overview

This plugin helps Claude Code plugin developers ensure their agent and command frontmatter follows the correct schema. It validates properties, identifies issues, and proposes fixes.

## Features

- Validates frontmatter in `.claude/agents/` and `.claude/commands/` files
- Reports all properties with validation status
- Proposes fixes for common issues
- Optional schema verification via `claude-code-guide` agent
- Interactive fix approval workflow

## Installation

Install from the Claude Code marketplace or add to your project's `.claude-plugin/` directory.

## Usage

```bash
# Validate all files in a project
/cc-validator:validate-frontmatter /path/to/project

# Validate only agents
/cc-validator:validate-frontmatter /path/to/project --type agents

# Validate only commands
/cc-validator:validate-frontmatter /path/to/project/.claude --type commands
```

## Workflow

1. **Discovery** - Finds all agent and command files in the path
2. **Analysis** - Extracts and validates frontmatter against schema
3. **Report** - Displays validation status for each property in each file
4. **Checkpoint** - Choose to see fixes, verify schema first, or stop
5. **Propose Fixes** - Shows current vs proposed frontmatter for each issue
6. **Apply Fixes** - After your review, applies approved changes

## Validation Rules

### Agents

| Property | Required | Valid Values |
|----------|----------|--------------|
| `name` | Yes | `^[a-z0-9-]{1,64}$` |
| `description` | Yes | Any text (max 1024 chars) |
| `tools` | No | Comma-separated tool names |
| `model` | No | `sonnet`, `opus`, `haiku`, `inherit` |
| `permissionMode` | No | `default`, `acceptEdits`, `bypassPermissions`, `plan`, `ignore` |
| `skills` | No | Comma-separated skill names |
| `color` | No | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` |

### Commands

| Property | Required | Valid Values |
|----------|----------|--------------|
| `description` | No | Any text |
| `argument-hint` | No | Any text |
| `allowed-tools` | No | Comma-separated tool names |
| `model` | No | Model identifier |
| `disable-model-invocation` | No | `true`, `false` |

**Not valid for commands:** `name`, `color`, `permissionMode`, `skills`

## Common Issues Detected

- Missing required properties (name, description for agents)
- Invalid properties for file type (e.g., `color` in commands)
- YAML arrays instead of comma-separated strings
- Block scalars in descriptions
- Invalid model values
- String booleans (`"true"` instead of `true`)

## Components

- `/cc-validator:validate-frontmatter` - Main validation command
- `scripts/find-claude-files.sh` - Discovers agent/command files
- `scripts/extract-frontmatter.sh` - Extracts frontmatter efficiently
- `schemas/frontmatter-schema.md` - Validation rules reference

## License

MIT
