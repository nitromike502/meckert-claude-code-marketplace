---
name: project-status
description: Check project status and recommend next tickets to work on
---

# Project Status Check
# Development Assessment & Intelligent Ticket Selection

<task>
Assess the current state of project development, check for active work in progress, and intelligently recommend next tickets to work on using the ticket manager and project manager.
</task>

<context>
**Development Method**: SWARM (Specialized Workflow with Autonomous Resource Management)

**Documentation Discovery:**
Before status check, reference project-specific documentation:

1. **Check project docs first:**
   - `docs/guides/SWARM-WORKFLOW.md`
   - `CLAUDE.md` or `README.md` for project context

2. **Fall back to plugin guides:**
   - `${CLAUDE_PLUGIN_ROOT}/guides/SWARM-WORKFLOW.md`

This command performs intelligent project assessment and ticket recommendation:
1. Check for active work (in-progress tickets, feature branches, session tracking docs)
2. If NO active work → Invoke ticket manager and project manager for recommendations
3. If active work found → Show current status and offer to continue or switch
4. Present actionable next steps with context

**Integration with SWARM Workflow:**
- Works with implementation-manager for ticket recommendations
- Seamlessly hands off to `/swarm` command for execution
</context>

<execution>
## Phase 1: Check for Active Work

### Step 1: Check Git Status

**Determine current branch and status:**
```bash
git branch --show-current
git status --porcelain
```

**Analyze:**
- Current branch name (feature branch indicates active work)
- Uncommitted changes (implementation in progress)
- Modified files

### Step 2: Check for In-Progress Tickets

**Check TodoWrite for in-progress items:**
- Query for tickets with status `in-progress`
- Check if any tickets are actively being worked on

### Step 3: Check for Session Tracking Documents

**Check for active session tracking:**
```bash
ls -la docs/sessions/tracking/SESSION-*.md 2>/dev/null
```

**If tracking docs exist:**
- Active session may have been interrupted
- Document contains resumption context

---

## Phase 2: Intelligent Ticket Selection

### Scenario A: NO Active Work Found

**When:**
- On main or development branch (not feature branch)
- No in-progress tickets
- No session tracking documents
- No uncommitted changes

**Action: Invoke Project Manager**

**Step 1: Get available tickets**
- Check TodoWrite or ticket system for `backlog` or `todo` items

**Step 2: Invoke `implementation-manager`:**
- Provide: List of available tickets
- Request: Analyze tickets and recommend 3-5 options
- Project manager considers:
  - Ticket priorities
  - Dependencies (blocks/blocked by)
  - Logical sequencing
  - Complexity and risk
  - Available time estimates

**Step 3: Present Recommendations to User**

Format:
```
## Recommended Tickets

### Option 1: [TICKET-ID] - [Title] (Recommended)
- **Priority:** P0/P1/P2/P3
- **Type:** Story | Task | Bug
- **Estimate:** XX minutes
- **Dependencies:** None | Blocked by [TICKET-ID]
- **Rationale:** [Why this is recommended]
- **Risk:** Low | Medium | High

### Option 2: [TICKET-ID] - [Title]
[Same structure]

**To start work on a ticket:** `/swarm [TICKET-ID]`
```

---

### Scenario B: Active Work Found

**When:**
- On feature branch, OR
- In-progress tickets exist, OR
- Session tracking documents exist, OR
- Uncommitted changes present

**Action: Show Current Status and Options**

**Display:**
```
## Current Work Status

### Active Feature Branch
- **Branch:** feature/story-X.X-description
- **Created:** [timestamp from git]

### In-Progress Ticket
- **Ticket:** STORY-X.X - [Title]
- **Status:** in-progress

### Session Tracking
- **Document:** docs/sessions/tracking/SESSION-*.md
- **Last Updated:** [timestamp]
- **Progress:** [summary from tracking doc]

### Uncommitted Changes
- [List of modified files]

---

## What would you like to do?

**A) Continue Current Work**
   - Resume work on current ticket
   - Read session tracking doc for context
   - Command: `/swarm [TICKET-ID]`

**B) Complete and Switch**
   - Finish current work (commit, PR, merge)
   - Then select new ticket to work on

**C) Abandon Current Work**
   - Reset to clean state
   - Discard uncommitted changes
   - Warning: Will lose current progress

**D) View Available Tickets**
   - Show recommendations for next ticket
   - Keep current work in progress
```

---

## Phase 3: Project Health Summary

**Always include project health metrics:**

```
## Project Health

### Current Phase
- **Status:** [Active development | Planning | Blocked]

### Ticket Summary
- **Backlog:** [count] tickets
- **Todo:** [count] tickets
- **In-Progress:** [count] tickets
- **Review:** [count] tickets awaiting approval
- **Done:** [count] tickets completed

### Recent Activity
- **Last Commit:** [timestamp and message]
- **Last PR:** [PR number and status]

### Test Status
- **Tests:** [XXX/XXX passing]
```

---

## Examples

### Example 1: No active work - Show recommendations
```
User: /project-status

Response:
- Git status: On main branch, clean working directory
- Ticket status: No in-progress tickets
- Session tracking: No active sessions
- Recommendation: Show 3-5 ticket options
- Offer: `/swarm [TICKET-ID]` to start work
```

### Example 2: Active work found - Show current status
```
User: /project-status

Response:
- Git status: On feature/story-3.2-ui branch
- Ticket status: STORY-3.2 is in-progress
- Session tracking: SESSION-STORY-3.2-2025-11-03.md exists
- Progress: 3/5 tasks complete
- Offer options: Continue, Complete & Switch, Abandon, etc.
```

---

## Related Documentation

- **SWARM Workflow:** `docs/guides/SWARM-WORKFLOW.md` or plugin guides
- **Project Overview:** `CLAUDE.md` - Project context and current phase

</execution>
