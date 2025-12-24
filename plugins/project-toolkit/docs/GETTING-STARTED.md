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

## Configuration

Copy the settings template to your project's `.claude/` directory:

```bash
cp <path-to-plugin>/project-toolkit/templates/project-toolkit.local.md .claude/project-toolkit.local.md
```

Replace `<path-to-plugin>` with the actual installation path (e.g., `~/.claude/plugins` or your marketplace location).

Edit with your project details:

```yaml
---
project_name: "My Project"
project_root: "/path/to/project"
dev_server_port: 3000
test_command: "npm test"
frontend_framework: "Vue"
backend_framework: "Express"
---

Additional project context goes here in markdown format.
```

## Commands

| Command | What it does |
|---------|-------------|
| `/swarm TASK-ID` | Run the full development workflow for a ticket |
| `/ba "description"` | Analyze a feature with deep reasoning |
| `/plan "feature"` | Break down a feature into tickets |
| `/docs Component` | Generate documentation |
| `/dev-strategy` | Choose development approach |
| `/project-status` | Check status and get next steps |
| `/help` | Get help using the plugin |

## Basic Usage

**Start a task:**
```
/swarm TASK-1.2.3
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

The plugin expects tickets in this structure:
```
stories/
├── backlog/
│   ├── EPIC-1-feature-name.md
│   ├── STORY-1.1-story-name.md
│   └── TASK-1.1.1-task-name.md
├── in-progress/
└── done/
```

See `guides/SWARM-WORKFLOW.md` for the full workflow documentation.
