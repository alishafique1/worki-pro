# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consumer-pages.spec.ts >> Consumer Pages — MyRequestsPage & ReferralPage >> ReferralPage copy button is present
- Location: tests/e2e/consumer-pages.spec.ts:73:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('button', { name: /copy/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('button', { name: /copy/i })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - banner [ref=e4]:
        - navigation "Global" [ref=e6]:
          - generic [ref=e7]:
            - link "Worki Worki" [ref=e8] [cursor=pointer]:
              - /url: /
              - img "Worki" [ref=e9]
              - generic [ref=e10]: Worki
            - list [ref=e11]:
              - listitem [ref=e12]:
                - link "Request Service" [ref=e13] [cursor=pointer]:
                  - /url: /request-service
              - listitem [ref=e14]:
                - link "Discover Pros" [ref=e15] [cursor=pointer]:
                  - /url: /discover
              - listitem [ref=e16]:
                - link "Services" [ref=e17] [cursor=pointer]:
                  - /url: /services
              - listitem [ref=e18]:
                - link "Contact" [ref=e19] [cursor=pointer]:
                  - /url: /contact
              - listitem [ref=e20]:
                - link "Dashboard" [ref=e21] [cursor=pointer]:
                  - /url: /dashboard
              - listitem [ref=e22]:
                - link "Provider Portal" [ref=e23] [cursor=pointer]:
                  - /url: /provider/dashboard
              - listitem [ref=e24]:
                - link "Admin" [ref=e25] [cursor=pointer]:
                  - /url: /admin
          - list [ref=e27]:
            - generic [ref=e29] [cursor=pointer]:
              - checkbox [ref=e30]
              - generic [ref=e31]:
                - img [ref=e33]
                - img [ref=e40]
      - generic [ref=e46]: Loading...
    - region "Notifications (F8)":
      - list
  - img
  - dialog "We use cookies" [ref=e47]:
    - generic [ref=e48]:
      - generic [ref=e49]:
        - heading "We use cookies" [level=2] [ref=e50]
        - paragraph [ref=e51]: We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookie policy.
      - generic [ref=e53]:
        - button "Accept all" [ref=e54] [cursor=pointer]
        - button "Reject all" [ref=e55] [cursor=pointer]
    - generic [ref=e58]:
      - link "Privacy Policy" [ref=e59] [cursor=pointer]:
        - /url: /privacy
      - link "Terms and Conditions" [ref=e60] [cursor=pointer]:
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
  18 | async function loginIfNeeded(page: Page) {
  19 |   if (!page.url().includes('/login')) return;
  20 | 
  21 |   await dismissCookieConsent(page);
  22 |   await page.getByLabel(/e-?mail/i).or(page.locator('input[type="email"]')).first().fill(LOGIN_EMAIL);
  23 |   await page.getByLabel(/password/i).or(page.locator('input[type="password"]')).first().fill(LOGIN_PASSWORD);
  24 |   await page.getByRole('button', { name: /log in/i }).click();
  25 | 
  26 |   await page.waitForURL(/\/(dashboard|my-requests|referral|onboarding)(\?.*)?$/i, {
  27 |     timeout: 15000,
  28 |   });
  29 | }
  30 | 
  31 | async function gotoAuthed(page: Page, path: '/my-requests' | '/referral') {
  32 |   await page.goto(path);
  33 |   await loginIfNeeded(page);
  34 | 
  35 |   if (page.url().includes('/onboarding')) {
  36 |     await page.goto(path);
  37 |   }
  38 | 
  39 |   await dismissCookieConsent(page);
  40 |   await page.waitForURL(new RegExp(`${path.replace('/', '\\/')}(\\?.*)?$`, 'i'));
  41 | }
  42 | 
  43 | test.describe('Consumer Pages — MyRequestsPage & ReferralPage', () => {
  44 |   test('MyRequestsPage renders the page heading', async ({ page }) => {
  45 |     await gotoAuthed(page, '/my-requests');
  46 |     await expect(page.getByRole('heading', { name: /my bookings & repairs/i })).toBeVisible();
  47 |   });
  48 | 
  49 |   test('MyRequestsPage shows content or empty state', async ({ page }) => {
  50 |     await gotoAuthed(page, '/my-requests');
  51 |     await expect(
  52 |       page
  53 |         .getByText(/you have no active requests yet/i)
  54 |         .or(page.getByRole('heading', { name: /my bookings & repairs/i }))
  55 |     ).toBeVisible();
  56 |   });
  57 | 
  58 |   test('MyRequestsPage has a link to request a new service', async ({ page }) => {
  59 |     await gotoAuthed(page, '/my-requests');
  60 |     await expect(page.locator('a[href="/request-service"]')).toBeVisible();
  61 |   });
  62 | 
  63 |   test('ReferralPage renders the referral heading', async ({ page }) => {
  64 |     await gotoAuthed(page, '/referral');
  65 |     await expect(page.getByRole('heading', { name: /refer a friend/i })).toBeVisible();
  66 |   });
  67 | 
  68 |   test('ReferralPage shows a referral code element', async ({ page }) => {
  69 |     await gotoAuthed(page, '/referral');
  70 |     await expect(page.locator('code')).toBeVisible();
  71 |   });
  72 | 
  73 |   test('ReferralPage copy button is present', async ({ page }) => {
  74 |     await gotoAuthed(page, '/referral');
> 75 |     await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
     |                                                               ^ Error: expect(locator).toBeVisible() failed
  76 |   });
  77 | 
  78 |   test('ReferralPage shows how-it-works steps', async ({ page }) => {
  79 |     await gotoAuthed(page, '/referral');
  80 |     await expect(page.getByRole('heading', { name: /how it works/i })).toBeVisible();
  81 |     await expect(page.locator('ol li')).toHaveCount(3);
  82 |   });
  83 | 
  84 |   test('ReferralPage referral code starts with REF-', async ({ page }) => {
  85 |     await gotoAuthed(page, '/referral');
  86 |     await expect.poll(async () => (await page.locator('code').textContent())?.trim() || '').toMatch(/^REF-[A-Z0-9]{6}$/);
  87 |   });
  88 | });
  89 | 
```