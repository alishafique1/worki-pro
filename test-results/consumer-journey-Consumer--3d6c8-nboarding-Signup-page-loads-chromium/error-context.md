# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consumer-journey.spec.ts >> Consumer — Signup & Onboarding >> Signup page loads
- Location: tests/e2e/consumer-journey.spec.ts:70:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h2')
Expected pattern: /create|sign up|account/i
Error: strict mode violation: locator('h2') resolved to 2 elements:
    1) <h2 class="text-2xl font-black tracking-tight mb-1 text-[#0F172A]">Create your account</h2> aka getByRole('heading', { name: 'Create your account' })
    2) <h2 id="cm__title" class="cm__title">We use cookies</h2> aka getByText('We use cookies', { exact: true })

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h2')

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
          - heading "Create your account" [level=2] [ref=e36]
          - paragraph [ref=e37]: Join thousands of GTA homeowners. Free forever.
        - generic [ref=e38]:
          - generic [ref=e39]:
            - generic [ref=e40]: Email address
            - textbox "you@example.com" [active] [ref=e41]
          - generic [ref=e42]:
            - generic [ref=e43]: Password
            - textbox "At least 8 characters" [ref=e44]
          - generic [ref=e45]:
            - generic [ref=e46]: Confirm password
            - textbox "Re-enter your password" [ref=e47]
          - button "Create account →" [disabled] [ref=e48]
          - paragraph [ref=e49]:
            - text: Already have an account?
            - link "Sign in" [ref=e50] [cursor=pointer]:
              - /url: /login
    - region "Notifications (F8)":
      - list
  - img
```

# Test source

```ts
  1   | /**
  2   |  * Consumer End-to-End Journey — TheHelper (helper.ca)
  3   |  * Full flow: landing → signup → onboarding → request service → view requests
  4   |  *
  5   |  * Run against production: PLAYWRIGHT_BASE_URL=https://thehelper.ca npx playwright test
  6   |  */
  7   | 
  8   | import { test, expect, Page } from '@playwright/test';
  9   | 
  10  | // ---------------------------------------------------------------------------
  11  | // Helpers
  12  | // ---------------------------------------------------------------------------
  13  | 
  14  | /**
  15  |  * Dismiss cookie consent banner if visible. Tries reject-then-accept to be
  16  |  * resilient against cookie policy variations.
  17  |  */
  18  | async function dismissCookieConsent(page: Page): Promise<void> {
  19  |   for (const name of [/reject/i, /decline/i, /no thanks/i]) {
  20  |     try {
  21  |       const btn = page.getByRole('button', { name });
  22  |       if (await btn.isVisible({ timeout: 2000 })) {
  23  |         await btn.click();
  24  |         return;
  25  |       }
  26  |     } catch { /* no-op */ }
  27  |   }
  28  |   // Fallback: try accept
  29  |   try {
  30  |     const btn = page.getByRole('button', { name: /accept all/i });
  31  |     if (await btn.isVisible({ timeout: 2000 })) await btn.click();
  32  |   } catch { /* no-op */ }
  33  | }
  34  | 
  35  | /**
  36  |  * Wait for page to fully load (network idle + body visible).
  37  |  * Reduces flakiness on CI / slow connections.
  38  |  */
  39  | async function waitForPageReady(page: Page): Promise<void> {
  40  |   await page.waitForLoadState('domcontentloaded');
  41  |   await expect(page.locator('body')).toBeVisible();
  42  | }
  43  | 
  44  | /**
  45  |  * Dismiss any toast / alert that appears after an action.
  46  |  */
  47  | async function dismissToast(page: Page, timeout = 3000): Promise<void> {
  48  |   try {
  49  |     const toast = page.locator('[role="alert"], .toast, [class*="toast"]').first();
  50  |     if (await toast.isVisible({ timeout })) {
  51  |       await toast.click({ timeout: 1000 }).catch(() => {});
  52  |     }
  53  |   } catch { /* no-op */ }
  54  | }
  55  | 
  56  | // ---------------------------------------------------------------------------
  57  | // Consumer Signup — fresh test email each run
  58  | // ---------------------------------------------------------------------------
  59  | 
  60  | const TEST_EMAIL = `consumer-test-${Date.now()}@testhelper.ca`;
  61  | const TEST_PASSWORD = 'TestHelper123!';
  62  | 
  63  | /**
  64  |  * Full consumer signup flow: /signup → OTP code entry → onboarding (CONSUMER role).
  65  |  *
  66  |  * NOTE: OTP verification requires a real inbox. For CI, mock this step or
  67  |  * provision test users directly via Prisma seed.
  68  |  */
  69  | test.describe('Consumer — Signup & Onboarding', () => {
  70  |   test('Signup page loads', async ({ page }) => {
  71  |     await page.goto('/signup');
  72  |     await dismissCookieConsent(page);
  73  |     await waitForPageReady(page);
  74  | 
> 75  |     await expect(page.locator('h2')).toContainText(/create|sign up|account/i);
      |                                      ^ Error: expect(locator).toContainText(expected) failed
  76  |     await expect(page.locator('input[type="email"]')).toBeVisible();
  77  |     await expect(page.locator('input[type="password"]').first()).toBeVisible();
  78  |   });
  79  | 
  80  |   test('Signup form validates required fields', async ({ page }) => {
  81  |     await page.goto('/signup');
  82  |     await dismissCookieConsent(page);
  83  |     await waitForPageReady(page);
  84  | 
  85  |     // Submit empty form — button should be disabled
  86  |     const submitBtn = page.getByRole('button', { name: /create account/i });
  87  |     await expect(submitBtn).toBeDisabled();
  88  |   });
  89  | 
  90  |   test('Signup form validates password mismatch', async ({ page }) => {
  91  |     await page.goto('/signup');
  92  |     await dismissCookieConsent(page);
  93  |     await waitForPageReady(page);
  94  | 
  95  |     await page.locator('input[type="email"]').fill('bad@test.com');
  96  |     await page.locator('input[type="password"]').first().fill('Test1234!');
  97  |     // Fill confirm with different value
  98  |     await page.locator('input[type="password"]').nth(1).fill('DifferentPass1!');
  99  |     await page.getByRole('button', { name: /create account/i }).click();
  100 | 
  101 |     // Should show password mismatch error
  102 |     await expect(page.getByText(/match|same/i).first()).toBeVisible({ timeout: 5000 });
  103 |   });
  104 | 
  105 |   test('Signup form validates password length', async ({ page }) => {
  106 |     await page.goto('/signup');
  107 |     await dismissCookieConsent(page);
  108 |     await waitForPageReady(page);
  109 | 
  110 |     await page.locator('input[type="email"]').fill('short@test.com');
  111 |     await page.locator('input[type="password"]').first().fill('abc');
  112 |     await page.locator('input[type="password"]').nth(1).fill('abc');
  113 | 
  114 |     await page.getByRole('button', { name: /create account/i }).click();
  115 |     await expect(page.getByText(/8 character|at least/i).first()).toBeVisible({ timeout: 5000 });
  116 |   });
  117 | 
  118 |   test('Signup with valid credentials advances to OTP step', async ({ page }) => {
  119 |     await page.goto('/signup');
  120 |     await dismissCookieConsent(page);
  121 |     await waitForPageReady(page);
  122 | 
  123 |     await page.locator('input[type="email"]').fill(TEST_EMAIL);
  124 |     await page.locator('input[type="password"]').first().fill(TEST_PASSWORD);
  125 |     await page.locator('input[type="password"]').nth(1).fill(TEST_PASSWORD);
  126 | 
  127 |     await page.getByRole('button', { name: /create account/i }).click();
  128 | 
  129 |     // Wait for either the OTP step OR an error message
  130 |     const otpVisible = page.locator('input[maxlength="1"], input[maxLength="1"]').first();
  131 |     const errorVisible = page.getByText(/error|failed|exists|try again/i).first();
  132 | 
  133 |     const result = await Promise.race([
  134 |       otpVisible.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'otp'),
  135 |       errorVisible.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'error'),
  136 |     ]).catch(() => 'timeout');
  137 | 
  138 |     if (result === 'otp') {
  139 |       // Success: should show "Check your email" and 6 digit inputs
  140 |       await expect(page.getByText(/check|verify|sent.*code/i).first()).toBeVisible();
  141 |       const otpInputs = page.locator('input[maxlength="1"], input[maxLength="1"]');
  142 |       await expect(otpInputs).toHaveCount(6);
  143 |     } else if (result === 'error') {
  144 |       // API error — report the actual error text for debugging
  145 |       const errorText = await errorVisible.textContent();
  146 |       test.skip(true, `Signup API error: ${errorText}. Check Mailgun/Neon DB connectivity.`);
  147 |     } else {
  148 |       test.skip(true, 'Signup timed out — likely API connectivity issue. Check server logs.');
  149 |     }
  150 |   });
  151 | 
  152 |   test('OTP code entry has 6 individual digit inputs', async ({ page }) => {
  153 |     // Start the flow to reach OTP step
  154 |     await page.goto('/signup');
  155 |     await dismissCookieConsent(page);
  156 |     const testEmail = `otp-test-${Date.now()}@test.com`;
  157 |     await page.locator('input[type="email"]').fill(testEmail);
  158 |     await page.locator('input[type="password"]').first().fill('TestPass123!');
  159 |     await page.locator('input[type="password"]').nth(1).fill('TestPass123!');
  160 |     await page.getByRole('button', { name: /create account/i }).click();
  161 | 
  162 |     // Wait for either OTP step or error
  163 |     const otpVisible = page.locator('input[maxlength="1"], input[maxLength="1"]').first();
  164 |     const errorVisible = page.getByText(/error|failed|exists/i).first();
  165 | 
  166 |     const result = await Promise.race([
  167 |       otpVisible.waitFor({ state: 'visible', timeout: 10000 }).then(() => 'otp'),
  168 |       errorVisible.waitFor({ state: 'visible', timeout: 5000 }).then(() => 'error'),
  169 |     ]).catch(() => 'timeout');
  170 | 
  171 |     if (result !== 'otp') {
  172 |       const errText = result === 'error'
  173 |         ? await page.getByText(/error|failed/i).first().textContent().catch(() => '')
  174 |         : 'timeout';
  175 |       test.skip(true, `Cannot reach OTP step (${result}): ${errText}. Fix signup API first.`);
```