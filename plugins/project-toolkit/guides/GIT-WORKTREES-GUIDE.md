# Git Worktrees Guide

Git worktrees enable parallel development by allowing multiple working directories from the same repository, each on a different branch. This is essential for SWARM multi-ticket workflows.

## Overview

### What Are Git Worktrees?

A git worktree is an additional working directory linked to your repository. Each worktree:
- Has its own working directory and index
- Is checked out to a specific branch
- Shares the same `.git` repository data
- Allows simultaneous work on multiple branches

### Why Use Worktrees for SWARM?

Traditional single-branch workflow:
```
Work on TASK-1 → commit → switch branch → work on TASK-2 → commit → switch...
```

With worktrees:
```
Worktree-1: Work on TASK-1 ─┬─ Parallel execution
Worktree-2: Work on TASK-2 ─┘
```

**Benefits:**
- True parallel development on independent tickets
- No context switching between branches
- Each ticket gets isolated environment
- Clean merges without stash/unstash dance

---

## Worktree Directory Structure

When SWARM creates worktrees, they're placed in a sibling directory:

```
project/                      # Main working directory (main branch)
project-worktrees/            # Worktree container directory
├── TASK-3.1.1/              # Worktree for ticket TASK-3.1.1
│   └── (full project files on feature/TASK-3.1.1 branch)
├── TASK-3.1.2/              # Worktree for ticket TASK-3.1.2
│   └── (full project files on feature/TASK-3.1.2 branch)
└── STORY-4.2/               # Worktree for ticket STORY-4.2
    └── (full project files on feature/STORY-4.2 branch)
```

---

## Commands Reference

### Create a Worktree

```bash
# Create worktree with new branch
git worktree add ../project-worktrees/TASK-3.1.1 -b feature/TASK-3.1.1

# Create worktree from existing branch
git worktree add ../project-worktrees/TASK-3.1.1 feature/TASK-3.1.1
```

### List Worktrees

```bash
git worktree list
# Output:
# /home/user/project                          abc1234 [main]
# /home/user/project-worktrees/TASK-3.1.1     def5678 [feature/TASK-3.1.1]
# /home/user/project-worktrees/TASK-3.1.2     ghi9012 [feature/TASK-3.1.2]
```

### Remove a Worktree

```bash
# Remove worktree (keeps branch)
git worktree remove ../project-worktrees/TASK-3.1.1

# Force remove if there are changes
git worktree remove --force ../project-worktrees/TASK-3.1.1
```

### Prune Stale Worktrees

```bash
# Clean up worktree references for deleted directories
git worktree prune
```

---

## SWARM Multi-Ticket Workflow

### Phase 0: Dependency Analysis

Before creating worktrees, evaluate ticket dependencies:

```
Tickets: TASK-3.1.1, TASK-3.1.2, TASK-3.1.3

Dependency Check:
├── TASK-3.1.1: Creates user-service.js
├── TASK-3.1.2: Creates auth-middleware.js
├── TASK-3.1.3: Modifies user-service.js (DEPENDS ON 3.1.1!)

Result:
├── Parallel Group 1: TASK-3.1.1, TASK-3.1.2 (independent)
└── Sequential: TASK-3.1.3 (after 3.1.1 completes)
```

**Dependency Types:**
1. **File dependency**: Ticket B modifies files created by Ticket A
2. **Logical dependency**: Ticket B requires functionality from Ticket A
3. **Schema dependency**: Ticket B needs database changes from Ticket A

### Phase 1: Setup Worktrees

For independent tickets, create parallel worktrees:

```bash
# From main project directory
cd /path/to/project

# Create worktree directory
mkdir -p ../project-worktrees

# Create worktrees for independent tickets
git worktree add ../project-worktrees/TASK-3.1.1 -b feature/TASK-3.1.1
git worktree add ../project-worktrees/TASK-3.1.2 -b feature/TASK-3.1.2
```

### Phase 2: Parallel Implementation

Each ticket executes in its own worktree:

```
Agent-1 (in worktree TASK-3.1.1):
├── cd ../project-worktrees/TASK-3.1.1
├── Implement feature
├── Run tests
├── Commit changes
└── Push branch

Agent-2 (in worktree TASK-3.1.2):  [PARALLEL]
├── cd ../project-worktrees/TASK-3.1.2
├── Implement feature
├── Run tests
├── Commit changes
└── Push branch
```

### Phase 3: Merge Strategy

**Option A: Sequential Merge (Safest)**
```bash
# In main project directory
git checkout main
git pull origin main

# Merge first ticket
git merge --no-ff feature/TASK-3.1.1
git push origin main

# Merge second ticket (may need rebase)
git merge --no-ff feature/TASK-3.1.2
git push origin main
```

**Option B: Create PR for Each**
```bash
# Create PR for each branch
gh pr create --base main --head feature/TASK-3.1.1 --title "TASK-3.1.1: ..."
gh pr create --base main --head feature/TASK-3.1.2 --title "TASK-3.1.2: ..."

# Review and merge PRs sequentially
```

### Phase 4: Cleanup

After successful merges:

```bash
# Remove worktrees
git worktree remove ../project-worktrees/TASK-3.1.1
git worktree remove ../project-worktrees/TASK-3.1.2

# Delete merged branches
git branch -d feature/TASK-3.1.1
git branch -d feature/TASK-3.1.2

# Push branch deletions to remote
git push origin --delete feature/TASK-3.1.1
git push origin --delete feature/TASK-3.1.2

# Prune any stale worktree references
git worktree prune
```

---

## Dependency Evaluation Algorithm

When multiple tickets are provided to `/project-toolkit:swarm`, the system evaluates dependencies:

```
Input: [TASK-A, TASK-B, TASK-C]

For each ticket pair (A, B):
  1. Parse ticket files to identify:
     - Files to be created
     - Files to be modified
     - Services/modules to be used

  2. Check for conflicts:
     - Same file modified by both? → Sequential
     - B uses module A creates? → B depends on A
     - Shared database table? → Evaluate further

  3. Build dependency graph:
     A ─→ C (C modifies A's files)
     B    (independent)

  4. Generate execution plan:
     Parallel: [A, B]
     Sequential after A: [C]
```

### Dependency Detection Heuristics

| Signal | Indicates |
|--------|-----------|
| Same file in both tickets | Conflict - must be sequential |
| Ticket B mentions "after TASK-A" | Explicit dependency |
| Ticket B modifies file Ticket A creates | File dependency |
| Import/require statements | Module dependency |
| Database migration order | Schema dependency |

---

## Best Practices

### Do

- **Verify independence** before creating parallel worktrees
- **Keep worktrees short-lived** - create, work, merge, delete
- **Use descriptive branch names** matching ticket IDs
- **Run tests in each worktree** before merging
- **Merge to main frequently** to reduce drift

### Don't

- **Don't checkout same branch in multiple worktrees** - git prevents this
- **Don't leave stale worktrees** - clean up after merging
- **Don't parallelize dependent tickets** - leads to merge conflicts
- **Don't share node_modules** between worktrees - each needs its own

### Handling node_modules

Each worktree needs its own dependencies:

```bash
cd ../project-worktrees/TASK-3.1.1
npm install  # Creates local node_modules

cd ../project-worktrees/TASK-3.1.2
npm install  # Creates separate local node_modules
```

Consider using symlinks or npm workspaces for large projects to save disk space.

---

## Troubleshooting

### "fatal: 'branch' is already checked out"

Git prevents checking out the same branch in multiple worktrees.

**Solution:** Create a new branch for the worktree:
```bash
git worktree add ../project-worktrees/TASK-X -b feature/TASK-X
```

### Worktree Directory Already Exists

```bash
# Remove the directory first
rm -rf ../project-worktrees/TASK-X

# Or prune stale references
git worktree prune
git worktree add ../project-worktrees/TASK-X -b feature/TASK-X
```

### Merge Conflicts After Parallel Work

If both branches modified shared areas:

```bash
# In main project
git checkout main
git merge feature/TASK-3.1.1  # First merge succeeds

git merge feature/TASK-3.1.2  # May conflict
# Resolve conflicts manually
git add .
git commit -m "Merge feature/TASK-3.1.2 with conflict resolution"
```

---

## Integration with SWARM Agents

### git-expert Responsibilities

- Create and manage worktrees
- Coordinate branch creation
- Handle merges and conflict resolution
- Clean up worktrees after completion

### subagent-orchestrator Responsibilities

- Analyze ticket dependencies
- Recommend parallel vs sequential execution
- Assign tickets to worktrees
- Track worktree status

### Developer Agent Responsibilities

- Work within assigned worktree directory
- Use absolute paths relative to worktree root
- Run tests within worktree context
- Report completion to orchestrator
