---
description: Validate and fix YAML frontmatter in Claude Code agent and command files
argument-hint: <path> [--type agents|commands|all]
allowed-tools: Bash, Read, Edit, Glob, AskUserQuestion, Task
---

# Validate Frontmatter Command

You are executing the `/cc-validator:validate-frontmatter` command. Follow this workflow precisely.

## Arguments Received

- **Path**: `$ARGUMENTS` (parse the path and optional `--type` flag)
- Default type: `all` (if `--type` not specified)

## Plugin Resources

- **Scripts directory**: `${CLAUDE_PLUGIN_ROOT}/scripts/`
- **Schema file**: `${CLAUDE_PLUGIN_ROOT}/schemas/frontmatter-schema.md`

## Workflow

### Phase 1: Discovery

1. Parse arguments to extract `path` and `--type` (default: `all`)
2. Validate the path exists
3. Run the discovery script:
   ```bash
   ${CLAUDE_PLUGIN_ROOT}/scripts/find-claude-files.sh <path> --type <type>
   ```
4. Display summary: "Found X agents, Y commands in [path]"

### Phase 2: Analysis

**IMPORTANT**: Use the script pipeline to extract frontmatter efficiently. Do NOT read full files.

1. Read the schema file for validation rules:
   ```
   ${CLAUDE_PLUGIN_ROOT}/schemas/frontmatter-schema.md
   ```

2. Extract frontmatter from all discovered files using the script pipeline:
   ```bash
   ${CLAUDE_PLUGIN_ROOT}/scripts/find-claude-files.sh <path> --type <type> | \
     ${CLAUDE_PLUGIN_ROOT}/scripts/extract-frontmatter.sh --stdin --lines 30
   ```

3. Parse the output and validate each file's frontmatter against schema rules:

   **For Agents (`agents/*.md`):**
   - `name` exists and matches `^[a-z0-9-]{1,64}$`
   - `description` exists
   - `description` uses single quotes if contains `\n` or special chars
   - `tools` is comma-separated string (not YAML array)
   - `model` (if present) is one of: `sonnet`, `opus`, `haiku`, `inherit`
   - `permissionMode` (if present) is valid value
   - `color` (if present) is valid value
   - No unknown properties

   **For Commands (`commands/*.md`):**
   - `name` (if present) matches filename (warning only)
   - Does NOT contain `color` property
   - Does NOT contain `permissionMode` property
   - Does NOT contain `skills` property
   - `description` uses single quotes if contains `\n` or special chars
   - `allowed-tools` is comma-separated string (not YAML array)
   - `disable-model-invocation` (if present) is boolean

4. Categorize issues:
   - **ERROR**: Will prevent file from loading
   - **WARNING**: May cause unexpected behavior

### Phase 3: Report

Display validation results in a clear, readable format. Use your best judgment for formatting that renders well in the terminal.

**IMPORTANT**: Always list ALL properties found in the frontmatter with their values and validation status. Never summarize as "All properties valid" - always show each property individually.

**Report structure:**

```
---
AGENTS

/path/to/agents/file1.md

- ✅ name: "my-agent" - Valid
- ✅ description: "Agent description here" - Valid
- ⚠️ WARNING tools: Uses YAML array format - should be comma-separated string
- ✅ model: "sonnet" - Valid

/path/to/agents/file2.md

- ✅ name: "other-agent" - Valid
- ✅ description: "Another agent" - Valid
- ✅ tools: "Read, Write, Glob" - Valid

---
COMMANDS

/path/to/commands/file1.md

- ⚠️ WARNING name: "my-cmd" - Commands typically don't use name property (derived from filename)
- ⚠️ WARNING color: "green" - Commands don't support color property (this is for agents)
- ✅ description: "Command description" - Valid
- ✅ argument-hint: "[file path]" - Valid

/path/to/commands/file2.md

- ✅ description: "Another command" - Valid
- ✅ allowed-tools: "Bash, Read" - Valid

---
SUMMARY

X files validated
- N files passed
- N files with warnings
- N files with errors
```

**Report rules:**
1. List EVERY property found in the frontmatter, not just invalid ones
2. Show the actual value of each property in quotes
3. Include validation status (✅, ⚠️, ❌) and explanation
4. For properties not present, do NOT list them (only show what exists)

### Phase 3.5: Checkpoint

After displaying the report, if there are any warnings or errors:

1. Ask user using AskUserQuestion:
   - "How would you like to proceed?"
   - Options:
     - "Show proposed fixes" - Continue to Phase 4
     - "Verify schema first" - Use claude-code-guide agent to check for schema updates, then continue
     - "Report only" - End here

2. If user selects "Verify schema first":
   - Use the Task tool with `subagent_type: claude-code-guide` to verify the current frontmatter schema for Claude Code agents and commands
   - Ask about any new or changed properties, valid values, or deprecated features
   - If schema has changed, note the differences and adjust validation accordingly
   - Then continue to Phase 4

3. If user selects "Report only", end the command here with the report summary.

### Phase 4: Propose Fixes

If user wants to proceed and there are fixable issues:

1. For each file with issues, show proposed changes:
   ```
   ### [filename.md]

   **Issue**: <description>

   **Current:**
   ```yaml
   <current frontmatter>
   ```

   **Proposed:**
   ```yaml
   <fixed frontmatter>
   ```
   ```

2. Present ALL proposed changes before any modifications

3. Ask user using AskUserQuestion:
   - "Would you like to apply these fixes?"
   - Options: "Let me review first", "Yes, apply all", "No, skip fixes"

4. If user wants to review, discuss and adjust specific fixes as requested

### Phase 5: Await User Direction

After presenting all proposed fixes:

1. End with: "Review the proposed fixes above. Let me know if you'd like any changes, or tell me when you're ready to apply them."
2. Wait for user response - do NOT use AskUserQuestion here
3. When user is ready, apply fixes one-by-one using the Edit tool
4. After all fixes applied, re-run validation to confirm resolution
5. Display final summary

## Important Notes

- Never modify files without explicit user approval
- Always show the complete proposed changes before applying
- If a fix is ambiguous, ask the user for clarification
- Preserve all content after the frontmatter closing `---`
- Use the script pipeline for efficiency - do NOT read full file contents
