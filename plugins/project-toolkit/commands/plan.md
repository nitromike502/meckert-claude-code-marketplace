---
name: plan
description: Break down features into Epic/Story/Task tickets using implementation-manager
requires_subagent: true
---

# Project Planning & Ticket Creation
# Creates Epic/Story/Task breakdown for project development

<task>
Launch the implementation-manager agent to assess current project state and create appropriate Epic/Story/Task breakdown based on what's next in the development workflow.
</task>

<context>
**Development Method**: SWARM (Simultaneous Work And Resource Management)

**Documentation Discovery:**
Before planning, check for project-specific documentation:

1. **Check project docs first:**
   - `docs/guides/SWARM-WORKFLOW.md`
   - `docs/guides/DEVELOPMENT-STRATEGIES.md`
   - `CLAUDE.md` or `README.md` for project context
   - PRDs in `docs/prd/`

2. **Fall back to plugin guides:**
   - `${CLAUDE_PLUGIN_ROOT}/guides/SWARM-WORKFLOW.md`
   - `${CLAUDE_PLUGIN_ROOT}/guides/DEVELOPMENT-STRATEGIES.md`
</context>

<execution>
Invoke the `implementation-manager` agent to:

## Step 1: Assess Current Project State
1. Read project documentation to understand structure and success criteria
2. Check current directory structure
3. Review git status and recent commits to understand completed work
4. Check for existing TodoWrite tickets/tasks
5. Determine current phase based on success criteria

## Step 2: Identify Next Development Work
Based on current state, determine which work needs tickets:
- If design not done: Create tickets for design phase
- If backend not started: Create tickets from requirements
- If frontend not started: Create tickets from requirements
- If integration needed: Create integration and testing tickets

## Step 3: Create Appropriate Ticket Breakdown (ENFORCE SMALL FEATURE SIZING)
Use TodoWrite tool to create Epic/Story/Task breakdown for identified next work:
- **Epics**: Major feature areas (e.g., "Backend API Development", "Frontend UI Development")
- **Stories**: User-facing features within each epic (e.g., "Project List View", "Config Viewer")
- **Tasks**: Technical implementation steps for each story

**CRITICAL TASK SIZING REQUIREMENTS:**
- **ALL tasks MUST be completable in 30-60 minutes maximum**
- **Each task must be independently testable** (can run test immediately after)
- **Each task must be independently committable** (enables 15-30 min commit cadence)
- **Break down large features** into smallest possible units
- **Examples of GOOD task sizing:**
  - "Create /api/projects endpoint" (30 min)
  - "Add error handling middleware" (30 min)
  - "Create ProjectList component" (45 min)
  - "Add sidebar scroll behavior" (30 min)
- **Examples of BAD task sizing:**
  - "Implement complete backend API" (too large - 3+ hours)
  - "Build entire SPA" (too large - 3+ hours)
  - "Add all frontend components" (too large - multiple hours)

Also include:
- Appropriate specialized agent assignments based on team structure
- Dependencies between tasks (minimize to enable parallel work)
- Acceptance criteria for each story
- Phase gates and review checkpoints
- Testing checkpoints after each task

## Step 4: Output Plan Summary
Provide clear summary including:
- What phase/work area these tickets address
- Which requirements were used for planning
- High-level overview of epics and stories created
- **Confirmation that all tasks are 30-60 minutes max**
- **Number of tasks created and their sizing distribution**
- Recommendation to run `/swarm` to begin execution

## Step 5: Validate Task Sizing
Before completing, perform final validation:
- Count tasks by estimated duration (30 min, 45 min, 60 min)
- Identify any tasks that might be >60 minutes
- Break down or flag any oversized tasks
- Ensure task descriptions clearly indicate they are small, focused units

The implementation-manager will intelligently generate properly-sized tickets for whatever work comes next, ensuring continuity in the development workflow while maintaining the commit-friendly task sizing that prevents the "big bang" development pattern.
</execution>

Additional Instructions: $ARGUMENTS
