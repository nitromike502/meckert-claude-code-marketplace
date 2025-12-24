---
# Project Toolkit - Shared Configuration
# Copy to .claude/project-toolkit.md (committed to repo)
# This file is shared by all team members

project_name: "My Project"
project_description: "Brief description of your project"

# Technology stack
tech_stack:
  frontend: ""          # e.g., "Vue 3 + PrimeVue", "React + Next.js"
  backend: ""           # e.g., "Node.js + Express", "Python + FastAPI"
  database: ""          # e.g., "PostgreSQL", "SQLite"
  testing:
    unit: ""            # e.g., "Jest", "Pytest"
    e2e: ""             # e.g., "Playwright", "Cypress"

# Ticket system configuration
ticket_system:
  type: "file"                              # file, mcp, or api
  path: "stories/"                          # for file-based tickets
  pattern: "(EPIC|STORY|TASK|BUG)-[0-9.]+"  # ticket ID regex

# Git conventions
git:
  branch_pattern: "{username}/{ticket_id}/{type}/{description}"
  # Pattern variables: {username}, {ticket_id}, {type}, {description}
  # Example result: meckert/TASK-123/feature/add-login

  commit_template: ".claude/templates/commit-message.md"
  pr_template: ".claude/templates/pr-description.md"

# Project documentation paths (optional - only include if they exist)
docs:
  testing: ""           # e.g., "docs/guides/TESTING.md"
  contributing: ""      # e.g., "CONTRIBUTING.md"
  architecture: ""      # e.g., "docs/ARCHITECTURE.md"
---

# Project Context

Add any project-specific context here that all team members should know.

## Architecture Overview

Brief description of project architecture...

## Team Conventions

Document team-specific conventions...
