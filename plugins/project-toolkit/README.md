# Project Toolkit

A comprehensive Claude Code plugin providing multi-agent development workflow with SWARM (Specialized Workflow with Autonomous Resource Management) methodology for coordinated software development.

## Overview

Project Toolkit provides a complete development team of specialized AI agents, workflow commands, and methodology guides to help you build software systematically and efficiently. It's designed to work with any project stack while providing best practices for:

- Multi-agent coordination and task management
- Git workflow and code review
- Testing strategies and quality gates
- Documentation standards
- Project planning and ticket management

## Features

### Agents (13)

| Agent | Description |
|-------|-------------|
| **ticket-manager** | Fetches and manages tickets from any system (MCP, API, file-based) |
| **code-reviewer** | Reviews pull requests for code quality, security, and best practices |
| **git-expert** | Manages git workflow: branches, commits, PRs, merges |
| **tester-integration** | Tests API endpoints, UI functionality, cross-platform compatibility |
| **implementation-manager** | High-level decisions, timeline management, ticket creation |
| **subagent-orchestrator** | Coordinates multi-agent workflows, manages dependencies |
| **wireframe-designer** | Creates wireframes and UI/UX design specifications |
| **documenter** | Updates project documentation (README, guides, API docs) |
| **backend-developer** | Backend API design and server implementation |
| **frontend-developer** | Frontend UI development and component creation |
| **test-auditor** | Audits and optimizes test suites |
| **tester-playwright** | Creates and debugs Playwright E2E tests |
| **test-runner** | Executes automated tests as quality gate |

### Commands (6)

| Command | Description |
|---------|-------------|
| `/dev-strategy` | Select development strategy (approved, rapid, parallel) |
| `/docs` | Review and update project documentation |
| `/plan` | Project planning and ticket creation |
| `/project-status` | Check project status and recommend next tickets |
| `/ba` | Business Analyst - feature solutioning with deep reasoning |
| `/swarm` | Execute coordinated multi-agent SWARM workflow (supports multiple tickets with git worktrees) |
| `/help` | Get help using the plugin |

### Guides (10)

- **SWARM-WORKFLOW.md** - Complete SWARM methodology specification
- **GIT-WORKFLOW.md** - Feature branch workflow and commit conventions
- **GIT-WORKTREES-GUIDE.md** - Git worktrees for parallel multi-ticket development
- **PARALLEL-EXECUTION-GUIDE.md** - When and how to parallelize agent work
- **DEVELOPMENT-STRATEGIES.md** - SWARM vs Approved vs Rapid strategies
- **TESTING-GUIDE.md** - Automated testing workflow and quality gates
- **CODING-STANDARDS.md** - Code quality and best practices
- **CODE-REVIEW-BEST-PRACTICES.md** - Code review checklists and patterns
- **TEST-PATTERNS-REFERENCE.md** - Testing patterns and anti-patterns
- **DOCUMENTATION-CHECKLISTS.md** - Documentation completion checklists

### Templates (5)

- **session-tracking-template.md** - Track development session progress
- **development-strategies.md** - Detailed strategy patterns reference
- **test-template.md** - Test file creation template
- **test-creation-checklist.md** - Checklist for creating tests
- **spec-review-checklist.md** - Specification review checklist

## Installation

### Option 1: Using Claude Code Plugin Manager

```bash
# Add to your plugins
claude --add-plugin /path/to/project-toolkit
```

### Option 2: Manual Installation

1. Clone or copy this plugin to your plugins directory
2. Enable in Claude Code settings

## Configuration

### Project-Specific Settings

Create `.claude/project-toolkit.local.md` in your project root to customize behavior:

```yaml
---
project_name: "My Project"
tech_stack:
  backend: "Node.js + Express"
  frontend: "React + Next.js"
  testing:
    unit: "Jest"
    e2e: "Playwright"
workflow_docs:
  swarm: "docs/guides/SWARM-WORKFLOW.md"
  git: "docs/guides/GIT-WORKFLOW.md"
---

# Project Context
Add any project-specific context here...
```

See `templates/project-toolkit.local.md` for a complete template.

## Usage

### Quick Start

1. **Start a new session:**
   ```
   /project-status
   ```
   This shows your current project state and recommends next tickets.

2. **Select a development strategy:**
   ```
   /dev-strategy approved   # For complex features
   /dev-strategy rapid      # For simple changes
   /dev-strategy parallel   # For multiple independent tasks
   ```

3. **Execute SWARM workflow:**
   ```
   /swarm TICKET-123              # Single ticket
   /swarm TASK-1 TASK-2 TASK-3    # Multiple tickets (parallel with worktrees)
   ```
   This coordinates the full development workflow through all phases.
   Multiple tickets are analyzed for dependencies and executed in parallel where possible using git worktrees.

### SWARM Workflow Phases

1. **Session Initialization & Planning** - Orchestrator creates plan
2. **Git & Session Setup** - Create feature branch, session tracking
3. **Implementation** - Execute tasks (sequential or parallel)
4. **Commit Code Changes** - Commit after each task completion
5. **Documentation Updates** - Update docs as needed
6. **PR Creation & Code Review** - Create PR, review code
7. **User Approval & Merge** - Final approval and merge

### Documentation Discovery

Agents automatically look for project-specific documentation first, then fall back to plugin guides. This allows you to:

1. Use plugin guides as baseline templates
2. Create project-specific overrides in your `docs/guides/` folder
3. Customize workflows while maintaining consistency

## Development Strategies

### Development Approved
Best for complex features requiring discussion before implementation.
```
/dev-strategy approved
```

### Rapid Iteration
Best for simple, obvious changes.
```
/dev-strategy rapid
```

### Parallel Execution
Best for multiple independent tasks.
```
/dev-strategy parallel
```

## Best Practices

### Task Sizing
- All tasks should be 30-60 minutes maximum
- Each task should be independently testable
- Each task should be independently committable

### Testing
- Test immediately after each task
- Use targeted testing during development
- Run full test suite before PR creation

### Git Workflow
- One commit per task (sequential execution)
- Batch commit for parallel execution
- Always use feature branches

### Documentation
- Keep documentation current
- Project docs override plugin defaults
- Commit documentation separately from code

## File Structure

```
project-toolkit/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── agents/                       # 12 specialized agents
├── commands/                     # 6 slash commands
├── guides/                       # 9 workflow guides
├── templates/                    # 5 templates
└── README.md                     # This file
```

## Contributing

Contributions are welcome! Please ensure:
- Agents follow plugin best practices
- Commands are well-documented
- Guides are generalized (no project-specific references)

## License

MIT
