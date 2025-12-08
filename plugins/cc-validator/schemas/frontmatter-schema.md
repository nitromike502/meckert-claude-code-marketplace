# Claude Code Frontmatter Schema Definition

This document defines the valid YAML frontmatter properties for Claude Code subagents and slash commands.

---

## Subagent Frontmatter (`agents/*.md`)

| Property | Required | Type | Valid Values | Default | Notes |
|----------|----------|------|--------------|---------|-------|
| `name` | **YES** | String | `^[a-z0-9-]{1,64}$` | - | Lowercase letters, numbers, hyphens only. No leading/trailing hyphens. |
| `description` | **YES** | String | Any text (max 1024 chars) | - | Determines when Claude delegates to this agent. Use single quotes if contains `\n` or special chars. |
| `tools` | No | Comma-separated string | Valid tool names | Inherits all | e.g., `Read, Grep, Glob, Bash(git:*)` |
| `model` | No | String | `sonnet`, `opus`, `haiku`, `inherit` | `sonnet` | Which Claude model runs the agent |
| `permissionMode` | No | String | `default`, `acceptEdits`, `bypassPermissions`, `plan`, `ignore` | `default` | How agent handles permission requests |
| `skills` | No | Comma-separated string | Valid skill names | None | Auto-loads skills when agent starts |
| `color` | No | String | `red`, `blue`, `green`, `yellow`, `purple`, `orange`, `pink`, `cyan` | None | Terminal display color |

### Valid Tools (Standard)

```
Read, Write, Edit, MultiEdit, Glob, Grep, Bash, WebFetch, WebSearch,
Task, TodoWrite, AskUserQuestion, NotebookEdit, EnterPlanMode, ExitPlanMode,
Skill, SlashCommand, BashOutput, KillShell
```

Tools can be scoped: `Bash(git:*)`, `Bash(npm:*)`

Tools for MCP servers will be defined like: `mcp__*`

---

## Slash Command Frontmatter (`commands/*.md`)

| Property | Required | Type | Valid Values | Default | Notes |
|----------|----------|------|--------------|---------|-------|
| `description` | No | String | Any text | First line of command | Describes command purpose |
| `argument-hint` | No | String | Any text | None | Shows expected arguments, and/or description. e.g., `[mode] - 'new' or 'edit'` |
| `allowed-tools` | No | Comma-separated string | Valid tool names | Inherits from conversation | Restricts tools available during command |
| `model` | No | String | Valid model identifier | Inherits | Which model executes the command |
| `disable-model-invocation` | No | Boolean | `true`, `false` | `false` | If true, only user can invoke (not Claude) |

### Properties NOT Valid for Commands

These properties are agent-specific and should NOT appear in command frontmatter:
- `name` - Commands derive name from filename, not valid, but acceptable. Leave if exists.
- `color` - Not supported for commands
- `permissionMode` - Not supported for commands
- `skills` - Not supported for commands

---

## YAML Formatting Rules

### Descriptions with Special Characters

**Use single quotes** for descriptions containing `\n` escape sequences or double quotes:

```yaml
# RECOMMENDED - single quotes
description: 'Line 1 with "quoted text".\nLine 2 continues.\nGoodbye.'

# AVOID - unquoted with special chars (may break rendering)
description: Line 1 with "quoted text".\nLine 2 continues.

# AVOID - double quotes (escapes remain visible)
description: "Line 1 with \"quoted text\".\nLine 2."

# AVOID - block scalars (may not parse correctly)
description: |
  Line 1
  Line 2
```

**Test Results (2024-12-06):**
| Format | Result |
|--------|--------|
| Block scalar (`\|` or `>-`) | BROKEN - shows literal pipe/arrow |
| Double quotes | Newlines work, but `\"` escapes visible |
| **Single quotes** | **WORKS** - newlines render, quotes preserved |
| Unquoted | Works for simple cases, risky with special chars |

### Tools/Skills Lists

Use comma-separated strings, NOT YAML arrays:

```yaml
# CORRECT
tools: Read, Grep, Glob, Bash

# INCORRECT - YAML arrays not parsed correctly
tools:
  - Read
  - Grep
  - Glob
```

### Boolean Values

Use lowercase without quotes:

```yaml
# CORRECT
disable-model-invocation: true

# INCORRECT
disable-model-invocation: "true"
disable-model-invocation: True
disable-model-invocation: yes
```

---

## Validation Checklist

### For Agents

- [ ] File starts with `---` and has closing `---`
- [ ] `name` property exists and matches `^[a-z0-9-]{1,64}$`
- [ ] `description` property exists
- [ ] `description` uses single quotes if contains `\n` or special chars
- [ ] `tools` is comma-separated string (not YAML array)
- [ ] `model` (if present) is one of: `sonnet`, `opus`, `haiku`, `inherit`
- [ ] `permissionMode` (if present) is valid value
- [ ] No unknown properties

### For Commands

- [ ] File starts with `---` and has closing `---`
- [ ] If contains `name` property, must be the same as filename
- [ ] Does NOT contain `color` property (not supported)
- [ ] Does NOT contain `permissionMode` property (not supported)
- [ ] Does NOT contain `skills` property (not supported)
- [ ] `description` uses single quotes if contains `\n` or special chars
- [ ] `allowed-tools` is comma-separated string (not YAML array)
- [ ] `disable-model-invocation` (if present) is boolean `true`/`false`

---

## Common Issues

| Issue | Severity | Fix |
|-------|----------|-----|
| Missing `name` in agent | ERROR | Add required property |
| Missing `description` in agent | ERROR | Add required property |
| `name` in command file | WARNING | Validate (name derived from filename) |
| `color` in command file | WARNING | Remove (not supported) |
| Unquoted `\n` in description | WARNING | Wrap in single quotes |
| YAML array for tools | ERROR | Convert to comma-separated string |
| Block scalar (`\|` or `>-`) | WARNING | Convert to single-quoted string |
| Invalid `model` value | WARNING | Use: sonnet, opus, haiku, inherit |
| String boolean (`"true"`) | WARNING | Use unquoted: true/false |
