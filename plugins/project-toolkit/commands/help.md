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

The user ran `/project-toolkit:help` with topic: `$ARGUMENTS`

## Plugin Overview

Project Toolkit is a multi-agent development workflow plugin that provides:
- **8 Slash Commands** for common workflows
- **14 Specialized Agents** for different development tasks
- **10 Workflow Guides** documenting patterns and best practices
- **Templates** for project configuration and session tracking

## Available Commands

| Command | Purpose |
|---------|---------|
| `/project-toolkit:setup` | Configure project-toolkit for your project (run first!) |
| `/project-toolkit:swarm TASK-ID` | Execute full development workflow for a ticket |
| `/project-toolkit:swarm TASK-1 TASK-2` | Execute multiple tickets in parallel (git worktrees) |
| `/project-toolkit:ba "description"` | Business analysis with deep reasoning |
| `/project-toolkit:plan "feature"` | Break down a feature into tickets |
| `/project-toolkit:docs Component` | Generate documentation |
| `/project-toolkit:dev-strategy` | Choose development approach (approved/rapid/parallel) |
| `/project-toolkit:project-status` | Check status and get next steps |
| `/project-toolkit:help [topic]` | Get help (this command) |

## Available Agents

**Ticket Management:**
- `project-toolkit:ticket-manager` - Fetch/manage tickets (MCP, API, file-based)

**Development:**
- `project-toolkit:frontend-developer` - UI components and layouts
- `project-toolkit:backend-developer` - APIs and server logic
- `project-toolkit:wireframe-designer` - UI/UX planning

**Quality:**
- `project-toolkit:code-reviewer` - Code quality and security review
- `project-toolkit:test-runner` - Test generation
- `project-toolkit:playwright-expert` - E2E browser tests
- `project-toolkit:integrations-tester` - Cross-component testing
- `project-toolkit:test-auditor` - Test coverage audit

**Coordination:**
- `project-toolkit:implementation-manager` - Feature planning and tickets
- `project-toolkit:subagent-orchestrator` - Multi-agent coordination
- `project-toolkit:documenter` - Documentation generation
- `project-toolkit:git-expert` - Commits and PRs

## SWARM Workflow

SWARM (Specialized Workflow with Autonomous Resource Management) is the core orchestration pattern:

**Single ticket:**
1. `/project-toolkit:swarm TASK-1.2.3` retrieves the ticket
2. Analyzes what agents are needed
3. Coordinates development → testing → review → documentation
4. Prepares the commit

**Multiple tickets (parallel with git worktrees):**
1. `/project-toolkit:swarm TASK-1 TASK-2 TASK-3` analyzes dependencies
2. Creates git worktrees for independent tickets
3. Executes in parallel where possible, sequential where needed
4. Manages merges and cleanup

## Getting Started

1. Add plugin to `.claude/settings.json`
2. Run `/project-toolkit:setup` to configure the plugin for your project
3. Run `/project-toolkit:project-status` to see what to work on
4. Use `/project-toolkit:swarm TASK-ID` to start development

## Configuration Files

Project-toolkit uses two configuration files:

| File | Purpose | Committed? |
|------|---------|------------|
| `.claude/project-toolkit.md` | Shared project config (tech stack, conventions) | Yes |
| `.claude/project-toolkit.local.md` | Personal preferences (dev strategy) | No (gitignore) |

Run `/project-toolkit:setup` to create these automatically, or copy from `templates/`.

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
