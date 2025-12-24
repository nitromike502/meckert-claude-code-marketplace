---
description: Configure project-toolkit for your project - detects tech stack, creates config and templates
arguments:
  - name: mode
    description: "Optional: 'update' to modify existing config without full re-exploration"
    required: false
requires_subagent: false
---

# Project Toolkit Setup

You are guiding the user through setting up project-toolkit for their project. Create lean configuration files and generate useful templates.

**IMPORTANT:** Only explore files within the current project directory. Do not explore or reference any external directories, even if they appear in Claude Code's working directories list.

## Configuration File Hierarchy

Project-toolkit agents look for configuration in this order:

1. **`.claude/project-toolkit.md`** - Shared project config (committed to repo)
   - Maintained by tech lead / team
   - Contains: tech stack, ticketing config, git conventions, template references
   - Should be version controlled

2. **`.claude/project-toolkit.local.md`** - Personal user config (gitignored)
   - User-specific preferences
   - Contains: username for branch naming, session tracking preferences
   - Should NOT be committed

## Setup Flow

### Step 1: Check Existing Configuration

First, check what already exists in the project:

```
.claude/project-toolkit.md       → Shared config exists?
.claude/project-toolkit.local.md → Personal config exists?
.claude/templates/               → Templates exist?
```

**If shared config exists and mode is NOT 'update':**
- Read the existing config
- Ask if user wants to create/update their personal `.local.md` file
- Skip full project exploration

**If mode is 'update':**
- Read existing config(s)
- Ask what the user wants to change
- Make targeted updates only

**If no config exists:**
- Proceed with full setup

### Step 2: Project Discovery (New Setup Only)

Only explore files **within the current project directory**.

**Detect automatically:**

| Check | Files to Look For |
|-------|-------------------|
| Package manager | package.json, requirements.txt, go.mod, Cargo.toml |
| Frontend | React/Vue/Angular/Svelte indicators in dependencies |
| Backend | Express/FastAPI/Django/Gin in dependencies |
| Testing | Jest/Vitest/Playwright/Pytest in devDependencies |
| Database | Prisma schema, docker-compose DB services |
| Existing docs | docs/, CLAUDE.md, README.md |
| Tickets | stories/, tickets/ directories |

**Report findings to user:**
```
I found:
- Frontend: Vue 3 + PrimeVue
- Backend: Node.js + Express
- Testing: Jest (unit), Playwright (E2E)
- Database: SQLite via better-sqlite3
- Docs: docs/ directory exists
```

### Step 3: Gather Missing Information

**Only ask questions for information you couldn't determine.**

Questions to ask (only if needed):
- Project description (if no README or CLAUDE.md)
- Ticketing system type (if no stories/ folder found)
- Ticket ID pattern (if using tickets)

**Always ask for personal config:**
- Username/identifier for branch naming (e.g., "meckert")
- Session tracking: Where to store session docs? Commit them to repo?

### Step 4: Generate Configuration Files

**Shared config (`.claude/project-toolkit.md`):**

```yaml
---
project_name: "Project Name"
project_description: "One line description"

tech_stack:
  frontend: "Vue 3 + PrimeVue"
  backend: "Node.js + Express"
  database: "SQLite"
  testing:
    unit: "Jest"
    e2e: "Playwright"

ticket_system:
  type: "file"                              # file, mcp, or api
  path: "stories/"                          # for file-based
  pattern: "(EPIC|STORY|TASK|BUG)-[0-9.]+"  # ticket ID regex

git:
  branch_pattern: "{username}/{ticket_id}/{type}/{description}"
  # Example: meckert/TASK-123/feature/add-login
  commit_template: ".claude/templates/commit-message.md"
  pr_template: ".claude/templates/pr-description.md"

docs:
  testing: "docs/guides/TESTING.md"
  contributing: "CONTRIBUTING.md"
---
```

**Personal config (`.claude/project-toolkit.local.md`):**

```yaml
---
username: "meckert"  # Used in branch naming pattern

session_tracking:
  enabled: true
  output_dir: "docs/sessions/"
  commit_sessions: false  # true to commit session docs to repo
---
```

### Step 5: Generate Templates

Create `.claude/templates/` directory with:

**`.claude/templates/commit-message.md`:**
```
{ticket_id}: {type}: {description}

{body}

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**`.claude/templates/pr-description.md`:**
```
## {ticket_id}: {title}

## Summary
{summary}

## Changes
{changes}

## Test Plan
{test_plan}

## Ticket
{ticket_link}

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

### Step 6: Offer Additional Documentation

If key documentation doesn't exist, offer to help create it:

- Testing guide (if testing frameworks detected but no guide exists)
- Contributing guide (if none exists)

### Step 7: Summary

After setup, provide:

1. **What was created** - List files created/modified
2. **Next steps:**
   - Add `.claude/project-toolkit.local.md` to `.gitignore`
   - Review and customize templates in `.claude/templates/`
   - Commit `.claude/project-toolkit.md` and `.claude/templates/`
   - Run `/project-toolkit:help` to see available commands

## Guidelines

- **Stay in project scope** - Only explore files within the current project
- **Be efficient** - Don't ask what you already know from exploration
- **Keep configs lean** - Reference templates/docs, don't embed content
- **Respect existing setup** - Don't overwrite without asking
- **Create directories** - Create `.claude/` and `.claude/templates/` if needed
- **Suggest .gitignore** - Add `.claude/project-toolkit.local.md`
