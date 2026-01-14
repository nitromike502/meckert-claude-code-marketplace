# Scratch Pad Integration Guide

This guide defines how subagents use the scratch pad system for persistent documentation and inter-agent context sharing.

## Overview

The scratch pad system provides each subagent invocation with its own markdown file to:
- Document the work performed
- Capture reasoning and decisions (for debugging/audit)
- Return a brief summary to the main agent (reducing context usage)
- Allow subsequent subagents to read detailed context directly

## When Scratch Pad Mode is Active

Scratch pad mode is active when the main agent provides these parameters:

```yaml
scratch_pad:
  session_dir: ".claude/tickets/STORY-3.1"
  invocation_name: "002-backend-dev-auth-service"
```

If these parameters are NOT provided, use your standard response format.

---

## Required Workflow

When scratch pad parameters are provided, you MUST follow this workflow:

### 1. Create Your Scratch File Immediately

Create your file at: `{session_dir}/{invocation_name}.md`

Example: `.claude/tickets/STORY-3.1/002-backend-dev-auth-service.md`

### 2. Write Initial YAML Frontmatter

```yaml
---
invocation_id: "002-backend-dev-auth-service"
agent: "backend-developer"
ticket_id: "STORY-3.1"
session_dir: ".claude/tickets/STORY-3.1"
started: "2025-12-31T14:23:00Z"
completed: null
duration_seconds: null
status: in_progress
---
```

### 3. Record the Prompt Received

Copy the exact prompt/instructions from the main agent into the "Prompt Received" section.

### 4. Find and Reference Previous Context

Search the session directory for relevant previous invocations:

```
Glob: {session_dir}/*.md
```

Read the index file for invocation registry:
```
{session_dir}/index.md
```

Read relevant previous scratch files as needed. Document what you read in "Context References" section.

### 5. Document Your Work

As you work, capture:
- **Work Notes**: Internal reasoning, analysis, decisions made (NOT returned to main)
- **Context References**: All files and invocations you read
- **Errors/Issues**: Any problems encountered

### 6. Complete Your Scratch File

When finished:
1. Update frontmatter:
   - `status`: `completed` or `failed`
   - `completed`: ISO 8601 timestamp
   - `duration_seconds`: Calculate from start to completion

2. Write sections:
   - **Response Summary**: Brief output for main agent (100-500 tokens target)
   - **Full Response**: Complete detailed output (other subagents read this)
   - **Next Steps**: What should happen after this invocation

### 7. Return to Main Agent

Return ONLY this format:

```
Scratch Pad: {session_dir}/{invocation_name}.md

{Response Summary content - keep brief, ~100-500 tokens}
```

**Do NOT** return the Full Response to the main agent. That stays in the file for other subagents to read directly.

---

## Section Reference

Your scratch file should contain these sections:

| Section | Purpose | Returned to Main? |
|---------|---------|-------------------|
| Prompt Received | Exact input from main agent | No |
| Context References | Files/invocations you read | No |
| Work Notes | Internal reasoning and decisions | No |
| Response Summary | Brief output for main agent | **Yes** |
| Full Response | Complete output for other subagents | No |
| Errors / Issues | Problems encountered | No (unless critical) |
| Next Steps | Recommended next actions | No |

---

## Finding Previous Context

When you need context from previous work in the session:

1. **Read the index file** to understand what invocations exist:
   ```
   {session_dir}/index.md
   ```

2. **Glob for scratch files**:
   ```
   {session_dir}/*.md
   ```

3. **Read relevant previous files**:
   - Planning context: `001-orchestrator-*.md`
   - Implementation details: `*-backend-dev-*.md`, `*-frontend-dev-*.md`
   - Test results: `*-test-runner-*.md`
   - Review feedback: `*-code-reviewer-*.md`

4. **Focus on these sections** in previous files:
   - **Full Response**: The detailed output
   - **Key Decisions Made**: Important architectural choices
   - **Errors / Issues**: Problems to be aware of

---

## Template Location

Use the template at:
```
${CLAUDE_PLUGIN_ROOT}/templates/scratch-pad-template.md
```

---

## Example Scratch File

```markdown
---
invocation_id: "002-backend-dev-auth-service"
agent: "backend-developer"
ticket_id: "STORY-3.1"
session_dir: ".claude/tickets/STORY-3.1"
started: "2025-12-31T14:23:00Z"
completed: "2025-12-31T14:45:30Z"
duration_seconds: 1350
status: completed
---

# Backend Developer: Implement Auth Service

## Prompt Received

> Implement TASK-3.1.1: Create authentication service with JWT token generation.
> See orchestrator plan for details.

## Context References

| Type | Path | Purpose |
|------|------|---------|
| invocation | 001-orchestrator-planning.md | Task breakdown and requirements |
| file | src/services/user-service.js | Existing service pattern |

## Work Notes

### Analysis
- JWT approach aligns with existing stateless architecture
- Need to add jsonwebtoken dependency

### Key Decisions Made
- **Decision:** Use RS256 algorithm for JWT signing
  - **Rationale:** Better security than HS256, supports key rotation
  - **Alternatives Considered:** HS256 (simpler but less secure)

## Response Summary

Implemented auth service with JWT token generation at `src/services/auth-service.js`.
Added login/logout endpoints. Tests recommended before proceeding.

## Full Response

### Files Created
- `src/services/auth-service.js` - JWT token generation and validation
- `src/routes/auth-routes.js` - Login and logout endpoints
- `tests/services/auth-service.test.js` - Unit tests (12 tests)

### Implementation Details
[...detailed implementation notes...]

## Errors / Issues

None encountered.

## Next Steps

- Run test suite to validate implementation
- Proceed to TASK-3.1.2 (auth middleware)
```

---

## Graceful Degradation

If you cannot create the scratch file (permission error, disk full, etc.):

1. Log a warning in your response
2. Fall back to returning full response inline
3. Format:

```
WARNING: Scratch pad file creation failed
Reason: {error description}
Falling back to inline response.

{Full Response content}
```
