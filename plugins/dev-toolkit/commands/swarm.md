---
name: swarm
description: Execute SWARM (Specialized Workflow with Autonomous Resource Management) development workflow for coordinated multi-agent implementation
tools: Task
argument-hint: "[ticket(s)] [instructions] - One or more ticket IDs (space/comma separated) and/or custom instructions"
color: purple
---

# SWARM Workflow Command
# Coordinated Multi-Agent Development with Main Agent Control

<task>
Execute the complete SWARM workflow where the main agent coordinates all subagent invocations, manages session tracking, and implements the orchestrator's execution plan. Supports single-ticket and multi-ticket workflows with git worktrees for parallel execution.
</task>

<context>
**Development Method**: SWARM (Specialized Workflow with Autonomous Resource Management)

**Documentation Discovery:**
Before starting SWARM workflow, reference these guides:

1. **Check project docs first:**
   - `docs/guides/SWARM-WORKFLOW.md`
   - `docs/guides/PARALLEL-EXECUTION-GUIDE.md`
   - `docs/guides/GIT-WORKFLOW.md`
   - `docs/guides/GIT-WORKTREES-GUIDE.md`
   - `docs/guides/TESTING-GUIDE.md`

2. **Fall back to plugin guides:**
   - `${CLAUDE_PLUGIN_ROOT}/guides/SWARM-WORKFLOW.md`
   - `${CLAUDE_PLUGIN_ROOT}/guides/PARALLEL-EXECUTION-GUIDE.md`
   - `${CLAUDE_PLUGIN_ROOT}/guides/GIT-WORKFLOW.md`
   - `${CLAUDE_PLUGIN_ROOT}/guides/GIT-WORKTREES-GUIDE.md`
   - `${CLAUDE_PLUGIN_ROOT}/guides/TESTING-GUIDE.md`

**CRITICAL ARCHITECTURE PRINCIPLE**:
Only the main agent invokes subagents. The orchestrator creates plans but does NOT invoke other subagents.
</context>

<execution>
**User Arguments:** `$ARGUMENTS`

## SWARM Workflow Overview

This command implements the complete SWARM workflow across 9 phases:
1. **Session Initialization & Planning** - Orchestrator creates plan, main agent manages
2. **Git & Session Setup** - Branch/worktree creation, session tracking doc creation
3. **Implementation** - Sequential or parallel execution based on orchestrator recommendations
4. **Commit Code Changes** - git-expert handles all git operations
5. **Initial Documentation** - documenter updates docs if needed (committed separately)
6. **PR Creation** - git-expert creates PR, returns URL
7. **Code Review (On PR)** - code-reviewer leaves inline/file comments directly on PR
8. **Documentation Updates (Post-Review)** - Update docs if changes were made due to review
9. **User Approval & Merge** - User reviews PR comments, approves, main agent merges

---

## Phase 0: Argument Parsing & Mode Detection

**Arguments provided:** `$ARGUMENTS`

### Parse Ticket IDs and Instructions

**Ticket ID Pattern:** `EPIC-*`, `STORY-*`, `TASK-*`, `BUG-*` (case-insensitive)

1. **If `$ARGUMENTS` is empty:**
   - tickets = []
   - instructions = None
   - Proceed with auto-select behavior (show ticket options)

2. **If `$ARGUMENTS` contains ticket ID(s):**
   - Extract ALL tokens matching ticket ID pattern
   - Tickets may be space-separated or comma-separated
   - tickets = [all matching ticket IDs]
   - instructions = remaining non-ticket text

3. **Determine execution mode:**
   - **Single-ticket mode:** `len(tickets) == 1`
   - **Multi-ticket mode:** `len(tickets) > 1` → Requires dependency analysis and git worktrees

### Examples:
```
/swarm TASK-3.1.1                           → Single-ticket mode
/swarm TASK-3.1.1 TASK-3.1.2                → Multi-ticket mode (2 tickets)
/swarm TASK-3.1.1, TASK-3.1.2, TASK-3.1.3   → Multi-ticket mode (3 tickets)
/swarm STORY-4.2 Focus on API first         → Single-ticket with instructions
/swarm                                       → Auto-select mode
```

---

## Multi-Ticket Workflow (Git Worktrees)

**When multiple tickets are provided, use git worktrees for true parallel execution.**

### Phase M1: Dependency Analysis

**Main agent invokes `dev-toolkit:subagent-orchestrator`** with ALL tickets for dependency analysis:

```
Analyze dependencies between tickets:
- TASK-3.1.1
- TASK-3.1.2
- TASK-3.1.3

Determine:
1. Which tickets can execute in parallel (no shared files/dependencies)
2. Which tickets must be sequential (dependencies exist)
3. Recommended execution order
```

**Orchestrator evaluates:**
- **File conflicts:** Do tickets modify the same files?
- **Logical dependencies:** Does Ticket B require Ticket A's functionality?
- **Explicit dependencies:** Does ticket metadata indicate "depends on" relationships?
- **Schema dependencies:** Database migrations that must run in order

**Orchestrator returns dependency graph:**
```
Independent (can parallelize):
  - TASK-3.1.1 (creates user-service.js)
  - TASK-3.1.2 (creates auth-middleware.js)

Sequential (has dependencies):
  - TASK-3.1.3 depends on TASK-3.1.1 (modifies user-service.js)

Execution Plan:
  Parallel Group 1: [TASK-3.1.1, TASK-3.1.2]
  Sequential after 3.1.1: [TASK-3.1.3]
```

### Phase M2: Present Multi-Ticket Plan

**Main agent presents to user:**
- Dependency analysis results
- Proposed parallelization strategy
- Worktree setup plan
- Estimated execution time
- Risk assessment (merge conflicts, etc.)

**User approves or modifies plan.**

### Phase M3: Git Worktree Setup

**Main agent invokes `dev-toolkit:git-expert`** to set up worktrees:

```bash
# Ensure main is up to date
git checkout main
git pull origin main

# Create worktree directory
mkdir -p ../project-worktrees

# Create worktree for each parallel ticket
git worktree add ../project-worktrees/TASK-3.1.1 -b feature/TASK-3.1.1
git worktree add ../project-worktrees/TASK-3.1.2 -b feature/TASK-3.1.2
```

**Worktree structure:**
```
project/                      # Main working directory
project-worktrees/            # Worktree container
├── TASK-3.1.1/              # Independent worktree
└── TASK-3.1.2/              # Independent worktree
```

### Phase M4: Parallel Implementation

**For each parallel group, main agent launches agents in parallel:**

```
Agent-1 (working in ../project-worktrees/TASK-3.1.1):
├── Implement TASK-3.1.1
├── Run tests in worktree
├── Commit to feature/TASK-3.1.1
└── Report completion

Agent-2 (working in ../project-worktrees/TASK-3.1.2):  [PARALLEL]
├── Implement TASK-3.1.2
├── Run tests in worktree
├── Commit to feature/TASK-3.1.2
└── Report completion
```

**Each agent must:**
- Work ONLY within their assigned worktree directory
- Use absolute paths relative to worktree root
- Run tests within their worktree
- NOT touch files outside their scope

### Phase M5: Sequential Dependencies

**After parallel group completes:**

1. Merge completed branches to main (or create PRs)
2. Update worktrees with latest main
3. Execute sequential tickets in dependency order

```bash
# Merge TASK-3.1.1 to main
git checkout main
git merge --no-ff feature/TASK-3.1.1

# Now TASK-3.1.3 can proceed (depends on 3.1.1)
git worktree add ../project-worktrees/TASK-3.1.3 -b feature/TASK-3.1.3
```

### Phase M6: Multi-PR Strategy

**Option A: Single Combined PR (Simple)**
- Merge all feature branches to a release branch
- Create single PR for all tickets
- Easier review, single merge

**Option B: Individual PRs (Granular)**
- Create PR for each ticket
- Review and merge sequentially
- Better traceability, but more overhead

**Present options to user for decision.**

### Phase M7: Worktree Cleanup

**After all tickets complete and merge:**

```bash
# Remove worktrees
git worktree remove ../project-worktrees/TASK-3.1.1
git worktree remove ../project-worktrees/TASK-3.1.2

# Delete merged branches
git branch -d feature/TASK-3.1.1
git branch -d feature/TASK-3.1.2

# Clean up remote branches
git push origin --delete feature/TASK-3.1.1
git push origin --delete feature/TASK-3.1.2

# Prune stale references
git worktree prune
```

---

## Single-Ticket Workflow (Standard)

**When a single ticket is provided, use the standard SWARM workflow.**

## Phase 1: Session Initialization & Planning

### Step 1: Invoke Orchestrator for Planning

**Main agent invokes `dev-toolkit:subagent-orchestrator`** with ticket context:

**If ticket ID provided:**
- Main agent fetches ticket details
- Main agent invokes orchestrator with ticket content
- Orchestrator analyzes and creates execution plan

**If NO ticket ID provided:**
- Main agent retrieves available tickets (backlog, todo)
- Main agent invokes `dev-toolkit:implementation-manager` to analyze and recommend tickets
- Present ticket options to user
- User selects ticket
- Main agent invokes orchestrator with selected ticket

**Orchestrator Deliverable:**
- Detailed task breakdown
- Dependencies between tasks
- Parallel vs. sequential execution recommendations
- Risk assessment and mitigations
- Time estimates

**TRUST SUBAGENT OUTPUT:** Present the orchestrator's plan directly to the user without additional research. Subagents run in isolated contexts specifically to do analysis work - duplicating that work wastes main agent context.

### Step 3: Present Plan and Move Ticket

**Main agent presents orchestrator's plan to user:**
- Task breakdown with time estimates
- Parallelization opportunities and rationale
- Dependencies and sequencing
- Risk assessment
- Total estimated time

**Request user approval or refinements.**

**User provides feedback:**
- Approve plan as-is → Proceed to Phase 2
- Request modifications → Update plan, re-present
- Reject plan → End workflow

---

## Phase 2: Git & Session Setup

### Step 1: Invoke Git Workflow Specialist

**Main agent invokes `dev-toolkit:git-expert`:**
- Pull latest changes from remote
- Create feature branch: `feature/[ticket-id]-description`
- Push feature branch to remote

### Step 2: Main Agent Creates Session Tracking Document

**CRITICAL: Main agent creates this, NOT documenter**

**Location:** `docs/sessions/tracking/SESSION-[TICKET-ID]-[YYYY-MM-DD].md`

**Content:**
- Execution plan from orchestrator (full details)
- Task breakdown with acceptance criteria
- Git context (branch names)
- Critical context for session resumption
- Parallelization decisions
- All timestamps and metadata

**Purpose:** This document must be detailed enough for a fresh session to resume work at any point.

### Step 3: Main Agent Creates TodoWrite Task List

**Main agent uses TodoWrite tool:**
- Mirror structure from session tracking document
- Provides real-time status visibility
- Updated after each milestone completion

---

## Phase 3: Implementation

**Main agent coordinates execution based on orchestrator recommendations.**

### Sequential Execution (When tasks have dependencies or modify same files)

**For each task:**

1. **Main agent invokes appropriate developer agent**
   - Provide clear task scope and acceptance criteria
   - Reference session tracking document for context

2. **Developer implements task**
   - Focus on single task only
   - Write implementation code
   - **Developer tests immediately**

3. **Developer reports completion**

4. **Main agent updates tracking document and TodoWrite**

5. **Main agent invokes test-runner**
   - Run test suite
   - **HARD GATE:** If tests fail, return to developer

6. **Tests pass → Main agent invokes git-expert**
   - Commit THIS TASK only
   - Push commit to remote

7. **Repeat for next task**

### Parallel Execution (When orchestrator recommends AND main agent agrees)

**Main agent launches multiple developer agents simultaneously:**

1. **Main agent invokes multiple agents in parallel**
   - Each agent gets clear, independent scope
   - No file conflicts
   - No logical dependencies

2. **Each agent works independently**

3. **Main agent monitors completion**
   - Wait for ALL parallel tasks to finish

4. **Main agent invokes test-runner**
   - Run full test suite with ALL changes
   - **HARD GATE:** If tests fail, return to appropriate developer

5. **All tests pass → Main agent invokes git-expert**
   - **Batch commit:** `type: description (TASK-X, TASK-Y)`

---

## Phase 4: Commit Code Changes

**Integrated into Phase 3** - commits happen after each task/batch completion.

---

## Phase 5: Documentation Updates

**Only if documentation updates needed.**

### Step 1: Main Agent Invokes Documentation Engineer

**Main agent invokes `dev-toolkit:documenter`:**
- Specify which documents need updates
- Provide context about changes made

### Step 2: Main Agent Invokes Git Workflow Specialist

**Commit documentation changes separately:**
- Format: `docs: description (TICKET-ID)`
- Push to remote

---

## Phase 6: PR Creation

### Step 1: Main Agent Invokes git-expert

**Create pull request BEFORE code review:**
- Generate PR title from ticket
- Create comprehensive PR body with:
  - Summary of changes
  - Files modified
  - Test coverage
  - Link to ticket
- Push PR to remote
- **Return PR URL to main agent**

---

## Phase 7: Code Review (On PR)

### Step 1: Main Agent Invokes code-reviewer

**Code reviewer reviews the PR directly:**
- Use `gh pr diff` to see changes
- Leave inline comments on specific lines via `gh api`
- Leave file-level comments where appropriate
- Submit review with overall assessment

**Review outcomes:**
- **Approved** → Proceed to Phase 8
- **Changes Requested** → Fix issues, re-test, push, re-review

### Step 2: If Changes Requested

1. Main agent invokes appropriate developer to fix issues
2. Developer pushes fixes to same branch
3. Main agent invokes test-runner to verify
4. Main agent invokes code-reviewer to re-review PR
5. Repeat until approved

**User can view all review comments directly on the PR.**

---

## Phase 8: Documentation Updates (Post-Review)

**Only if code review resulted in changes OR documentation updates needed.**

### Step 1: Main Agent Executes /docs Command

**Main agent invokes `/docs` with implementation context:**
```
/dev-toolkit:docs "Update documentation for [feature].
Implementation details:
- Added [component/service] with [functionality]
- Modified [existing component] to support [new behavior]
- API changes: [list any API changes]

Review recent commits for specific changes."
```

**documenter agent will:**
- Review recent commits to understand changes
- Determine which documentation files need updates
- Update README, API docs, guides as appropriate
- NOT be told which files to change - agent decides based on implementation

### Step 2: Commit Documentation

**Main agent invokes git-expert:**
- Commit documentation changes separately
- Push to PR branch
- Format: `docs: update documentation for [ticket-id]`

---

## Phase 9: User Approval & Merge

### Step 1: Main Agent Presents PR to User

Present:
- PR URL (user can view inline review comments)
- Code review status (approved)
- Test results
- Documentation updates made

Request user decision:
- Approve → Proceed to merge
- Request changes → Return to appropriate phase

### Step 2: User Approves - Cleanup & Merge

**Main agent moves session tracking doc to archive:**
- Move `docs/sessions/tracking/SESSION-*.md` to `.deleted/docs/sessions/tracking/`
- Use `git mv` to preserve history

**Main agent invokes git-expert to merge PR:**
- Squash-merge PR
- Delete feature branch
- Checkout main/development branch
- Pull latest changes

**Update ticket status to done.**

### Step 3: Main Agent Presents Final Summary

Show:
- Ticket completion confirmation
- Merge details
- Test results
- Time taken
- Next available work

---

## Critical Workflow Rules

**Mandatory Practices:**

1. **Only Main Agent Invokes Subagents** - Orchestrator creates plans but does NOT invoke
2. **Trust Subagent Output** - Present subagent results directly; do NOT duplicate their analysis with your own file reads
3. **One Commit Per Task (Sequential)** - Each task completion triggers immediate commit
4. **Batch Commit for Parallel Work** - Single commit when tasks truly execute simultaneously
5. **Test Immediately After Each Task** - Developers test before declaring complete
6. **Ticket Status Must Be Current** - Update at ALL key transitions
7. **Git Operations via git-expert** - Developers NEVER do git operations
8. **User Approval is Mandatory Gate** - Tickets cannot move to `done` without user review
9. **Session Tracking is Main Agent's Job** - NOT delegated to documenter
10. **Documentation Updates After Implementation** - Committed separately from code
11. **TodoWrite Mirrors Session Tracking** - Updated after each milestone

---

## MAIN AGENT DELEGATION RULES - MANDATORY

**CRITICAL:** As the main agent in SWARM workflow, you are a **COORDINATOR**, not an implementer. Your role is to invoke subagents and track progress - NEVER to perform implementation work directly.

### What You MUST NEVER Do Directly:

| Action | Use This Subagent Instead |
|--------|---------------------------|
| Edit code files (Edit tool on src/, tests/) | `dev-toolkit:frontend-developer` or `dev-toolkit:backend-developer` |
| Run tests (Bash npm test, npx jest, etc.) | `dev-toolkit:test-runner` |
| Execute git commands (git add, commit, push, etc.) | `dev-toolkit:git-expert` |
| Query/update tickets in database | `dev-toolkit:ticket-manager` |
| Update documentation files | `dev-toolkit:documenter` |

### The "One Line Change" Rule

Even if a task appears trivial (one-line fix, simple file move, single git command), you **MUST delegate** to the appropriate specialist. Specialists handle:

- **Complete workflows** - not just the "hard parts"
- **Quality validation** - they know domain-specific standards
- **Safety protocols** - especially for git operations and ticket integrity
- **Pattern consistency** - they maintain codebase conventions

**Wrong thinking:** "This is just one line → I'll do it directly"
**Correct thinking:** "This is code modification → frontend-developer owns code quality"

### What You MAY Do Directly:

- Read files for analysis and understanding
- Search/glob for information gathering
- Invoke subagents via Task tool
- Update TodoWrite task lists
- Create/update session tracking documents
- Present information to users and request decisions
- Parse orchestrator plans and coordinate execution

### Pre-Action Check

Before using Edit, Bash, or Write tools, ask yourself:
1. "Is this an implementation action?" → If yes, **delegate**
2. "Does a specialist own this domain?" → If yes, **delegate**
3. "Am I about to modify project state?" → If yes, **delegate**

### Why This Matters

**Context efficiency:** Delegation actually SAVES context because subagents work in isolated contexts. Direct implementation consumes MORE main agent context through file reads, debugging, and multiple attempts.

**Quality assurance:** Specialists know domain-specific rules. Example: git-expert knows the branching strategy and will create bug fixes from `main`, not from feature branches.

**Process integrity:** When you bypass specialists, you bypass the quality gates and safety protocols they enforce.

---

## Examples

### Example 1: Work on specific ticket
```
/swarm STORY-3.2
```
- Main agent fetches STORY-3.2
- Main agent invokes orchestrator for planning
- Main agent presents plan to user for approval
- Upon approval, main agent executes all 7 phases

### Example 2: Work with custom instructions
```
/swarm STORY-3.2 Focus on backend first, then frontend
```
- Same flow as Example 1
- Instructions applied to orchestrator's planning

### Example 3: Let main agent recommend ticket
```
/swarm
```
- Main agent retrieves available tickets
- Main agent invokes implementation-manager for recommendations
- User selects from presented options
- Main agent proceeds with selected ticket

### Example 4: Session resumption scenario
```
/swarm STORY-3.2
```
- If session tracking doc exists for STORY-3.2
- Main agent reads tracking doc to understand current state
- Resumes from last documented milestone

### Example 5: Multiple independent tickets (parallel with worktrees)
```
/swarm TASK-3.1.1 TASK-3.1.2
```
- Main agent analyzes dependencies between tickets
- If independent: Creates git worktrees for parallel execution
- Each ticket gets its own branch and working directory
- Agents work in parallel, then PRs are created/merged

### Example 6: Multiple tickets with dependencies
```
/swarm TASK-3.1.1, TASK-3.1.2, TASK-3.1.3
```
- Main agent analyzes dependencies
- Orchestrator identifies: TASK-3.1.3 depends on TASK-3.1.1
- Execution plan: Parallel [3.1.1, 3.1.2], then Sequential [3.1.3]
- Worktrees created for parallel group, sequential executed after merge

### Example 7: Multiple tickets with instructions
```
/swarm TASK-4.1.1 TASK-4.1.2 Prioritize test coverage
```
- Multi-ticket mode with custom instructions
- Instructions applied to orchestrator's planning and all agents

</execution>
