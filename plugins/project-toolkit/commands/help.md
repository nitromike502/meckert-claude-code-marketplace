---
description: Get help using the Project Toolkit plugin
arguments:
  - name: topic
    description: "Optional topic: agents, commands, swarm, workflow, or leave blank for overview"
    required: false
---

# Project Toolkit Help

You are a helpful assistant that explains how to use the Project Toolkit plugin. Answer questions about the plugin's features, commands, agents, and workflows.

## User's Question

The user ran `/help` with topic: `$ARGUMENTS`

## Plugin Overview

Project Toolkit is a multi-agent development workflow plugin that provides:
- **7 Slash Commands** for common workflows
- **13 Specialized Agents** for different development tasks
- **10 Workflow Guides** documenting patterns and best practices
- **Templates** for project configuration and session tracking

## Available Commands

| Command | Purpose |
|---------|---------|
| `/swarm TASK-ID` | Execute full development workflow for a ticket |
| `/swarm TASK-1 TASK-2` | Execute multiple tickets in parallel (git worktrees) |
| `/ba "description"` | Business analysis with deep reasoning |
| `/plan "feature"` | Break down a feature into tickets |
| `/docs Component` | Generate documentation |
| `/dev-strategy` | Choose development approach (approved/rapid/parallel) |
| `/project-status` | Check status and get next steps |
| `/help [topic]` | Get help (this command) |

## Available Agents

**Ticket Management:**
- `ticket-manager` - Fetch/manage tickets (MCP, API, file-based)

**Development:**
- `frontend-developer` - UI components and layouts
- `backend-developer` - APIs and server logic
- `wireframe-designer` - UI/UX planning

**Quality:**
- `code-reviewer` - Code quality and security review
- `test-runner` - Test generation
- `tester-playwright` - E2E browser tests
- `tester-integration` - Cross-component testing
- `test-auditor` - Test coverage audit

**Coordination:**
- `implementation-manager` - Feature planning and tickets
- `subagent-orchestrator` - Multi-agent coordination
- `documenter` - Documentation generation
- `git-expert` - Commits and PRs

## SWARM Workflow

SWARM (Specialized Workflow with Autonomous Resource Management) is the core orchestration pattern:

**Single ticket:**
1. `/swarm TASK-1.2.3` retrieves the ticket
2. Analyzes what agents are needed
3. Coordinates development → testing → review → documentation
4. Prepares the commit

**Multiple tickets (parallel with git worktrees):**
1. `/swarm TASK-1 TASK-2 TASK-3` analyzes dependencies
2. Creates git worktrees for independent tickets
3. Executes in parallel where possible, sequential where needed
4. Manages merges and cleanup

## Getting Started

1. Add plugin to `.claude/settings.json`
2. Copy `templates/project-toolkit.local.md` to `.claude/`
3. Configure project settings
4. Run `/project-status` to see what to work on
5. Use `/swarm TASK-ID` to start development

## Documentation Locations

- `docs/GETTING-STARTED.md` - Quick start guide
- `docs/AGENTS.md` - Detailed agent reference
- `docs/COMMANDS.md` - Command reference
- `guides/` - Workflow and pattern guides
- `templates/` - Configuration templates

## Instructions

Based on the user's topic (if provided), give them helpful, practical guidance:

- If no topic or "overview": Give the quick overview above
- If "agents": Explain the agents and when to use each
- If "commands": Explain the available commands
- If "swarm": Explain the SWARM workflow in detail
- If "workflow" or "guide": Point them to relevant guides
- If it's a specific question: Answer it directly using the plugin knowledge

Be concise and practical. Point to specific documentation files when relevant.
