# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: worki-flow.spec.ts >> Worki End-to-End Flow >> Provider Dashboard renders correctly
- Location: tests/e2e/worki-flow.spec.ts:46:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - generic [ref=e6]:
        - generic [ref=e7]:
          - generic [ref=e8]:
            - generic [ref=e9]: W
            - generic [ref=e10]: Worki
          - generic [ref=e11]:
            - heading "Your home. Handled." [level=1] [ref=e12]:
              - text: Your home.
              - text: Handled.
            - paragraph [ref=e13]: Connect with verified local pros, earn rewards, and manage every job in one place.
        - generic [ref=e14]:
          - generic [ref=e15]:
            - generic [ref=e16]: 🔧
            - generic [ref=e17]:
              - paragraph [ref=e18]: Verified Pros
              - paragraph [ref=e19]: Every provider is background-checked and insured
          - generic [ref=e20]:
            - generic [ref=e21]: 🏆
            - generic [ref=e22]:
              - paragraph [ref=e23]: Earn Rewards
              - paragraph [ref=e24]: Get points for every completed service
          - generic [ref=e25]:
            - generic [ref=e26]: ⚡
            - generic [ref=e27]:
              - paragraph [ref=e28]: Fast Matching
              - paragraph [ref=e29]: We find the right pro for your job in minutes
      - generic [ref=e31]:
        - generic [ref=e32]:
          - heading "Log in to your account" [level=2] [ref=e34]
          - generic [ref=e35]: Network Error
          - generic [ref=e36]:
            - generic [ref=e37]: Log in with
            - link [ref=e39] [cursor=pointer]:
              - /url: http://localhost:3001/auth/google/login
              - img [ref=e40]
          - generic [ref=e48]: Or continue with
          - generic [ref=e49]:
            - generic [ref=e50]:
              - generic [ref=e51]: E-mail
              - textbox [ref=e52]: test@worki.ai
            - generic [ref=e53]:
              - generic [ref=e54]: Password
              - textbox [ref=e55]: Password123!
            - button "Log in" [ref=e57] [cursor=pointer]
        - generic [ref=e58]:
          - paragraph [ref=e59]:
            - text: Don't have an account?
            - link "Sign up free" [ref=e60] [cursor=pointer]:
              - /url: /signup
          - paragraph [ref=e61]:
            - link "Forgot password?" [ref=e62] [cursor=pointer]:
              - /url: /request-password-reset
    - region "Notifications (F8)":
      - list
  - img
  - dialog "We use cookies" [ref=e63]:
    - generic [ref=e64]:
      - generic [ref=e65]:
        - heading "We use cookies" [level=2] [ref=e66]
        - paragraph [ref=e67]: We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookie policy.
      - generic [ref=e69]:
        - button "Accept all" [ref=e70] [cursor=pointer]
        - button "Reject all" [ref=e71] [cursor=pointer]
    - generic [ref=e74]:
      - link "Privacy Policy" [ref=e75] [cursor=pointer]:
        - /url: /privacy
      - link "Terms and Conditions" [ref=e76] [cursor=pointer]:
        - /url: /terms
```

# Test source

```ts
  1  | import { test, expect, Page } from '@playwright/test';
  2  | 
  3  | const LOGIN_EMAIL = 'test@worki.ai';
  4  | const LOGIN_PASSWORD = 'Password123!';
  5  | 
  6  | async function dismissCookieConsent(page: Page) {
  7  |   const reject = page.getByRole('button', { name: /reject all/i });
  8  |   if (await reject.isVisible().catch(() => false)) {
  9  |     await reject.click().catch(() => {});
  10 |   }
  11 | 
  12 |   const accept = page.getByRole('button', { name: /accept all/i });
  13 |   if (await accept.isVisible().catch(() => false)) {
  14 |     await accept.click().catch(() => {});
  15 |   }
  16 | }
  17 | 
  18 | async function login(page: Page, email = LOGIN_EMAIL, password = LOGIN_PASSWORD) {
  19 |   await page.goto('/login');
  20 |   await dismissCookieConsent(page);
  21 | 
  22 |   await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  23 |   await page
  24 |     .getByLabel(/e-?mail/i)
  25 |     .or(page.locator('input[type="email"]'))
  26 |     .first()
  27 |     .fill(email);
  28 |   await page
  29 |     .getByLabel(/password/i)
  30 |     .or(page.locator('input[type="password"]'))
  31 |     .first()
  32 |     .fill(password);
  33 |   await page.getByRole('button', { name: /log in/i }).click();
  34 | 
> 35 |   await page.waitForURL(/\/(dashboard|onboarding|provider\/dashboard|provider\/apply)(\?.*)?$/i, {
     |              ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  36 |     timeout: 15000,
  37 |   });
  38 | 
  39 |   const url = page.url();
  40 |   if (url.includes('/onboarding')) {
  41 |     await page.goto('/provider/dashboard');
  42 |   }
  43 | }
  44 | 
  45 | test.describe('Worki End-to-End Flow', () => {
  46 |   test('Provider Dashboard renders correctly', async ({ page }) => {
  47 |     await login(page);
  48 |     await page.goto('/provider/dashboard');
  49 |     await dismissCookieConsent(page);
  50 | 
  51 |     await expect(page.getByRole('heading', { name: /provider portal/i })).toBeVisible();
  52 |     await expect(page.getByText(/new leads/i)).toBeVisible();
  53 |   });
  54 | });
  55 | 
```