# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tayyari-flow.spec.ts >> Auth Pages >> Request password reset page renders
- Location: tests/e2e/tayyari-flow.spec.ts:133:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /reset/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /reset/i })

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
      - generic [ref=e43]:
        - generic [ref=e44]:
          - generic [ref=e45]:
            - generic [ref=e46]:
              - generic [ref=e47]: W
              - generic [ref=e48]: Worki
            - generic [ref=e49]:
              - heading "Your home. Handled." [level=1] [ref=e50]:
                - text: Your home.
                - text: Handled.
              - paragraph [ref=e51]: Connect with verified local pros, earn rewards, and manage every job in one place.
          - generic [ref=e52]:
            - generic [ref=e53]:
              - generic [ref=e54]: 🔧
              - generic [ref=e55]:
                - paragraph [ref=e56]: Verified Pros
                - paragraph [ref=e57]: Every provider is background-checked and insured
            - generic [ref=e58]:
              - generic [ref=e59]: 🏆
              - generic [ref=e60]:
                - paragraph [ref=e61]: Earn Rewards
                - paragraph [ref=e62]: Get points for every completed service
            - generic [ref=e63]:
              - generic [ref=e64]: ⚡
              - generic [ref=e65]:
                - paragraph [ref=e66]: Fast Matching
                - paragraph [ref=e67]: We find the right pro for your job in minutes
        - generic [ref=e70]:
          - heading "Forgot your password?" [level=2] [ref=e72]
          - generic [ref=e73]:
            - generic [ref=e74]:
              - generic [ref=e75]: E-mail
              - textbox [ref=e76]
            - button "Send password reset email" [ref=e78] [cursor=pointer]
    - region "Notifications (F8)":
      - list
  - img
  - dialog "We use cookies" [ref=e79]:
    - generic [ref=e80]:
      - generic [ref=e81]:
        - heading "We use cookies" [level=2] [ref=e82]
        - paragraph [ref=e83]: We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookie policy.
      - generic [ref=e85]:
        - button "Accept all" [ref=e86] [cursor=pointer]
        - button "Reject all" [ref=e87] [cursor=pointer]
    - generic [ref=e90]:
      - link "Privacy Policy" [ref=e91] [cursor=pointer]:
        - /url: /privacy
      - link "Terms and Conditions" [ref=e92] [cursor=pointer]:
        - /url: /terms
```

# Test source

```ts
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
  129 |     await expect(page.getByRole('radio', { name: /service pro/i })).toBeVisible();
  130 |     await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  131 |   });
  132 | 
  133 |   test('Request password reset page renders', async ({ page }) => {
  134 |     await page.goto('/request-password-reset');
  135 |     await dismissCookieConsent(page);
> 136 |     await expect(page.getByRole('heading', { name: /reset/i })).toBeVisible();
      |                                                                 ^ Error: expect(locator).toBeVisible() failed
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
  174 |     await expect(page.getByRole('heading')).toBeVisible();
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