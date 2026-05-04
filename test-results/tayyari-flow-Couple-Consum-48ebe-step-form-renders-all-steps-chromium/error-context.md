# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tayyari-flow.spec.ts >> Couple (Consumer) Happy Path >> Request service multi-step form renders all steps
- Location: tests/e2e/tayyari-flow.spec.ts:66:3

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
  1   | import { test, expect, Page } from '@playwright/test';
  2   | 
  3   | function uniqueEmail(prefix = 'playwright') {
  4   |   const ts = Date.now();
  5   |   return `${prefix}+${ts}@worki.test`;
  6   | }
  7   | 
  8   | async function dismissCookieConsent(page: Page) {
  9   |   const reject = page.getByRole('button', { name: /reject all/i });
  10  |   if (await reject.isVisible().catch(() => false)) {
  11  |     await reject.click().catch(() => {});
  12  |   }
  13  | 
  14  |   const accept = page.getByRole('button', { name: /accept all/i });
  15  |   if (await accept.isVisible().catch(() => false)) {
  16  |     await accept.click().catch(() => {});
  17  |   }
  18  | }
  19  | 
  20  | async function login(page: Page, email: string, password: string, targetAfterLogin?: string) {
  21  |   await page.goto('/login');
  22  |   await dismissCookieConsent(page);
  23  | 
  24  |   await page.getByLabel(/e-?mail/i).or(page.locator('input[type="email"]')).first().fill(email);
  25  |   await page.getByLabel(/password/i).or(page.locator('input[type="password"]')).first().fill(password);
  26  |   await page.getByRole('button', { name: /log in/i }).click();
  27  | 
> 28  |   await page.waitForURL(/\/(dashboard|onboarding|provider\/dashboard|provider\/apply)(\?.*)?$/i, {
      |              ^ TimeoutError: page.waitForURL: Timeout 15000ms exceeded.
  29  |     timeout: 15000,
  30  |   });
  31  | 
  32  |   if (targetAfterLogin) {
  33  |     await page.goto(targetAfterLogin);
  34  |     await dismissCookieConsent(page);
  35  |   }
  36  | }
  37  | 
  38  | test.describe('Couple (Consumer) Happy Path', () => {
  39  |   test('Signup → redirected to dashboard or onboarding', async ({ page }) => {
  40  |     const email = uniqueEmail('consumer');
  41  | 
  42  |     await page.goto('/signup');
  43  |     await dismissCookieConsent(page);
  44  |     await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
  45  | 
  46  |     await page.getByRole('radio', { name: /homeowner/i }).check();
  47  |     await page.getByLabel(/email/i).fill(email);
  48  |     await page.getByLabel(/password/i).fill('TestPass123!');
  49  |     await page.getByRole('button', { name: /create account/i }).click();
  50  | 
  51  |     await page.waitForURL(/\/(dashboard|onboarding|provider\/apply|provider\/dashboard)?(\?.*)?$/i, {
  52  |       timeout: 15000,
  53  |     });
  54  |     await expect(page).toHaveURL(/\/(dashboard|onboarding|provider\/apply|provider\/dashboard)?(\?.*)?$/i);
  55  |   });
  56  | 
  57  |   test('Dashboard shows rewards widget and active jobs section', async ({ page }) => {
  58  |     await login(page, 'test@worki.ai', 'Password123!', '/dashboard');
  59  | 
  60  |     await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  61  |     await expect(page.getByRole('heading', { name: /requests & bookings/i })).toBeVisible();
  62  |     await expect(page.getByRole('heading', { name: /rewards/i })).toBeVisible();
  63  |     await expect(page.getByRole('link', { name: /request new service/i })).toBeVisible();
  64  |   });
  65  | 
  66  |   test('Request service multi-step form renders all steps', async ({ page }) => {
  67  |     await login(page, 'test@worki.ai', 'Password123!', '/request-service');
  68  |     await expect(page.getByRole('heading', { name: /what kind of help do you need/i })).toBeVisible();
  69  |     await expect(page.getByRole('heading', { name: /tell us what is happening/i })).toBeVisible();
  70  |     await expect(page.getByRole('heading', { name: /where and when should we follow up/i })).toBeVisible();
  71  |     await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
  72  |     await expect(page.getByPlaceholder(/email address/i)).toBeVisible();
  73  |     await expect(page.getByPlaceholder(/phone number/i)).toBeVisible();
  74  |     await expect(page.getByLabel(/postal code/i)).toBeVisible();
  75  |   });
  76  | 
  77  |   test('Rewards page renders account balance', async ({ page }) => {
  78  |     await login(page, 'test@worki.ai', 'Password123!', '/rewards');
  79  |     await expect(page.getByRole('heading', { name: /rewards wallet/i })).toBeVisible();
  80  |     await expect(page.getByText(/available points/i)).toBeVisible();
  81  |   });
  82  | });
  83  | 
  84  | test.describe('Vendor Happy Path', () => {
  85  |   test('Provider signup and apply page renders', async ({ page }) => {
  86  |     const email = uniqueEmail('vendor');
  87  | 
  88  |     await page.goto('/signup');
  89  |     await dismissCookieConsent(page);
  90  |     await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
  91  | 
  92  |     await page.getByRole('radio', { name: /service pro/i }).check();
  93  |     await page.getByLabel(/email/i).fill(email);
  94  |     await page.getByLabel(/password/i).fill('TestPass123!');
  95  |     await page.getByRole('button', { name: /create account/i }).click();
  96  | 
  97  |     await page.waitForURL(/\/(provider\/apply|providers\/apply|onboarding|provider\/dashboard)(\?.*)?$/, {
  98  |       timeout: 15000,
  99  |     });
  100 | 
  101 |     if (!/provider\/apply|providers\/apply/.test(page.url())) {
  102 |       await page.goto('/provider/apply');
  103 |     }
  104 | 
  105 |     await expect(page.getByRole('heading', { name: /apply/i })).toBeVisible();
  106 |   });
  107 | 
  108 |   test('Provider dashboard shows leads and appointments tabs', async ({ page }) => {
  109 |     await login(page, 'pro@worki.ai', 'Password123!', '/provider/dashboard');
  110 |     await expect(page.getByRole('heading', { name: /provider portal/i })).toBeVisible();
  111 |     await expect(page.getByText(/new leads/i)).toBeVisible();
  112 |   });
  113 | });
  114 | 
  115 | test.describe('Auth Pages', () => {
  116 |   test('Login page renders with form elements', async ({ page }) => {
  117 |     await page.goto('/login');
  118 |     await dismissCookieConsent(page);
  119 |     await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  120 |     await expect(page.getByRole('link', { name: /sign up free/i })).toBeVisible();
  121 |     await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
  122 |   });
  123 | 
  124 |   test('Signup page renders with role selector', async ({ page }) => {
  125 |     await page.goto('/signup');
  126 |     await dismissCookieConsent(page);
  127 |     await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
  128 |     await expect(page.getByRole('radio', { name: /homeowner/i })).toBeVisible();
```