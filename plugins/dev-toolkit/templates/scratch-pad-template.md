---
invocation_id: "{NNN}-{agent}-{description}"
agent: "{agent-type}"
ticket_id: "{TICKET-ID}"
session_dir: ".claude/tickets/{TICKET-ID}"
started: "{YYYY-MM-DDTHH:MM:SSZ}"
completed: null
duration_seconds: null
status: in_progress
---

# {Agent Name}: {Brief Task Description}

## Prompt Received

> {Exact prompt/instructions received from main agent}

---

## Context References

Files and invocations read during this work:

| Type | Path | Purpose |
|------|------|---------|
| file | `/path/to/file` | {why it was read} |
| invocation | `{NNN}-{agent}-{desc}.md` | {context needed} |

---

## Work Notes

Internal reasoning and analysis (not returned to main agent):

### Analysis
- {Key observations about the task}
- {Technical considerations}

### Key Decisions Made
- **Decision:** {What was decided}
  - **Rationale:** {Why this approach}
  - **Alternatives Considered:** {Other options rejected}

### Implementation Notes
- {Important details about the work done}
- {Technical debt or future considerations}

---

## Response Summary

{Brief summary for main agent - target 100-500 tokens}

{This is what gets returned to the main agent along with the file path}

---

## Full Response

{Complete detailed response - other subagents can read this directly}

```
{Code snippets, detailed explanations, file lists, etc.}
```

---

## Errors / Issues

{Any problems encountered during execution}

| Severity | Issue | Resolution |
|----------|-------|------------|
| {low/med/high} | {description} | {how it was resolved or "unresolved"} |

---

## Next Steps

{What should happen after this invocation completes}

- {Recommended next action}
- {Dependencies to note}

---

<!--
TEMPLATE USAGE INSTRUCTIONS (remove this section when using):

1. Replace all {placeholders} with actual values
2. Update YAML frontmatter:
   - invocation_id: Use format NNN-agent-description (e.g., 002-backend-dev-auth-service)
   - agent: The agent type (backend-developer, test-runner, etc.)
   - ticket_id: The ticket being worked on
   - session_dir: The session directory path
   - started: ISO 8601 timestamp when work began
   - completed: Update when work finishes
   - duration_seconds: Calculate from start to completion
   - status: in_progress -> completed or failed

3. Fill in sections as you work:
   - Prompt Received: Copy the exact prompt from main agent
   - Context References: Log all files/invocations you read
   - Work Notes: Document reasoning (not returned to main)
   - Response Summary: Brief version for main agent
   - Full Response: Complete output for other subagents
   - Errors/Issues: Any problems encountered
   - Next Steps: What should happen next

4. When returning to main agent, use format:
   Scratch Pad: {session_dir}/{invocation_name}.md

   {Response Summary content}
-->
