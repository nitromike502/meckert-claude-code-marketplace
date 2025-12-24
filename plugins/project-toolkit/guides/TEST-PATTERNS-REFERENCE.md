# Frontend Test Patterns Reference Guide

**Date:** 2025-10-20
**Purpose:** Quick reference for established testing patterns used across all Playwright tests
**Audience:** Developers writing or maintaining frontend tests

---

## Quick Navigation

- [Mock Data Pattern](#mock-data-pattern) - How to use centralized mocks
- [Route Handler Pattern](#route-handler-pattern) - How to mock API endpoints
- [Selector Pattern](#selector-pattern) - How to write robust selectors
- [Error Handling Pattern](#error-handling-pattern) - How to test error scenarios
- [Responsive Testing Pattern](#responsive-testing-pattern) - How to test multiple viewports
- [Common Issues & Solutions](#common-issues--solutions)

---

## Mock Data Pattern

### When to Use
Every test that needs data (projects, configurations, etc.) should use the centralized mock data system.

### Setup
```javascript
const { setupMocks } = require('../../fixtures/mock-setup.js');

test('my test', async ({ page }) => {
  // 1. Setup centralized mocks FIRST
  await setupMocks(page);

  // 2. Navigate to page (now mock data is available)
  await page.goto('/projects/projectid');

  // 3. Assert data appears
  await expect(page.locator('[data-testid="project-name"]')).toContainText('Project Name');
});
```

### Adding New Mock Projects

**Step 1:** Add to `tests/fixtures/mock-data.js` - mockProjects array
```javascript
mockProjects.push({
  id: 'myproject',
  name: 'My Project',
  path: '/home/user/my-project',
  stats: {
    agents: 2,
    commands: 3,
    hooks: 1,
    mcp: 1
  }
});
```

**Step 2:** Add to `tests/fixtures/mock-data.js` - mockProjectDetails object
```javascript
mockProjectDetails.myproject = {
  agents: [
    { id: '1', name: 'Agent 1', type: 'subagent' }
  ],
  commands: [
    { id: '1', name: 'Command 1', type: 'slash-command' }
  ],
  hooks: [
    { id: '1', name: 'Hook 1', type: 'pre-commit' }
  ],
  mcp: [
    { id: '1', name: 'MCP Server 1', type: 'mcp' }
  ]
};
```

**Step 3:** Use in test
```javascript
test('my test with custom project', async ({ page }) => {
  await setupMocks(page);
  await page.goto('/projects/myproject');  // Now this project exists
});
```

### Key Rules
- ✅ **DO** add projects to BOTH mockProjects and mockProjectDetails
- ✅ **DO** call setupMocks() before navigation
- ❌ **DON'T** create inline route handlers for basic data
- ❌ **DON'T** forget mockProjectDetails (only mockProjects won't work)

---

## Route Handler Pattern

### When to Use
When you need to mock API endpoints with specific responses (errors, edge cases, delays).

### Basic Pattern
```javascript
test('error handling', async ({ page }) => {
  // Setup specific error routes BEFORE setupMocks()
  await page.route('**/api/projects', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({
        success: false,
        error: 'Internal Server Error'
      })
    });
  });

  // Then setup generic mocks
  await setupMocks(page);

  // Navigate and test error state
  await page.goto('/');
  await expect(page.locator('.error-state')).toBeVisible();
});
```

### URL Inspection Pattern (for edge cases)
```javascript
test('empty project id handling', async ({ page }) => {
  await page.route('**/api/projects/*/agents', (route) => {
    const url = route.request().url();

    // Check if project ID is empty
    if (url.includes('/projects//') || url.match(/\/projects\/\s*\//)) {
      route.fulfill({ status: 404 });
    } else {
      route.continue();  // Use default mock
    }
  });

  await setupMocks(page);
  await page.goto('/projects/');  // Empty project ID
  await expect(page.locator('.error-state')).toBeVisible();
});
```

### Common Response Structures

**Success Response:**
```javascript
route.fulfill({
  status: 200,
  contentType: 'application/json',
  body: JSON.stringify({
    success: true,
    projects: [{ /* project data */ }]
  })
});
```

**Error Response:**
```javascript
route.fulfill({
  status: 500,
  contentType: 'application/json',
  body: JSON.stringify({
    success: false,
    error: 'Internal Server Error'
  })
});
```

**Network Error (abort):**
```javascript
route.abort('failed');
```

### Key Rules
- ✅ **DO** register specific routes BEFORE setupMocks()
- ✅ **DO** call route.continue() for unhandled routes
- ✅ **DO** use consistent response structure (success field)
- ❌ **DON'T** mock generic routes after setupMocks() (they won't override)

---

## Selector Pattern

### Strict Mode Requirement
Playwright strict mode requires selectors to resolve to **exactly one element**.

### Good Selectors (1 element)
```javascript
// Specific element
page.locator('.dashboard-header h2')

// Data attribute (best practice)
page.locator('[data-testid="project-card"]')

// Specific class combination
page.locator('.card.primary')

// Role with constraint
page.locator('button:has-text("Delete")')
```

### Bad Selectors (multiple elements)
```javascript
// ❌ Resolves to multiple elements
page.locator('.dashboard-header h2, h1, .app-title')

// ❌ Too generic
page.locator('h2')

// ❌ Matches many
page.locator('[class*="card"]')
```

### How to Debug Selectors
```javascript
// Count how many elements match
const count = await page.locator('.potential-selector').count();
console.log(`Selector matched ${count} elements`);

// If count > 1, narrow the selector
// Instead of: page.locator('.dashboard-header h2, h1')
// Use: page.locator('.dashboard-header h2')
```

### Best Practices
```javascript
// 1. Use data-testid when possible (most stable)
page.locator('[data-testid="project-title"]')

// 2. Use specific class combinations
page.locator('.dashboard-header h2.title')

// 3. Use role selectors
page.locator('button[aria-label="Open menu"]')

// 4. Use :first to narrow down
page.locator('button').first()

// 5. Use parent context
const card = page.locator('.project-card').first();
const title = card.locator('.title');
```

### Key Rules
- ✅ **DO** test selector specificity: `await locator.count()` should be 1
- ✅ **DO** use data-testid attributes
- ❌ **DON'T** use comma-separated selectors (they match multiple elements)
- ❌ **DON'T** use overly generic selectors

---

## Error Handling Pattern

### Testing Error States
```javascript
test('http 500 error', async ({ page }) => {
  // Route error response first
  await page.route('**/api/projects/*/agents', (route) => {
    route.fulfill({ status: 500 });
  });

  await setupMocks(page);
  await page.goto('/projects/testproject');

  // Verify error UI appears
  await expect(page.locator('.error-state')).toBeVisible();
  await expect(page.locator('.error-message')).toContainText('error');
});
```

### Testing Network Failures
```javascript
test('network abort', async ({ page }) => {
  // Abort the request
  await page.route('**/api/projects/*/commands', (route) => {
    route.abort('failed');
  });

  await setupMocks(page);
  await page.goto('/projects/testproject');

  // Should show error or retry
  await expect(page.locator('.error-state, .retry-button')).toBeVisible();
});
```

### Timeout Configuration
Per user preference, set timeouts as follows:
- **Request timeout:** 5 seconds (application-level setting)
- **Test wait timeout:** Based on test needs (usually 10 seconds)

```javascript
test('with 5 second request timeout', async ({ page }) => {
  await setupMocks(page);

  // Application uses 5-second request timeout internally
  await page.goto('/projects/testproject');

  // Wait up to 10 seconds for test assertions
  await expect(page.locator('.data')).toBeVisible({ timeout: 10000 });
});
```

---

## Responsive Testing Pattern

### Multiple Viewport Sizes
```javascript
test.describe('Responsive Dashboard', () => {
  const viewports = [
    { name: 'Mobile', width: 375, height: 667 },
    { name: 'Tablet', width: 768, height: 1024 },
    { name: 'Desktop', width: 1920, height: 1080 }
  ];

  viewports.forEach(viewport => {
    test(`dashboard at ${viewport.name} (${viewport.width}x${viewport.height})`, async ({ page }) => {
      // Set viewport
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height
      });

      // Setup and navigate
      await setupMocks(page);
      await page.goto('/');

      // Assert layout adapts
      const cards = page.locator('.project-card');
      await expect(cards).toHaveCount(1);  // Example assertion

      // Check responsive classes or styles
      const container = page.locator('.dashboard');
      const classes = await container.getAttribute('class');
      console.log(`Applied classes: ${classes}`);
    });
  });
});
```

### Standard Viewports
- **Mobile:** 375 × 667 (iPhone size)
- **Tablet:** 768 × 1024 (iPad size)
- **Desktop:** 1920 × 1080 (Desktop)

### Multi-browser Testing
```javascript
test('works on all browsers', async ({ page, browserName }) => {
  console.log(`Running on ${browserName}`);

  await setupMocks(page);
  await page.goto('/');

  // Same assertions run on Chromium, Firefox, WebKit
  await expect(page.locator('.dashboard')).toBeVisible();
});
```

---

## Common Issues & Solutions

### Issue 1: Strict Mode - Selector Resolved to Multiple Elements

**Error Message:**
```
Locator resolved to 2 elements.
Only one element is expected.
```

**Solution:**
```javascript
// Before (BAD)
page.locator('.header h2, h1, .title')

// After (GOOD)
page.locator('.header h2')
```

**How to Debug:**
```javascript
const selector = '.header h2, h1, .title';
const count = await page.locator(selector).count();
console.log(`"${selector}" matches ${count} elements`);
// Output: "(.header h2, h1, .title) matches 2 elements"

// Solution: Use more specific selector
const better = '.header h2';
const betterCount = await page.locator(better).count();
console.log(`"${better}" matches ${betterCount} elements`);
// Output: "(.header h2) matches 1 element"
```

---

### Issue 2: Test Timeout - Mock Data Missing

**Symptoms:**
- Test runs but hangs
- No errors shown
- Finally times out

**Root Cause:**
```javascript
// Project doesn't exist in mock data
await setupMocks(page);
await page.goto('/projects/unknownproject');  // This project not in mockProjectDetails
await page.waitForSelector('.project-name', { timeout: 10000 });  // Times out
```

**Solution:**
```javascript
// Add project to mock data FIRST
// In tests/fixtures/mock-data.js:
mockProjects.push({
  id: 'unknownproject',
  name: 'Unknown Project',
  path: '/path',
  stats: { agents: 1, commands: 1, hooks: 0, mcp: 0 }
});

mockProjectDetails.unknownproject = {
  agents: [...],
  commands: [...],
  hooks: [...],
  mcp: [...]
};

// Now test works
await setupMocks(page);
await page.goto('/projects/unknownproject');  // Project now exists
await page.waitForSelector('.project-name', { timeout: 10000 });  // Finds it
```

---

### Issue 3: Route Handler Not Working

**Symptoms:**
- Route handler registered but not used
- Test still gets default response

**Root Cause:**
```javascript
// Wrong order: setupMocks() after custom route
await setupMocks(page);  // Registers broad wildcards

await page.route('**/api/projects', (route) => {  // Too specific, won't match
  // This never executes because setupMocks() already caught it
});
```

**Solution:**
```javascript
// Register custom routes BEFORE setupMocks()
await page.route('**/api/projects', (route) => {  // Specific routes first
  route.fulfill({ status: 500 });
});

await setupMocks(page);  // Generic routes second

// Now custom route takes precedence
```

---

### Issue 4: Element Not Found - Phase 1 Selector in Phase 2

**Symptoms:**
```
Error: Locator('selector').locator(expected: visible) timeout 10000ms
waiting for locator('selector').to be visible
```

**Root Cause:**
Phase 1 HTML had different structure than Phase 2 SPA:
```javascript
// Phase 1 (doesn't exist in Phase 2)
page.locator('.project-detail')

// Phase 2 has different component structure
page.locator('.project-detail-container')
```

**Solution:**
Inspect Phase 2 component to find correct selector:
```javascript
// Open DevTools or inspect
// Find actual elements used in Phase 2
page.locator('.dashboard-header')
page.locator('[data-testid="project-detail"]')
```

---

### Issue 5: Conditional Route Handler Not Triggering

**Symptoms:**
- Route handler registered
- Condition never matches
- Wrong response returned

**Example (Wrong):**
```javascript
await page.route('**/api/projects/*/agents', (route) => {
  // Pattern doesn't match empty ID properly
  if (route.request().url().includes('//')) {
    route.fulfill({ status: 404 });
  } else {
    route.continue();
  }
});

// This might not match: /api/projects//agents
```

**Solution (Debug First):**
```javascript
await page.route('**/api/projects/*/agents', (route) => {
  const url = route.request().url();
  console.log(`Intercepted URL: ${url}`);  // Log to see actual URL

  // Check multiple patterns
  if (url.includes('/projects//') || url.match(/\/projects\/\s*\//)) {
    route.fulfill({ status: 404 });
  } else {
    route.continue();
  }
});
```

---

## Testing Checklist

Before submitting a test, verify:

- [ ] Mock data added to both mockProjects AND mockProjectDetails
- [ ] setupMocks() called before navigation
- [ ] Custom route handlers registered BEFORE setupMocks()
- [ ] Selectors test to exactly 1 element (count() === 1)
- [ ] No comma-separated selectors (strict mode violation)
- [ ] Timeouts set appropriately (5s for requests, 10s+ for test waits)
- [ ] Test passes on all 3 browsers
- [ ] Test passes on all viewport sizes (if responsive)
- [ ] Clear test name describing what's being tested
- [ ] Proper error messages for assertions

---

## Quick Reference Commands

```bash
# Run single test file
npm run test:frontend -- tests/frontend/02-project-detail.spec.js

# Run specific test by number
npm run test:frontend -- -g "02.001.005"

# Run with UI mode (watch changes)
npm run test:frontend -- --ui

# Run in debug mode
npm run test:frontend -- --debug

# Update visual baselines (if using)
npm run test:frontend -- --update-snapshots

# Run single browser
npm run test:frontend -- --project chromium
npm run test:frontend -- --project firefox
npm run test:frontend -- --project webkit
```

---

## Resources

- **Main Session Report:** [SESSION-2025-10-20-FINAL.md](./SESSION-2025-10-20-FINAL.md)
- **Visual Tests Analysis:** [VISUAL-REGRESSION-TESTS-STATUS.md](./VISUAL-REGRESSION-TESTS-STATUS.md)
- **Testing Status:** [TESTING-STATUS-2025-10-20.md](../TESTING-STATUS-2025-10-20.md)
- **Playwright Docs:** https://playwright.dev/docs/intro
- **Mock Fixtures Guide:** `tests/MOCK_FIXTURES_GUIDE.md`

---

**Last Updated:** 2025-10-20
**Maintained By:** Frontend Testing Team
