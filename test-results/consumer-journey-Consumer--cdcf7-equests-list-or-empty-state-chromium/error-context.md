# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consumer-journey.spec.ts >> Consumer — Authenticated Dashboard Pages >> /my-requests — shows requests list or empty state
- Location: tests/e2e/consumer-journey.spec.ts:479:3

# Error details

```
Test timeout of 45000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 45000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /sign in/i })
    - locator resolved to <button type="submit" class="w-full py-3 bg-[#2563EB] text-white font-bold rounded-xl shadow-[0_8px_24px_rgba(37,99,235,0.3)] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50">Sign in →</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="cm__texts">…</div> from <div id="cc-main" data-nosnippet="">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <p id="cm__desc" class="cm__desc">We use cookies primarily for analytics to enhance…</p> from <div id="cc-main" data-nosnippet="">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    86 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <p id="cm__desc" class="cm__desc">We use cookies primarily for analytics to enhance…</p> from <div id="cc-main" data-nosnippet="">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]:
            - img "The Helper" [ref=e9]
            - generic [ref=e10]: The Helper
          - generic [ref=e11]:
            - heading "Your home. Handled right." [level=1] [ref=e12]:
              - text: Your home.
              - text: Handled right.
            - paragraph [ref=e13]: Trusted local pros, real rewards, one platform.
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: ✓
            - generic [ref=e17]:
              - paragraph [ref=e18]: Verified pros
              - paragraph [ref=e19]: Every provider is background-checked and insured
          - generic [ref=e20]:
            - generic [ref=e21]: ✓
            - generic [ref=e22]:
              - paragraph [ref=e23]: Earn rewards
              - paragraph [ref=e24]: Get points for every completed service
          - generic [ref=e25]:
            - generic [ref=e26]: ✓
            - generic [ref=e27]:
              - paragraph [ref=e28]: GTA coverage
              - paragraph [ref=e29]: Milton, Oakville, Burlington and surrounding areas
      - generic [ref=e31]:
        - generic [ref=e32]:
          - generic [ref=e33]:
            - img "The Helper" [ref=e34]
            - generic [ref=e35]: The Helper
          - heading "Sign in to The Helper" [level=2] [ref=e36]
          - paragraph [ref=e37]: Enter your email and we'll send a 6-digit code.
        - generic [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: Email address
            - textbox "you@example.com" [ref=e41]: consumer@thehelper.ca
          - generic [ref=e42]:
            - generic [ref=e43]: Password
            - textbox "••••••••" [ref=e44]: HelperTest123
          - button "Sign in →" [ref=e45]
          - paragraph [ref=e46]:
            - button "Use email code instead" [ref=e47]
        - paragraph [ref=e49]:
          - text: Don't have an account?
          - link "Create one — it's free" [ref=e50] [cursor=pointer]:
            - /url: /signup
    - region "Notifications (F8)":
      - list
  - img
  - dialog "We use cookies" [ref=e51]:
    - generic [ref=e52]:
      - generic [ref=e53]:
        - heading "We use cookies" [level=2] [ref=e54]
        - paragraph [ref=e55]: We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookie policy.
      - generic [ref=e57]:
        - button "Accept all" [ref=e58] [cursor=pointer]
        - button "Reject all" [ref=e59] [cursor=pointer]
    - generic [ref=e62]:
      - link "Privacy Policy" [ref=e63] [cursor=pointer]:
        - /url: /privacy
      - link "Terms and Conditions" [ref=e64] [cursor=pointer]:
        - /url: /terms
```

# Test source

```ts
  360 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 }).catch(() => {});
  361 |   }
  362 | 
  363 |   test('get-quotes wizard loads — Step 1 category selection', async ({ page }) => {
  364 |     await loginConsumer(page);
  365 |     await dismissCookieConsent(page);
  366 | 
  367 |     await page.goto('/get-quotes');
  368 |     await waitForPageReady(page);
  369 | 
  370 |     // Should show category/service selection
  371 |     await expect(
  372 |       page.locator('h1, h2').filter({ hasText: /quote|service|category/i }).first()
  373 |     ).toBeVisible({ timeout: 10000 });
  374 |   });
  375 | 
  376 |   test('get-quotes wizard — user can select a service category', async ({ page }) => {
  377 |     await loginConsumer(page);
  378 |     await page.goto('/get-quotes');
  379 |     await waitForPageReady(page);
  380 | 
  381 |     // Click first visible category card
  382 |     const card = page.locator('[class*="card"], button[class*="rounded"]').first();
  383 |     if (await card.isVisible({ timeout: 5000 }).catch(() => false)) {
  384 |       await card.click();
  385 | 
  386 |       // Should advance — look for step indicator or next input
  387 |       await expect(
  388 |         page.locator('textarea, input, [class*="step"]').first()
  389 |       ).toBeVisible({ timeout: 5000 });
  390 |     }
  391 |   });
  392 | 
  393 |   test('get-quotes wizard — multi-step form navigates', async ({ page }) => {
  394 |     await loginConsumer(page);
  395 |     await page.goto('/get-quotes');
  396 |     await waitForPageReady(page);
  397 | 
  398 |     // Step through if categories are visible
  399 |     const category = page.locator('button, [class*="card"]').filter({ hasText: /handyman|plumbing|smart.home/i }).first();
  400 |     if (await category.isVisible({ timeout: 5000 }).catch(() => false)) {
  401 |       await category.click();
  402 |       await page.waitForTimeout(500);
  403 | 
  404 |       // Description field should appear
  405 |       const textarea = page.locator('textarea').first();
  406 |       if (await textarea.isVisible({ timeout: 5000 })) {
  407 |         await textarea.fill('Need plumbing repair — leaking pipe under kitchen sink.');
  408 |       }
  409 | 
  410 |       // Next button
  411 |       const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
  412 |       if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  413 |         await nextBtn.click();
  414 |         await expect(page.locator('body')).toBeVisible();
  415 |       }
  416 |     }
  417 |   });
  418 | 
  419 |   test('submitting a service request shows confirmation', async ({ page }) => {
  420 |     await loginConsumer(page);
  421 |     await page.goto('/get-quotes');
  422 |     await waitForPageReady(page);
  423 | 
  424 |     // Try to go as far as possible through the wizard
  425 |     const category = page.locator('button, [class*="card"]').first();
  426 |     if (await category.isVisible({ timeout: 5000 }).catch(() => false)) {
  427 |       await category.click();
  428 |       await page.waitForTimeout(500);
  429 | 
  430 |       const textarea = page.locator('textarea').first();
  431 |       if (await textarea.isVisible({ timeout: 3000 })) {
  432 |         await textarea.fill('Test service request from E2E test.');
  433 |       }
  434 | 
  435 |       const nextBtn = page.getByRole('button', { name: /next|continue|submit|request/i }).first();
  436 |       if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  437 |         await nextBtn.click();
  438 |         // Should show confirmation or proceed to next step
  439 |         await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  440 |       }
  441 |     }
  442 |   });
  443 | });
  444 | 
  445 | // ---------------------------------------------------------------------------
  446 | // Consumer Dashboard — post-onboarding authenticated pages
  447 | // ---------------------------------------------------------------------------
  448 | 
  449 | test.describe('Consumer — Authenticated Dashboard Pages', () => {
  450 |   const CONSUMER_EMAIL = process.env.CONSUMER_EMAIL ?? 'consumer@thehelper.ca';
  451 |   const CONSUMER_PASSWORD = process.env.CONSUMER_PASSWORD ?? 'HelperTest123';
  452 | 
  453 |   async function login(page: Page): Promise<void> {
  454 |     await page.goto('/login');
  455 |     await dismissCookieConsent(page);
  456 |     const pwBtn = page.getByRole('button', { name: /sign in with password/i });
  457 |     if (await pwBtn.isVisible({ timeout: 3000 }).catch(() => false)) await pwBtn.click();
  458 |     await page.locator('input[type="email"]').fill(CONSUMER_EMAIL);
  459 |     await page.locator('input[type="password"]').fill(CONSUMER_PASSWORD);
> 460 |     await page.getByRole('button', { name: /sign in/i }).click();
      |                                                          ^ Error: locator.click: Test timeout of 45000ms exceeded.
  461 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 }).catch(() => {});
  462 |   }
  463 | 
  464 |   test.beforeEach(async ({ page }) => {
  465 |     await login(page);
  466 |     await dismissCookieConsent(page);
  467 |   });
  468 | 
  469 |   test('/dashboard — shows user dashboard', async ({ page }) => {
  470 |     await page.goto('/dashboard');
  471 |     await waitForPageReady(page);
  472 | 
  473 |     // Should be authenticated (not redirected to login)
  474 |     await expect(page).not.toHaveURL(/\/login/);
  475 |     // Should have some content
  476 |     await expect(page.locator('body')).toBeVisible();
  477 |   });
  478 | 
  479 |   test('/my-requests — shows requests list or empty state', async ({ page }) => {
  480 |     await page.goto('/my-requests');
  481 |     await waitForPageReady(page);
  482 |     await expect(page).not.toHaveURL(/\/login/);
  483 |     // h1 heading always renders on this page; avoid strict-mode from .or() matching both
  484 |     await expect(page.locator('h1').first()).toBeVisible();
  485 |   });
  486 | 
  487 |   test('/rewards — shows rewards section', async ({ page }) => {
  488 |     await page.goto('/rewards');
  489 |     await waitForPageReady(page);
  490 |     await expect(page).not.toHaveURL(/\/login/);
  491 |     await expect(
  492 |       page.getByText(/reward|point|balance|cash/i).first()
  493 |     ).toBeVisible();
  494 |   });
  495 | 
  496 |   test('/referral — shows referral code', async ({ page }) => {
  497 |     await page.goto('/referral');
  498 |     await waitForPageReady(page);
  499 |     await expect(page).not.toHaveURL(/\/login/);
  500 |     await expect(
  501 |       page.locator('code').first()
  502 |         .or(page.getByText(/referral/i).first())
  503 |     ).toBeVisible();
  504 |   });
  505 | 
  506 |   test('user can log out', async ({ page }) => {
  507 |     await page.goto('/dashboard');
  508 |     await waitForPageReady(page);
  509 | 
  510 |     // Look for logout button or user menu
  511 |     const logoutBtn = page.getByRole('button', { name: /logout|sign out|log out/i })
  512 |       .or(page.getByText(/logout|sign out|log out/i));
  513 |     if (await logoutBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  514 |       await logoutBtn.first().click();
  515 |       await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  516 |     }
  517 |   });
  518 | });
```