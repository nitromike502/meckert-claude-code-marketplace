---
description: Configure project-toolkit for your project - detects tech stack, creates config, and optionally generates project guides
arguments:
  - name: mode
    description: "Optional: 'update' to modify existing config without full re-exploration"
    required: false
---

# Project Toolkit Setup

You are guiding the user through setting up project-toolkit for their project. Create a lean configuration file and optionally help establish project documentation.

## Configuration File Hierarchy

Project-toolkit agents look for configuration in this order:

1. **`.claude/project-toolkit.md`** - Shared project config (committed to repo)
   - Maintained by tech lead / team
   - Contains: tech stack, workflow docs, ticketing config, team conventions
   - Should be version controlled

2. **`.claude/project-toolkit.local.md`** - Personal user config (gitignored)
   - User-specific preferences
   - Contains: development strategy preference, local overrides
   - Should NOT be committed

## Setup Flow

### Step 1: Check Existing Configuration

First, check what already exists:

```
.claude/project-toolkit.md      → Shared config exists?
.claude/project-toolkit.local.md → Personal config exists?
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

Only perform full exploration if no config exists.

**Detect automatically:**

| Check | Files to Look For |
|-------|-------------------|
| Package manager | package.json, requirements.txt, go.mod, Cargo.toml |
| Frontend | React/Vue/Angular/Svelte indicators in dependencies |
| Backend | Express/FastAPI/Django/Gin in dependencies |
| Testing | Jest/Vitest/Playwright/Pytest in devDependencies |
| Database | Prisma schema, docker-compose DB services |
| Existing docs | docs/, CLAUDE.md, README.md |
| Tickets | stories/, tickets/, issue patterns in git log |

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

**Only ask questions for information you couldn't determine:**

Use AskUserQuestion sparingly - skip questions where you found clear answers.

Potential questions (ask only if needed):
- Project description (if no README or CLAUDE.md)
- Ticketing system type (if no stories/ folder found)
- Development workflow preference (always ask for personal config)

### Step 4: Generate Configuration

**For shared config (`.claude/project-toolkit.md`):**

Keep it lean - reference external docs, don't embed content:

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

docs:
  testing: "docs/guides/TESTING.md"
  contributing: "docs/CONTRIBUTING.md"
  architecture: "docs/ARCHITECTURE.md"

ticket_system:
  type: "file"
  path: "stories/"
  pattern: "(EPIC|STORY|TASK|BUG)-[0-9.]+"
---
```

**For personal config (`.claude/project-toolkit.local.md`):**

Even leaner - just preferences:

```yaml
---
preferences:
  default_strategy: "swarm"
  require_tests: true
  require_code_review: true

session_tracking:
  enabled: true
  output_dir: "docs/sessions/"
---
```

### Step 5: Offer to Create Project Documentation

If key documentation doesn't exist, offer to help create it:

**Ask:** "Would you like me to help create any of these project guides?"
- Testing guide (if testing frameworks detected but no guide exists)
- Contributing guide (if none exists)
- Architecture overview (if project structure is complex)

**If yes:**
- Create the documentation file(s) in `docs/`
- Reference them in the config file
- Keep docs focused and practical

### Step 6: Summary

After setup, provide:

1. **What was created** - List files created/modified
2. **Next steps:**
   - Add `.claude/project-toolkit.local.md` to `.gitignore`
   - Commit `.claude/project-toolkit.md` if created
   - Run `/project-toolkit:help` to see available commands
   - Try `/project-toolkit:swarm TICKET-ID` to start a workflow

## Guidelines

- **Be efficient** - Don't ask what you already know from exploration
- **Keep configs lean** - Reference docs, don't embed them
- **Respect existing setup** - Don't overwrite without asking
- **Create .claude/ directory** if it doesn't exist
- **Suggest .gitignore update** for the .local.md file
