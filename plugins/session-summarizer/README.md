# Session Summarizer Plugin

A Claude Code plugin that enables seamless session continuity by intelligently summarizing work sessions and allowing you to resume where you left off, even after hitting context window limits.

## Overview

Long Claude Code sessions eventually reach context window limits. This plugin solves that problem by:
- **Summarizing** your current session with all key context, decisions, and progress
- **Archiving** summaries for future reference
- **Restarting** work in a fresh session with full continuity

## Features

- **Smart Summarization**: Automatically parses session transcripts to extract meaningful work context
- **Session History**: Optional archiving of summaries to `.claude/summaries/` directory
- **Seamless Continuation**: Resume work in new sessions with full context preservation
- **Flexible Workflow**: Optional git commits before summarization

## Installation

### From Marketplace
```bash
# Coming soon - install via Claude Code marketplace
```

### Local Development
```bash
# Clone or copy to plugins directory
claude-code --plugin-dir /home/marketplace/session-summarizer
```

## Usage

### Summarizing a Session

When approaching context limits, summarize your current session:

```bash
/summarize
```

With git commit first:
```bash
/summarize commit
```

With additional instructions for the summarizer:
```bash
/summarize Focus on the API changes and database schema decisions
```

**What happens:**
1. Generates a unique session marker
2. Invokes the `compact-summarizer` agent to parse your transcript
3. Creates `.claude/session-summary.md` with structured summary
4. Optionally archives the summary with timestamp to `.claude/summaries/`

### Continuing from Previous Session

In a new Claude Code session, load your previous context:

```bash
/restart
```

**What happens:**
1. Reads `.claude/session-summary.md`
2. Presents recap of what was being worked on
3. Lists next steps from the previous session
4. Continues work seamlessly

## How It Works

### Session Marker System
The `/summarize` command generates a UUID that marks your current position in the transcript. This allows the agent to locate and parse exactly the right session data.

### Transcript Parsing
The plugin includes a custom parser that converts Claude Code's JSONL transcript format into human-readable text, filtering out noise and focusing on meaningful conversation, decisions, and work.

### Intelligent Summarization
The `compact-summarizer` agent analyzes the parsed transcript to extract:
- Current task/goal and context
- Files being actively worked on
- Work in progress (partial implementations, uncommitted changes)
- Key decisions and architectural choices
- Important commits
- Next steps
- Open questions or blockers

### Summary Structure
Generated summaries follow a consistent format:
```markdown
# Session Summary

> Generated: [timestamp]
> Previous session ended while working on: [description]

## Current Focus
[What you're working on]

## Files in Progress
[Table of files and their status]

## Work in Progress
[Detailed state of incomplete work]

## Key Decisions
[Important choices made]

## Recent Commits
[Relevant commit references]

## Next Steps
[Actionable next steps]

## Open Questions / Blockers
[Unresolved issues]

## Additional Context
[Other important information]
```

## Directory Structure

```
.claude/
├── session-summary.md          # Latest summary for /restart
└── summaries/                  # Archived summaries (optional)
    ├── 2025-01-15-143022-summary.md
    ├── 2025-01-15-160845-summary.md
    └── 2025-01-16-091234-summary.md
```

## Prerequisites

- Claude Code (latest version)
- Node.js (for transcript parsing)
- Bash (for archiving scripts)

## Tips

1. **When to Summarize**: Run `/summarize` when you notice:
   - Responses becoming slower
   - Context window warnings
   - Before switching to a different task

2. **Git Integration**: Use `/summarize commit` to create a clean checkpoint with version control

3. **Custom Instructions**: Add specific instructions to focus the summarizer on what matters most

4. **Archive Management**: Archives in `.claude/summaries/` are never auto-deleted, so you can reference old sessions anytime

## Troubleshooting

**"Transcript file not found" error:**
- The agent will prompt you for your session ID
- Run `/tasks` in the main session to get your current session ID
- Start a new summarization with the session ID provided

**Summary doesn't capture recent work:**
- Ensure the UUID marker was generated before invoking the agent
- Check that you're in the project root directory (contains `.claude/`)

**Can't find archived summaries:**
- Summaries are only archived if you answer "Yes" when prompted by the agent
- Check `.claude/summaries/` directory in your project root

## Contributing

Found a bug or have a feature request? Please open an issue or submit a pull request.

## License

MIT

## Author

Mike Eckert (nitromike502@gmail.com)
