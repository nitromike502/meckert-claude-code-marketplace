---
# Project Toolkit Configuration
# Copy this file to .claude/project-toolkit.local.md in your project root
# and customize the values below.

# Project identification
project_name: "My Project"
project_description: "Brief description of your project"

# Technology stack (helps agents provide relevant advice)
tech_stack:
  backend: ""           # e.g., "Node.js + Express", "Python + FastAPI", "Go"
  frontend: ""          # e.g., "Vue 3 + PrimeVue", "React + Next.js", "Angular"
  database: ""          # e.g., "PostgreSQL", "MongoDB", "SQLite"
  testing:
    unit: ""            # e.g., "Jest", "Pytest", "Go test"
    e2e: ""             # e.g., "Playwright", "Cypress", "Selenium"

# Workflow documentation locations (relative to project root)
# If these files exist, they override plugin defaults
workflow_docs:
  swarm: "docs/guides/SWARM-WORKFLOW.md"
  git: "docs/guides/GIT-WORKFLOW.md"
  testing: "docs/guides/TESTING-GUIDE.md"
  coding_standards: "docs/guides/CODING-STANDARDS.md"
  parallel_execution: "docs/guides/PARALLEL-EXECUTION-GUIDE.md"

# Team structure document (if exists)
team_structure: "docs/TEAM.md"

# Ticket system configuration (if using agile workflow)
ticket_system:
  enabled: false
  root_path: ""         # e.g., "/home/tickets/myproject/"

# Session tracking (for SWARM workflow)
session_tracking:
  enabled: true
  output_dir: "docs/sessions/tracking/"

# Development preferences
preferences:
  default_strategy: "swarm"     # "swarm", "rapid", or "approved"
  require_tests: true           # Require tests before PR
  require_code_review: true     # Require code review before merge
---

# Project Context

Add any project-specific context here that agents should know about.

## Architecture Overview

Describe your project's architecture...

## Key Patterns

Document important patterns used in this codebase...

## Team Conventions

Document any team-specific conventions...
