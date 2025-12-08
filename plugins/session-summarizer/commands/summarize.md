---
name: summarize
description: Summarize the current session for continuation in a new context window. Optionally commits changes first.
argument-hint: [commit] [additional instructions for summarizer]
allowed-tools: Bash, Task
---

# Session Summarization

You are executing the `/summarize` command to create a structured summary of the current Claude Code session for seamless continuation in a fresh context window.

## Step 1: Verify Project Root

Before proceeding, ensure you are in the project root directory (the directory containing `.claude/`). If not, change to the project root first using Bash.

## Step 2: Handle Arguments

Parse the provided arguments: `$ARGUMENTS`

- **If the first argument is `commit`**:
  1. Use the Task tool to invoke the `git` subagent to commit any uncommitted changes with an appropriate message
  2. Treat any remaining text after "commit" as additional instructions for the compact-summarizer agent

- **If the first argument is not `commit`**:
  - Treat the entire argument string as additional instructions for the compact-summarizer agent

## Step 3: Generate Session Marker

Generate a UUID v4 and output it clearly to the conversation on its own line:

```
SESSION_MARKER: <generated-uuid>
```

This marker will be captured in the transcript file for the subagent to locate.

**Implementation**: Use Bash to generate the UUID:
```bash
uuidgen  # On macOS/Linux
```

Or if `uuidgen` is not available:
```bash
cat /proc/sys/kernel/random/uuid  # On Linux
```

Or use Node.js:
```bash
node -e "console.log(require('crypto').randomUUID())"
```

Choose the method most likely to work cross-platform, and output the UUID clearly.

## Step 4: Invoke Compact Summarizer Agent

Use the Task tool to invoke the `session-summarizer:compact-summarizer` subagent with the following prompt structure:

```
Summarize the current session using session marker: <UUID>

[If additional instructions were provided, include them here]
```

**Important**: Pass the UUID clearly so the agent can locate the correct transcript file. The agent is namespaced as `session-summarizer:compact-summarizer`.

## Step 5: Wait for Completion

The agent will:
1. Locate the transcript file containing the UUID marker
2. Parse the transcript into readable format
3. Analyze and generate a structured summary
4. Save to `.claude/session-summary.md`
5. Ask the user if they want to archive the summary

Once the agent completes, confirm to the user:

```
Session summary created successfully at .claude/session-summary.md

You can now:
- Start a new Claude Code session to reset context window
- Run /restart in the new session to continue where you left off
- Review the summary at .claude/session-summary.md
[If archived: - Access archived summary at .claude/summaries/<timestamp>-summary.md]
```

## Error Handling

If the agent reports that it cannot find the transcript file with the UUID:
- This may happen if the UUID hasn't been written to the transcript yet
- Inform the user that they may need to wait a moment and try again
- Or they can check the transcript location manually

## Notes

- This command is designed to be run when approaching context window limits
- The summary preserves all key context: current focus, decisions, work in progress, next steps
- The `/restart` command in a new session will read this summary to continue seamlessly
