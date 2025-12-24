# Getting Started

## Installation

Add the plugin to your `.claude/settings.json`:

```json
{
  "plugins": [
    "<path-to-plugin>/project-toolkit"
  ]
}
```

## Quick Setup

Run the setup wizard to configure the plugin for your project:

```
/setup
```

This will:
1. Detect your tech stack (frontend, backend, testing frameworks)
2. Ask a few questions about your preferences
3. Create configuration file(s) in `.claude/`
4. Optionally help create project documentation

## Configuration Files

Project-toolkit uses two configuration files:

| File | Purpose | Committed? |
|------|---------|------------|
| `.claude/project-toolkit.md` | Shared project config | Yes |
| `.claude/project-toolkit.local.md` | Personal preferences | No |

**Shared config** (`.claude/project-toolkit.md`):
- Tech stack (frontend, backend, database, testing)
- Paths to project documentation
- Ticketing system configuration
- Team conventions

**Personal config** (`.claude/project-toolkit.local.md`):
- Development strategy preference (swarm, rapid, approved)
- Session tracking settings
- Local overrides

Add `.claude/project-toolkit.local.md` to your `.gitignore`.

## Manual Configuration

If you prefer manual setup, copy the template:

```bash
cp <plugin-path>/templates/project-toolkit.local.md .claude/project-toolkit.md
```

Edit with your project details:

```yaml
---
project_name: "My Project"
project_description: "Brief description"

tech_stack:
  frontend: "Vue 3 + PrimeVue"
  backend: "Node.js + Express"
  database: "PostgreSQL"
  testing:
    unit: "Jest"
    e2e: "Playwright"

docs:
  testing: "docs/guides/TESTING.md"
  contributing: "CONTRIBUTING.md"

ticket_system:
  type: "file"
  path: "stories/"
---
```

## Commands

| Command | What it does |
|---------|-------------|
| `/setup` | Configure plugin for your project |
| `/swarm TASK-ID` | Run the full development workflow |
| `/ba "description"` | Analyze a feature with deep reasoning |
| `/plan "feature"` | Break down a feature into tickets |
| `/docs Component` | Generate documentation |
| `/dev-strategy` | Choose development approach |
| `/project-status` | Check status and next steps |
| `/help` | Get help using the plugin |

## Basic Usage

**First time setup:**
```
/setup
```

**Start a task:**
```
/swarm TASK-1.2.3
```

**Run multiple tasks in parallel:**
```
/swarm TASK-1.1 TASK-1.2 TASK-1.3
```

**Plan a new feature:**
```
/plan "Add user authentication"
```

**Check what to work on:**
```
/project-status
```

## Ticket Structure

The plugin works with file-based tickets in this structure:

```
stories/
├── backlog/
│   ├── EPIC-1-feature-name.md
│   ├── STORY-1.1-story-name.md
│   └── TASK-1.1.1-task-name.md
├── in-progress/
└── done/
```

Or configure MCP/API integrations for Jira, Linear, GitHub Issues, etc.

## Next Steps

- Run `/help agents` to learn about available agents
- Run `/help swarm` to understand the SWARM workflow
- See `guides/SWARM-WORKFLOW.md` for detailed workflow documentation
