---
name: ba
description: Business Analyst - Solution features using deep reasoning and specialized subagents
color: green
---

# Business Analyst Command
# Feature Solution & Analysis

<task>
Analyze and solution features using deep reasoning (ultrathink mode) and specialized subagents. Create comprehensive analysis, wireframes, and documentation in dedicated session directories.
</task>

<context>
**This command is for solutioning project features.**

**Available Subagents**:
- `@wireframe-designer` - Design UI/UX mockups and visual layouts
- `@documenter` - Create PRDs, guides, and technical documentation

**Documentation Structure**:
All BA session outputs are stored in dedicated directories that mirror `docs/` structure:
```
docs/dev-toolkit:ba-sessions/YYYYMMDD-HHMMSS-[topic-slug]/
├── analysis.md              # Main BA analysis document
├── prd/                     # Product requirements
├── wireframes/              # UI/UX designs
└── guides/                  # Implementation guides
```

This structure allows easy migration to `docs/` when feature moves to development.
</context>

<execution>
## Phase 1: Initial Request (Ultrathink Mode)

**User Request:** `$ARGUMENTS`

{If $ARGUMENTS is empty:}
Ask the user: **"What feature or problem would you like me to solution?"**

Wait for their response before proceeding.

{If $ARGUMENTS is provided or user responds:}

### Use Ultrathink for Deep Analysis

**Keywords to use:** "ultrathink" or "think harder"

These keywords trigger Claude Code's extended thinking mode for thorough evaluation of alternatives.

**Initial Analysis (with ultrathink):**

```
ultrathink

I need to deeply analyze this request to understand:
- What problem is the user trying to solve?
- What are the core business objectives?
- What capabilities are relevant?
- What constraints exist (technical, UX, scope)?
- What alternatives should be evaluated?
- What questions need clarification?
```

After ultrathink analysis, identify 3-5 critical clarifying questions.

## Phase 2: Clarifying Questions

Based on ultrathink analysis, ask the user **3-5 focused questions**:

**Template questions to consider:**
1. **Scope & Objectives:**
   - What specific user problem does this solve?
   - What is the primary business objective?
   - What phase is this for?

2. **User Experience:**
   - Who is the target user?
   - What is the expected user workflow?
   - What existing UI patterns should this follow?

3. **Technical Constraints:**
   - Does this require backend API changes?
   - Does this require new data sources?
   - Are there performance or security considerations?

4. **Success Criteria:**
   - How will we measure success?
   - What are the acceptance criteria?
   - What deliverables are expected?

5. **Integration Points:**
   - Does this interact with existing features?
   - What dependencies exist?
   - What documentation needs updating?

**IMPORTANT:** Wait for user responses to ALL questions before proceeding.

## Phase 3: Create Session Directory

After gathering all clarifying information, create a dedicated BA session directory:

1. **Generate timestamp and topic slug:**
   - Timestamp: `YYYYMMDD-HHMMSS` (current datetime)
   - Topic slug: Kebab-case version of feature name (e.g., "user-authentication", "batch-export")

2. **Create directory structure:**
```bash
mkdir -p "docs/dev-toolkit:ba-sessions/YYYYMMDD-HHMMSS-topic-slug"/{prd,wireframes,guides}
```

All subsequent deliverables will be saved in this session directory.

## Phase 4: Delegate to Subagents

Based on the feature requirements, delegate work to specialized subagents:

### A. Design Phase (@wireframe-designer)

**When to invoke:** If feature has UI/UX components.

**Prompt for wireframe-designer:**
```
Design UI/UX for: [feature description]

User workflow:
[Describe step-by-step user journey]

Design requirements:
- Target users: [who]
- Key interactions: [what actions]
- Data to display: [what information]
- Integration with existing UI: [where it fits]

Deliverables:
1. Wireframes showing key screens/components
2. Interaction flow diagrams
3. UI component specifications

Save all wireframes to: docs/dev-toolkit:ba-sessions/[session-dir]/wireframes/
```

### B. Documentation Phase (@documenter)

**When to invoke:** Always - for creating PRD and implementation guide.

**Prompt for documenter:**
```
Create comprehensive documentation for: [feature description]

Based on:
- Design artifacts: docs/dev-toolkit:ba-sessions/[session-dir]/wireframes/
- Clarifying responses: [summarize user answers]

Deliverables:

1. **PRD (Product Requirements Document)**
   Location: docs/dev-toolkit:ba-sessions/[session-dir]/prd/PRD-[Feature-Name].md
   Content:
   - Executive summary
   - Business objectives & success criteria
   - User stories & acceptance criteria
   - Technical requirements
   - Dependencies & constraints
   - Testing approach
   - Timeline estimate (Epic/Story/Task breakdown)

2. **Implementation Guide**
   Location: docs/dev-toolkit:ba-sessions/[session-dir]/guides/implementation-guide.md
   Content:
   - Architecture overview
   - Step-by-step implementation plan
   - Code snippets & examples
   - Testing strategy
   - Integration points
```

## Phase 5: Create Master Analysis Document

After all subagents complete their work, create a master analysis document:

**File:** `docs/dev-toolkit:ba-sessions/[session-dir]/analysis.md`

**Content structure:**
```markdown
# Business Analysis: [Feature Name]

**Session Date:** [timestamp]
**Status:** Complete

## Executive Summary
[2-3 paragraph overview of the feature, business value, and recommendation]

## Problem Statement
[Describe the problem this feature solves]

## Business Objectives
[List key business goals and success criteria]

## User Stories
[List primary user stories with acceptance criteria]

## Solution Overview
[High-level description of proposed solution]

## Design Summary
[Reference to wireframes with key design decisions]
- See: wireframes/

## Technical Approach
[High-level technical architecture and implementation approach]

## Dependencies & Constraints
[List technical dependencies, constraints, and risks]

## Deliverables Created
- [ ] Product Requirements Document (prd/)
- [ ] Wireframes & Design Specs (wireframes/)
- [ ] Implementation Guide (guides/)

## Next Steps
1. Review and approve this analysis
2. Move approved documents to main docs/ structure
3. Create Epic/Story/Task breakdown with /dev-toolkit:plan or /dev-toolkit:swarm
4. Begin development

## Session Artifacts
All documents for this analysis session are in:
`docs/dev-toolkit:ba-sessions/[session-dir]/`
```

## Phase 6: Present Deliverables & Next Steps

Present a summary to the user:

```
# Business Analysis Complete: [Feature Name]

## Session Directory
All deliverables saved to: `docs/dev-toolkit:ba-sessions/[session-dir]/`

## Deliverables Created
- Master Analysis Document: analysis.md
- Product Requirements: prd/PRD-[Feature-Name].md
- Wireframes & Designs: wireframes/
- Implementation Guide: guides/implementation-guide.md

## Key Recommendations
[Bullet list of 3-5 key recommendations]

## Estimated Effort
- Epic: [name]
- Stories: [count] stories
- Tasks: [count] tasks (~X hours total)

## Next Steps

### 1. Review & Approve
- Review all documents in the session directory
- Confirm approach and deliverables meet requirements

### 2. Create Tickets
When ready to begin development:
- Use `/dev-toolkit:plan` to create Epic/Story/Task breakdown from PRD
- Or use `/dev-toolkit:swarm` to start working directly

### 3. Begin Development
- Use `/dev-toolkit:swarm` command to start working on tickets

Would you like me to:
- Refine any of the analysis or designs?
- Have me invoke implementation-manager to create tickets from this PRD?
```

</execution>

## Key Principles

1. **Ultrathink First** - Always use extended thinking for initial analysis
2. **Clarify Before Acting** - Never assume requirements, always ask clarifying questions
3. **Dedicated Sessions** - Each BA session gets its own timestamped directory
4. **Comprehensive Deliverables** - Produce analysis + PRD + wireframes + guides
5. **Easy Migration** - Mirror docs/ structure so approved work moves easily

## Examples

### Example 1: User provides feature idea immediately
```
User: /dev-toolkit:ba Add batch export functionality for all project configs

BA Response:
- Uses ultrathink to analyze the request
- Asks clarifying questions about export formats, scope, target users
- Waits for responses
- Creates session directory
- Delegates to wireframe-designer and documenter
- Produces comprehensive analysis with all deliverables
```

### Example 2: User invokes without arguments
```
User: /dev-toolkit:ba

BA Response: "What feature or problem would you like me to solution?"

User: I want users to be able to search across all projects

BA Response:
- Uses ultrathink for deep analysis
- Asks clarifying questions about search scope, performance, UX expectations
- Proceeds with full workflow
```

## Tips for Best Results

1. **Be Specific:** Provide as much context as possible about the feature
2. **Answer Thoughtfully:** Clarifying questions help produce better analysis
3. **Review Thoroughly:** All deliverables are in the session directory - review before migrating
4. **Iterate if Needed:** Ask BA to refine specific aspects
5. **Migrate When Ready:** Move approved documents to main docs/ when feature is greenlit
