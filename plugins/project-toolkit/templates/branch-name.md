# Branch Naming Template
# Reference for git-expert agent

# Variables available:
# {username}    - Developer username (from .claude/project-toolkit.local.md)
# {ticket_id}   - The ticket ID (e.g., TASK-123)
# {type}        - Branch type: feature, fix, refactor, docs
# {description} - Kebab-case description (optional)

# Default pattern:
{username}/{ticket_id}/{type}/{description}

# Examples:
# jsmith/TASK-123/feature/add-login
# jsmith/BUG-456/fix/null-pointer
# jsmith/STORY-7.2/feature/user-dashboard

# Alternative patterns (configure in project-toolkit.md):
# {ticket_id}/{type}/{description}     -> TASK-123/feature/add-login
# {username}/{ticket_id}               -> jsmith/TASK-123
# feature/{ticket_id}-{description}    -> feature/TASK-123-add-login
