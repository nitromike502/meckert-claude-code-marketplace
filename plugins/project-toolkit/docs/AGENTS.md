# Agents Reference

This plugin provides 13 specialized agents. Each agent is designed for a specific type of work.

---

## Ticket Management

### ticket-manager
Platform-agnostic ticket management specialist. Invoke to fetch, list, search, or update tickets from any ticketing system.

**Good for:**
- Fetching ticket details by ID
- Listing tickets by status (backlog, in-progress, done)
- Searching tickets by keyword
- Updating ticket status
- Organizing ticket files

**Integration methods (in priority order):**
1. MCP Server (preferred)
2. API Scripts (Python/Node.js)
3. File-based tickets (fallback)

**Example:** "Fetch TASK-3.1.2 and show its acceptance criteria"

---

## Development

### frontend-developer
UI development specialist. Invoke when building user interfaces, components, forms, or layouts.

**Good for:**
- Creating new components
- Implementing UI from designs/wireframes
- Form handling and validation
- Responsive layouts
- Component state management

**Example:** "Build a user profile card component with avatar, name, and edit button"

---

### backend-developer
Backend API and service layer specialist. Invoke for server-side implementation, database design, and API development.

**Good for:**
- Designing REST/GraphQL APIs
- Implementing service layer logic
- Database schema design
- Authentication/authorization
- Error handling patterns

**Example:** "Create a user authentication service with login, logout, and session management"

---

### wireframe-designer
UI/UX planning specialist. Invoke when planning layouts before implementation.

**Good for:**
- Creating wireframes
- Layout planning
- User flow design
- Component structure planning

**Example:** "Design the layout for a dashboard with sidebar navigation and content area"

---

## Quality

### code-reviewer
Code quality reviewer. Invoke before commits or when you want a second opinion on code.

**Good for:**
- Pre-commit reviews
- Security checks
- Best practices validation
- Architecture feedback
- Finding potential bugs

**Example:** "Review the authentication controller for security issues and best practices"

---

### test-runner
Test generation specialist. Invoke after implementing features to create comprehensive tests.

**Good for:**
- Unit test generation
- Integration test creation
- Edge case identification
- Test coverage improvement

**Example:** "Generate tests for the UserService covering login, logout, and token validation"

---

### tester-playwright
E2E browser testing specialist. Invoke for end-to-end user flow testing.

**Good for:**
- Browser automation tests
- User flow validation
- Cross-browser testing
- Visual regression testing

**Example:** "Create E2E tests for the user registration and login flow"

---

### tester-integration
Cross-component testing specialist. Invoke when testing how components work together.

**Good for:**
- API integration testing
- Component interaction testing
- Cross-platform validation

**Example:** "Test the integration between the frontend auth form and backend auth API"

---

### test-auditor
Test coverage auditor. Invoke to analyze existing tests and find gaps.

**Good for:**
- Coverage analysis
- Finding untested code paths
- Test quality assessment

**Example:** "Audit the test coverage for the user management module"

---

## Project Management

### implementation-manager
Work planning specialist. Invoke to break down features into actionable tickets.

**Good for:**
- Feature decomposition
- Epic/Story/Task creation
- Work estimation
- Priority recommendations

**Example:** "Break down 'User Profile Management' into stories and tasks"

---

### subagent-orchestrator
Multi-agent coordinator. Invoke for complex workflows requiring multiple agents.

**Good for:**
- Coordinating multi-step workflows
- Managing agent dependencies
- Parallel execution planning

**Example:** "Coordinate full-stack implementation of the authentication feature"

---

## Documentation & Git

### documenter
Documentation generator. Invoke to create or update documentation.

**Good for:**
- API documentation
- README files
- User guides
- Code comments/JSDoc

**Example:** "Create API documentation for the authentication endpoints"

---

### git-expert
Git operations coordinator. Invoke for commits, PRs, and branch management.

**Good for:**
- Commit message generation
- PR descriptions
- Branch strategy
- Merge coordination

**Example:** "Create a commit message for the authentication implementation"

---

## When to Use Which Agent

| Task | Agent |
|------|-------|
| Fetch/manage tickets | ticket-manager |
| Build a component | frontend-developer |
| Create an API endpoint | backend-developer |
| Write tests | test-runner |
| Review code before commit | code-reviewer |
| Plan a feature | implementation-manager |
| Coordinate multiple agents | subagent-orchestrator |
| Create documentation | documenter |
| Commit changes | git-expert |
| Plan UI layout | wireframe-designer |
| E2E browser tests | tester-playwright |
| Test integrations | tester-integration |
| Audit test coverage | test-auditor |
