# Commands Reference

This plugin provides 6 slash commands for common workflows.

---

## /dev-toolkit:swarm

**Purpose:** Execute the full SWARM development workflow for one or more tickets.

**Usage:**
```
/dev-toolkit:swarm TASK-1.2.3                    # Single ticket
/dev-toolkit:swarm TASK-1.2.3 TASK-1.2.4         # Multiple tickets (parallel with worktrees)
/dev-toolkit:swarm STORY-2.1 Focus on API first  # Single ticket with instructions
/dev-toolkit:swarm                                # Auto-select from available tickets
```

**What it does:**

*Single ticket:*
1. Retrieves the ticket content
2. Analyzes requirements
3. Identifies which agents are needed
4. Coordinates development, testing, review, and documentation
5. Prepares the commit

*Multiple tickets:*
1. Analyzes dependencies between all tickets
2. Creates git worktrees for parallel execution of independent tickets
3. Executes dependent tickets sequentially after their dependencies complete
4. Manages merge strategy (combined or individual PRs)
5. Cleans up worktrees after completion

**When to use:**
- Single ticket: When you have a well-defined ticket
- Multiple tickets: When you have independent work that can run in parallel

---

## /dev-toolkit:ba

**Purpose:** Business analysis with deep reasoning. Analyzes features and provides solution recommendations.

**Usage:**
```
/dev-toolkit:ba "Add user authentication with OAuth"
/dev-toolkit:ba "Improve dashboard performance"
```

**What it does:**
- Analyzes requirements deeply
- Considers architectural implications
- Identifies potential challenges
- Recommends implementation approach

**When to use:** When you need to think through a feature before planning or implementing.

---

## /dev-toolkit:plan

**Purpose:** Break down a feature into Epic/Story/Task tickets.

**Usage:**
```
/dev-toolkit:plan "User profile management"
/dev-toolkit:plan "Add real-time notifications"
```

**What it does:**
- Creates Epic with feature overview
- Breaks down into Stories (user-facing features)
- Creates Tasks (30-60 min implementation units)
- Sets up dependencies and priorities

**When to use:** When starting a new feature and need structured work breakdown.

---

## /dev-toolkit:docs

**Purpose:** Generate documentation for a component or module.

**Usage:**
```
/dev-toolkit:docs UserService
/dev-toolkit:docs "authentication flow"
```

**What it does:**
- Analyzes the code
- Generates appropriate documentation
- Includes usage examples
- Covers API surface

**When to use:** After implementing a feature, or when documentation is missing/outdated.

---

## /dev-toolkit:dev-strategy

**Purpose:** Choose the development approach for your current work.

**Usage:**
```
/dev-toolkit:dev-strategy
```

**Options:**
- **Approved:** Careful, thorough. Full testing and review.
- **Rapid:** Fast iteration. Essential tests only.
- **Parallel:** Concurrent execution. For independent work streams.

**When to use:** At the start of a work session to set the pace and quality expectations.

---

## /dev-toolkit:project-status

**Purpose:** Check current project status and get recommendations.

**Usage:**
```
/dev-toolkit:project-status
```

**What it does:**
- Scans ticket directories
- Reports on in-progress work
- Identifies blocked items
- Recommends next tickets to work on

**When to use:** At the start of a session, or when deciding what to work on next.

---

## /dev-toolkit:help

**Purpose:** Get help using the Project Toolkit.

**Usage:**
```
/dev-toolkit:help
/dev-toolkit:help agents
/dev-toolkit:help swarm
```

**What it does:**
- Provides guidance on plugin usage
- Explains available commands and agents
- Points to relevant documentation

**When to use:** When you need help or aren't sure how to do something.

---

## Quick Reference

| Command | Use Case |
|---------|----------|
| `/dev-toolkit:swarm TASK-ID` | Execute a single ticket |
| `/dev-toolkit:swarm TASK-1 TASK-2` | Execute multiple tickets in parallel (worktrees) |
| `/dev-toolkit:ba "feature"` | Analyze a feature deeply |
| `/dev-toolkit:plan "feature"` | Create tickets for a feature |
| `/dev-toolkit:docs Component` | Generate documentation |
| `/dev-toolkit:dev-strategy` | Set development approach |
| `/dev-toolkit:project-status` | See what to work on |
| `/dev-toolkit:help` | Get help |
