---
name: help
description: Get help using the Project Toolkit plugin
arguments:
  - name: topic
    description: "Optional topic: agents, commands, swarm, workflow, or leave blank for overview"
    required: false
---

# Project Toolkit Help

You are a helpful assistant that explains how to use the Project Toolkit plugin. Answer questions about the plugin's features, commands, agents, and workflows.

## User's Question

The user ran `/dev-toolkit:help` with topic: `$ARGUMENTS`

## Plugin Overview

Project Toolkit is a multi-agent development workflow plugin that provides:
- **8 Slash Commands** for common workflows
- **14 Specialized Agents** for different development tasks
- **10 Workflow Guides** documenting patterns and best practices
- **Templates** for project configuration and session tracking

## Available Commands

| Command | Purpose |
|---------|---------|
| `/dev-toolkit:setup` | Configure dev-toolkit for your project (run first!) |
| `/dev-toolkit:swarm TASK-ID` | Execute full development workflow for a ticket |
| `/dev-toolkit:swarm TASK-1 TASK-2` | Execute multiple tickets in parallel (git worktrees) |
| `/dev-toolkit:ba "description"` | Business analysis with deep reasoning |
| `/dev-toolkit:plan "feature"` | Break down a feature into tickets |
| `/dev-toolkit:docs Component` | Generate documentation |
| `/dev-toolkit:dev-strategy` | Choose development approach (approved/rapid/parallel) |
| `/dev-toolkit:project-status` | Check status and get next steps |
| `/dev-toolkit:help [topic]` | Get help (this command) |

## Available Agents

**Ticket Management:**
- `dev-toolkit:ticket-manager` - Fetch/manage tickets (MCP, API, file-based)

**Development:**
- `dev-toolkit:frontend-developer` - UI components and layouts
- `dev-toolkit:backend-developer` - APIs and server logic
- `dev-toolkit:wireframe-designer` - UI/UX planning

**Quality:**
- `dev-toolkit:code-reviewer` - Code quality and security review
- `dev-toolkit:test-runner` - Test generation
- `dev-toolkit:playwright-expert` - E2E browser tests
- `dev-toolkit:integrations-tester` - Cross-component testing
- `dev-toolkit:test-auditor` - Test coverage audit

**Coordination:**
- `dev-toolkit:implementation-manager` - Feature planning and tickets
- `dev-toolkit:subagent-orchestrator` - Multi-agent coordination
- `dev-toolkit:documenter` - Documentation generation
- `dev-toolkit:git-expert` - Commits and PRs

## SWARM Workflow

SWARM (Specialized Workflow with Autonomous Resource Management) is the core orchestration pattern:

**Single ticket:**
1. `/dev-toolkit:swarm TASK-1.2.3` retrieves the ticket
2. Analyzes what agents are needed
3. Coordinates development → testing → review → documentation
4. Prepares the commit

**Multiple tickets (parallel with git worktrees):**
1. `/dev-toolkit:swarm TASK-1 TASK-2 TASK-3` analyzes dependencies
2. Creates git worktrees for independent tickets
3. Executes in parallel where possible, sequential where needed
4. Manages merges and cleanup

## Getting Started

1. Add plugin to `.claude/settings.json`
2. Run `/dev-toolkit:setup` to configure the plugin for your project
3. Run `/dev-toolkit:project-status` to see what to work on
4. Use `/dev-toolkit:swarm TASK-ID` to start development

## Configuration Files

Project-toolkit uses two configuration files:

| File | Purpose | Committed? |
|------|---------|------------|
| `.claude/dev-toolkit.md` | Shared project config (tech stack, conventions) | Yes |
| `.claude/dev-toolkit.local.md` | Personal preferences (dev strategy) | No (gitignore) |

Run `/dev-toolkit:setup` to create these automatically, or copy from `templates/`.

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
