# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tayyari-flow.spec.ts >> Public Pages >> Terms and Privacy pages render
- Location: tests/e2e/tayyari-flow.spec.ts:171:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading')
Expected: visible
Error: strict mode violation: getByRole('heading') resolved to 4 elements:
    1) <h1 class="text-4xl font-black mb-8">Terms of Service</h1> aka getByRole('heading', { name: 'Terms of Service' })
    2) <h2 class="text-2xl font-bold mt-12 mb-4">1. Acceptance of Terms</h2> aka getByRole('heading', { name: 'Acceptance of Terms' })
    3) <h2 class="text-2xl font-bold mt-12 mb-4">2. The Marketplace</h2> aka getByRole('heading', { name: 'The Marketplace' })
    4) <h2 class="text-2xl font-bold mt-12 mb-4">3. Rewards Program</h2> aka getByRole('heading', { name: 'Rewards Program' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
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
      - generic [ref=e44]:
        - heading "Terms of Service" [level=1] [ref=e45]
        - paragraph [ref=e46]: "Last updated: May 1, 2026"
        - heading "1. Acceptance of Terms" [level=2] [ref=e47]
        - paragraph [ref=e48]: By accessing or using the Worki platform, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform.
        - heading "2. The Marketplace" [level=2] [ref=e49]
        - paragraph [ref=e50]: Worki provides a marketplace connecting homeowners with service providers. We do not provide home services ourselves. We are not responsible for the quality of work provided by independent pros.
        - heading "3. Rewards Program" [level=2] [ref=e51]
        - paragraph [ref=e52]: Points are awarded after a job is completed and verified by Worki. Points have no cash value until redeemed through our official platform for gift cards or service discounts.
        - paragraph [ref=e53]: Full legal text for GTA compliance goes here...
    - region "Notifications (F8)":
      - list
  - img
```

# Test source

```ts
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
  129 |     await expect(page.getByRole('radio', { name: /service pro/i })).toBeVisible();
  130 |     await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  131 |   });
  132 | 
  133 |   test('Request password reset page renders', async ({ page }) => {
  134 |     await page.goto('/request-password-reset');
  135 |     await dismissCookieConsent(page);
  136 |     await expect(page.getByRole('heading', { name: /reset/i })).toBeVisible();
  137 |   });
  138 | 
  139 |   test('User can navigate between login and signup', async ({ page }) => {
  140 |     await page.goto('/login');
  141 |     await dismissCookieConsent(page);
  142 |     await page.getByRole('link', { name: /sign up free/i }).click();
  143 |     await page.waitForURL('/signup');
  144 |     await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
  145 | 
  146 |     await page.getByRole('link', { name: /^log in$/i }).click();
  147 |     await page.waitForURL('/login');
  148 |     await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  149 |   });
  150 | });
  151 | 
  152 | test.describe('Public Pages', () => {
  153 |   test('Landing page renders', async ({ page }) => {
  154 |     await page.goto('/');
  155 |     await dismissCookieConsent(page);
  156 |     await expect(page.getByRole('heading')).toBeVisible();
  157 |   });
  158 | 
  159 |   test('How rewards work page renders', async ({ page }) => {
  160 |     await page.goto('/how-rewards-work');
  161 |     await dismissCookieConsent(page);
  162 |     await expect(page.getByRole('heading')).toBeVisible();
  163 |   });
  164 | 
  165 |   test('Provider landing page renders', async ({ page }) => {
  166 |     await page.goto('/providers');
  167 |     await dismissCookieConsent(page);
  168 |     await expect(page.getByRole('heading')).toBeVisible();
  169 |   });
  170 | 
  171 |   test('Terms and Privacy pages render', async ({ page }) => {
  172 |     await page.goto('/terms');
  173 |     await dismissCookieConsent(page);
> 174 |     await expect(page.getByRole('heading')).toBeVisible();
      |                                             ^ Error: expect(locator).toBeVisible() failed
  175 | 
  176 |     await page.goto('/privacy');
  177 |     await dismissCookieConsent(page);
  178 |     await expect(page.getByRole('heading')).toBeVisible();
  179 |   });
  180 | });
  181 | 
  182 | test.describe('Consumer Navigation', () => {
  183 |   test.beforeEach(async ({ page }) => {
  184 |     await login(page, 'test@worki.ai', 'Password123!', '/dashboard');
  185 |   });
  186 | 
  187 |   test('My Requests page renders', async ({ page }) => {
  188 |     await page.goto('/my-requests');
  189 |     await dismissCookieConsent(page);
  190 |     await expect(page.getByRole('heading', { name: /my bookings & repairs/i })).toBeVisible();
  191 |   });
  192 | 
  193 |   test('Referral page renders', async ({ page }) => {
  194 |     await page.goto('/referral');
  195 |     await dismissCookieConsent(page);
  196 |     await expect(page.getByRole('heading', { name: /refer a friend/i })).toBeVisible();
  197 |   });
  198 | });
  199 | 
```