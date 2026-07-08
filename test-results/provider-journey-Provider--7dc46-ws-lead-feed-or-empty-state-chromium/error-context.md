# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: provider-journey.spec.ts >> Provider — Authenticated Dashboard >> /provider/leads — shows lead feed or empty state
- Location: tests/e2e/provider-journey.spec.ts:196:3

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
            - textbox "you@example.com" [ref=e41]: hvac@thehelper.ca
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
  1   | /**
  2   |  * Provider End-to-End Journey — TheHelper (helper.ca)
  3   |  * Full flow: providers landing → apply → signup as PROVIDER → onboarding →
  4   |  *            provider dashboard → leads → claim lead → billing
  5   |  *
  6   |  * Run against production: PLAYWRIGHT_BASE_URL=https://thehelper.ca npx playwright test provider-journey
  7   |  *
  8   |  * Requires a seeded VERIFIED provider account for the lead-claim flow.
  9   |  * Set PROVIDER_EMAIL + PROVIDER_PASSWORD env vars (defaults: hvac@thehelper.ca).
  10  |  */
  11  | 
  12  | import { test, expect, Page } from '@playwright/test';
  13  | 
  14  | // ---------------------------------------------------------------------------
  15  | // Helpers
  16  | // ---------------------------------------------------------------------------
  17  | 
  18  | async function dismissCookieConsent(page: Page): Promise<void> {
  19  |   for (const name of [/reject/i, /decline/i, /no thanks/i, /accept all/i]) {
  20  |     try {
  21  |       const btn = page.getByRole('button', { name });
  22  |       if (await btn.isVisible({ timeout: 2000 })) {
  23  |         await btn.click();
  24  |         return;
  25  |       }
  26  |     } catch { /* no-op */ }
  27  |   }
  28  | }
  29  | 
  30  | async function waitForPageReady(page: Page): Promise<void> {
  31  |   await page.waitForLoadState('domcontentloaded');
  32  |   await expect(page.locator('body')).toBeVisible();
  33  | }
  34  | 
  35  | async function loginProvider(page: Page): Promise<void> {
  36  |   const email = process.env.PROVIDER_EMAIL ?? 'hvac@thehelper.ca';
  37  |   const password = process.env.PROVIDER_PASSWORD ?? 'HelperTest123';
  38  | 
  39  |   await page.goto('/login');
  40  |   await dismissCookieConsent(page);
  41  | 
  42  |   // Wait for the email input to be ready (Wasp SSR hydration)
  43  |   await page.locator('input[type="email"]').waitFor({ state: 'visible', timeout: 15000 });
  44  |   await page.locator('input[type="email"]').fill(email);
  45  | 
  46  |   // Default mode is OTP — switch to password mode (guard if already on password)
  47  |   const pwToggle = page.getByRole('button', { name: /sign in with password/i });
  48  |   if (await pwToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
  49  |     await pwToggle.click();
  50  |   }
  51  | 
  52  |   // Wait for password field to appear
  53  |   await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 5000 });
  54  |   await page.locator('input[type="password"]').fill(password);
> 55  |   await page.getByRole('button', { name: /sign in/i }).click();
      |                                                        ^ Error: locator.click: Test timeout of 45000ms exceeded.
  56  | 
  57  |   // Wait for post-login redirect
  58  |   await page.waitForURL(
  59  |     /\/(provider\/dashboard|provider\/apply|dashboard|onboarding)/,
  60  |     { timeout: 20000 }
  61  |   ).catch(() => {});
  62  | 
  63  |   // Surface auth failures immediately rather than timing out
  64  |   if (page.url().includes('/login')) {
  65  |     const errorText = await page.locator('[class*="error"], [class*="alert"], p[class*="red"]').first()
  66  |       .textContent().catch(() => '');
  67  |     throw new Error(`Provider login failed for ${email} — check credentials. Error: ${errorText}`);
  68  |   }
  69  | }
  70  | 
  71  | // ---------------------------------------------------------------------------
  72  | // Provider Acquisition — public landing + apply
  73  | // ---------------------------------------------------------------------------
  74  | 
  75  | test.describe('Provider — Acquisition Funnel (public)', () => {
  76  |   test('/providers landing — shows value prop + apply CTA', async ({ page }) => {
  77  |     await page.goto('/providers');
  78  |     await dismissCookieConsent(page);
  79  |     await waitForPageReady(page);
  80  | 
  81  |     await expect(page).not.toHaveURL(/\/login/);
  82  |     await expect(page.locator('h1, h2').first()).toBeVisible();
  83  | 
  84  |     // Apply CTA should exist
  85  |     await expect(
  86  |       page.getByRole('link', { name: /apply|join|become a pro|get started/i })
  87  |         .or(page.getByRole('button', { name: /apply|join|become a pro/i }))
  88  |         .first()
  89  |     ).toBeVisible();
  90  |   });
  91  | 
  92  |   test('/providers/apply — application form loads', async ({ page }) => {
  93  |     await page.goto('/providers/apply');
  94  |     await dismissCookieConsent(page);
  95  |     await waitForPageReady(page);
  96  | 
  97  |     await expect(page).not.toHaveURL(/\/login/);
  98  |     await expect(page.locator('form')).toBeVisible();
  99  |   });
  100 | 
  101 |   test('/providers/apply — form has key fields', async ({ page }) => {
  102 |     await page.goto('/providers/apply');
  103 |     await dismissCookieConsent(page);
  104 |     await waitForPageReady(page);
  105 | 
  106 |     const inputs = page.locator('form input, form textarea, form select');
  107 |     const count = await inputs.count();
  108 |     expect(count).toBeGreaterThan(0);
  109 |   });
  110 | 
  111 |   test('/providers/apply — empty submission is blocked', async ({ page }) => {
  112 |     await page.goto('/providers/apply');
  113 |     await dismissCookieConsent(page);
  114 |     await waitForPageReady(page);
  115 | 
  116 |     const submitBtn = page.locator('form').getByRole('button', { name: /apply|submit|send/i }).first();
  117 |     if (await submitBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  118 |       await submitBtn.click();
  119 |       await expect(page).toHaveURL(/apply/);
  120 |     }
  121 |   });
  122 | 
  123 |   test('/list-your-services — pro recruitment page loads', async ({ page }) => {
  124 |     await page.goto('/list-your-services');
  125 |     await dismissCookieConsent(page);
  126 |     await waitForPageReady(page);
  127 |     await expect(page).not.toHaveURL(/\/login/);
  128 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  129 |   });
  130 | });
  131 | 
  132 | // ---------------------------------------------------------------------------
  133 | // Provider Signup as PROVIDER role
  134 | // ---------------------------------------------------------------------------
  135 | 
  136 | test.describe('Provider — Signup with PROVIDER role', () => {
  137 |   const NEW_PROVIDER_EMAIL = `provider-test-${Date.now()}@testhelper.ca`;
  138 | 
  139 |   test('Provider can sign up and reach OTP step', async ({ page }) => {
  140 |     await page.goto('/signup');
  141 |     await dismissCookieConsent(page);
  142 |     await waitForPageReady(page);
  143 | 
  144 |     await page.locator('input[type="email"]').fill(NEW_PROVIDER_EMAIL);
  145 |     await page.locator('input[type="password"]').first().fill('ProviderPass123!');
  146 |     await page.locator('input[type="password"]').nth(1).fill('ProviderPass123!');
  147 |     await page.getByRole('button', { name: /create account/i }).click();
  148 | 
  149 |     // Wait for OTP step or error
  150 |     const otpVisible = page.locator('input[maxlength="1"], input[maxLength="1"]').first();
  151 |     const errorVisible = page.getByText(/error|failed|exists|try again/i).first();
  152 | 
  153 |     const result = await Promise.race([
  154 |       otpVisible.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'otp'),
  155 |       errorVisible.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'error'),
```