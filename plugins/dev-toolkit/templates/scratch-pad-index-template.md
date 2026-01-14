---
ticket_id: "{TICKET-ID}"
ticket_type: "{Epic|Story|Task|Bug}"
session_started: "{YYYY-MM-DDTHH:MM:SSZ}"
session_status: in_progress
total_invocations: 0
last_updated: "{YYYY-MM-DDTHH:MM:SSZ}"
branch: "feature/{TICKET-ID}-{description}"
---

# Session Index: {TICKET-ID}

## Quick Reference

| Item | Value |
|------|-------|
| Session Directory | `.claude/tickets/{TICKET-ID}/` |
| Session Tracking | [session-tracking.md](./session-tracking.md) |
| Branch | `feature/{TICKET-ID}-{description}` |
| Status | {in_progress / completed / blocked} |

---

## Invocation Registry

| Seq | File | Agent | Status | Started | Duration |
|-----|------|-------|--------|---------|----------|
| 001 | [001-orchestrator-planning.md](./001-orchestrator-planning.md) | orchestrator | completed | HH:MM | Xm Xs |
| 002 | [002-backend-dev-{desc}.md](./002-backend-dev-{desc}.md) | backend-dev | in_progress | HH:MM | - |

---

## Invocation Flow

```
001-orchestrator-planning
    ↓
002-backend-dev-{task}  ←──  (reads 001 for plan context)
    ↓
003-test-runner-{task}  ←──  (reads 002 for implementation details)
    ↓
004-backend-dev-{fix}   ←──  (reads 003 for test failures)
    ↓
...
```

---

## Phase Summary

| Phase | Invocations | Status | Notes |
|-------|-------------|--------|-------|
| Planning | 001 | completed | Execution plan created |
| Implementation | 002-XXX | in_progress | {X/Y tasks complete} |
| Testing | XXX-XXX | pending | - |
| Documentation | XXX | pending | - |
| Review | XXX-XXX | pending | - |

---

## Failed Invocations

{List any invocations with status: failed}

| Seq | File | Agent | Failure Reason |
|-----|------|-------|----------------|
| - | - | - | No failures |

---

## Session Notes

{Any important notes about this session}

- {Note 1}
- {Note 2}

---

<!--
INDEX MAINTENANCE INSTRUCTIONS:

This file is maintained by the main agent. After each subagent invocation:

1. Add new row to Invocation Registry table
2. Update total_invocations in frontmatter
3. Update last_updated timestamp
4. Update Phase Summary as phases complete
5. Add to Failed Invocations if status: failed

The index enables:
- Quick lookup of all invocations in session
- Understanding of invocation flow/dependencies
- Identification of failed invocations for debugging
- Phase-level progress tracking

Subagents can read this file to understand session context and find
relevant previous invocations to read.
-->
