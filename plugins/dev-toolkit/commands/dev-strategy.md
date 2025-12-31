---
name: dev-strategy
description: Select development strategy for current session (approved, rapid, or parallel)
allowed-tools:
  - Read
  - Write
---

# Development Strategy Selection

This command helps establish which development approach will be used for the current session. Different strategies work better for different types of tasks.

## Quick Start

**Select your strategy with one of these commands:**

```
/dev-toolkit:dev-strategy approved   # For complex features requiring discussion
/dev-toolkit:dev-strategy rapid      # For straightforward changes
/dev-toolkit:dev-strategy parallel   # For multiple independent tasks
```

---

## Documentation Discovery

Before applying strategies, check for project-specific documentation:

1. **Check project docs first:**
   - `docs/guides/DEVELOPMENT-STRATEGIES.md`
   - `docs/guides/SWARM-WORKFLOW.md`

2. **Fall back to plugin guides:**
   - `${CLAUDE_PLUGIN_ROOT}/guides/DEVELOPMENT-STRATEGIES.md`
   - `${CLAUDE_PLUGIN_ROOT}/guides/SWARM-WORKFLOW.md`

---

## Available Strategies

### 1. Development Approved (Pre-Implementation Discussion)

**Best For:**
- Complex features with multiple implementation approaches
- Architectural decisions affecting multiple components
- Bug fixes requiring user input on approach
- When avoiding rework is high priority

**Pattern:** Propose → Discuss → Approve → Implement

**Time Impact:**
- +5-10 min discussion upfront
- Saves 30-60 min rework later
- Net positive for complex changes

**When to Use:**
- "I see multiple ways to fix this. Which is preferred?"
- "This change affects several components. Should we discuss approach?"
- "I want to validate my understanding before implementing."

---

### 2. Rapid Iteration (Quick Changes)

**Best For:**
- Small bug fixes (<30 min)
- Documentation updates
- Obvious, non-ambiguous changes
- Established patterns being applied
- Trivial improvements

**Pattern:** Change → Test → Commit

**Time Impact:**
- Minimal overhead
- Fast execution
- No discussion delay

**When to Use:**
- "This is obvious, no discussion needed."
- "Following established pattern from similar fix."
- "Quick documentation improvement."

---

### 3. Parallel Execution (Multiple Independent Tasks)

**Best For:**
- 4+ independent tasks with similar scope
- No file conflicts between tasks
- No logical dependencies
- Well-defined, clear requirements

**Pattern:** Plan All → Launch All → Monitor → Validate

**Time Impact:**
- Small setup overhead
- 50-87% time savings vs sequential
- Batch commit at end

**When to Use:**
- "I have several similar, independent tasks."
- "These tasks don't depend on each other."
- "I can work on multiple things simultaneously."

---

## Strategy Selection Examples

### Example 1: Complex Bug Fix → Development Approved

```
BUG-045: Application crashes when loading projects with malformed JSON

Analysis shows 3 possible approaches:
1. Add try-catch with error recovery
2. Pre-validate JSON before parsing
3. Use schema validation library

Developer is unsure which approach user prefers.
```

**Command:**
```
/dev-toolkit:dev-strategy approved
```

---

### Example 2: Documentation Update → Rapid Iteration

```
Found several typos in CLAUDE.md and README.md
Need to update outdated version numbers
Want to clarify installation instructions
```

**Command:**
```
/dev-toolkit:dev-strategy rapid
```

---

### Example 3: Component Creation Sprint → Parallel Execution

```
Create 6 configuration display components

All components are similar structure:
- AgentCard.vue
- CommandCard.vue
- HookCard.vue
- MCPCard.vue
- LoadingState.vue
- EmptyState.vue

All components are independent (new files, no conflicts)
```

**Command:**
```
/dev-toolkit:dev-strategy parallel
```

---

## Strategy Selection Guidance

### Decision Tree

```
START: What kind of work are you doing?

┌─ Simple, obvious changes?
│  └─ /dev-toolkit:dev-strategy rapid

┌─ Complex features or architectural decisions?
│  └─ /dev-toolkit:dev-strategy approved

┌─ 4+ independent tasks of similar scope?
│  └─ /dev-toolkit:dev-strategy parallel

└─ Mixed work or uncertain?
   └─ /dev-toolkit:dev-strategy approved (safer default)
```

### Common Scenarios

| Scenario | Recommended Strategy |
|----------|---------------------|
| Bug sprint (multiple simple bugs) | Rapid Iteration |
| Bug sprint (complex root cause analysis) | Development Approved |
| New feature (unclear requirements) | Development Approved |
| New feature (clear spec, multiple components) | Parallel Execution |
| Refactoring (isolated change) | Rapid Iteration |
| Refactoring (widespread impact) | Development Approved |
| Documentation (typos, updates) | Rapid Iteration |
| Documentation (structural changes) | Development Approved |
| Component library (multiple similar components) | Parallel Execution |

---

## How Agents Use Strategy Information

### Developer Agents

**Development Approved Mode:**
- Prepare proposals before implementing
- Wait for user approval signal
- Implement with confidence after approval
- Reference approval in commits

**Rapid Iteration Mode:**
- Implement straightforward changes immediately
- Test thoroughly
- Commit without waiting for approval

**Parallel Execution Mode:**
- Accept parallel task assignments
- Work independently without coordination
- Return results for batch commit

---

## Tips for Maximum Efficiency

### Tip 1: Start with Strategy Selection

**At beginning of every session:**
```
User: "I want to fix bugs today"
Command: /dev-toolkit:dev-strategy approved  # (if bugs are complex)
or
Command: /dev-toolkit:dev-strategy rapid     # (if bugs are simple)
```

### Tip 2: Switch Strategies as Work Changes

**During session:**
```
# Started with simple changes (rapid)
# Encountered complex decision
/dev-toolkit:dev-strategy approved

# Finished complex work
# Back to routine changes
/dev-toolkit:dev-strategy rapid
```

### Tip 3: When in Doubt, Use Development Approved

**If uncertain about strategy choice:**
```
/dev-toolkit:dev-strategy approved
```

**Rationale:** Safer default, prevents rework, enables user input

---

## Command Output

When you run this command, you'll see:

```
Development Strategy Selected: [STRATEGY NAME]

Strategy Active: All subsequent work will use [STRATEGY NAME] pattern.

Pattern:
[STRATEGY PATTERN DESCRIPTION]

Agent Behavior:
[HOW AGENTS WILL BEHAVE]

To Change Strategy: Run /dev-toolkit:dev-strategy [approved|rapid|parallel]
```
