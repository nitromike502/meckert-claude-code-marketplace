---
name: restart
description: Continue work from a previous session using the saved summary. Use this at the start of a new session after running /summarize.
allowed-tools: Read
---

# Session Continuation

**This is a continuation of a previous session.**

A prior session was summarized to preserve context before reaching the context window limit. A summary of that session's state, decisions, and progress has been saved.

## Your Instructions

### 1. Read the Session Summary

Read the file `.claude/session-summary.md` located in the project root directory. This contains:
- The current focus and goals from the previous session
- Files that were being actively worked on
- Work in progress (including any incomplete implementations)
- Key decisions that were made
- Relevant commit references
- Next steps that were planned
- Any open questions or blockers

### 2. Trust the Summary

The summary accurately reflects the state of work from the previous session. **You must trust it.** Specifically:

- **Do not** re-verify work that the summary states is complete
- **Do not** re-run tests that were already passing unless you make new changes
- **Do not** review git logs or commit history to "catch up" — the summary contains all relevant information
- **Do not** re-ask questions that were already answered in the previous session
- **Do not** redo analysis or exploration that was already performed
- **Do not** second-guess decisions that were already made unless the user explicitly asks to revisit them

### 3. Continue Where the Previous Session Left Off

Use the "Next Steps" section as your starting point. If the previous session was in the middle of a task (e.g., editing a function, implementing a feature), continue that task directly.

### 4. Respect Established Decisions

The summary includes key decisions from the previous session. Honor those decisions unless the user explicitly wants to revisit them. If you're uncertain whether a decision should stand, ask rather than override it.

### 5. Ask Only If the Summary Is Unclear

The summary should provide sufficient context to continue. If something critical is missing or ambiguous, ask for clarification. But assume the summary is complete unless you have specific reason to believe otherwise.

## Begin

1. Read `.claude/session-summary.md` now using the Read tool
2. Confirm you understand the current state by providing a brief summary of:
   - What was being worked on
   - What the immediate next steps are
3. Ask the user how they would like to proceed, or if the next steps are clearly defined, begin working on them directly

## Error Handling

If `.claude/session-summary.md` does not exist:
- Inform the user that no session summary was found
- Suggest running `/summarize` in their previous session first
- Explain that this command requires a summary to have been generated already
