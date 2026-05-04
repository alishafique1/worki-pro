# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tayyari-flow.spec.ts >> Public Pages >> How rewards work page renders
- Location: tests/e2e/tayyari-flow.spec.ts:159:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading')
Expected: visible
Error: strict mode violation: getByRole('heading') resolved to 7 elements:
    1) <h1 class="text-5xl sm:text-7xl font-black tracking-tighter mb-6">…</h1> aka getByRole('heading', { name: 'Double the Rewards On Every' })
    2) <h2 class="text-2xl font-black mb-3">Submit a Request — Earn $5</h2> aka getByRole('heading', { name: 'Submit a Request — Earn $' })
    3) <h2 class="text-2xl font-black mb-3">Get Booked — Earn Another $5</h2> aka getByRole('heading', { name: 'Get Booked — Earn Another $' })
    4) <h2 class="text-2xl font-black mb-3">First Job Done — Earn $50 Bonus</h2> aka getByRole('heading', { name: 'First Job Done — Earn $50' })
    5) <h2 class="text-2xl font-black mb-3">Ongoing 5% Cashback — On Every Job</h2> aka getByRole('heading', { name: 'Ongoing 5% Cashback — On' })
    6) <h2 class="text-2xl font-black mb-2">Cash Out at $100</h2> aka getByRole('heading', { name: 'Cash Out at $' })
    7) <h2 class="text-3xl font-black mb-4">How to Redeem</h2> aka getByRole('heading', { name: 'How to Redeem' })

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
                - link "HVAC" [ref=e13] [cursor=pointer]:
                  - /url: /hvac
              - listitem [ref=e14]:
                - link "Handyman" [ref=e15] [cursor=pointer]:
                  - /url: /handyman
              - listitem [ref=e16]:
                - link "Appliance Repair" [ref=e17] [cursor=pointer]:
                  - /url: /appliance-repair
              - listitem [ref=e18]:
                - link "Services" [ref=e19] [cursor=pointer]:
                  - /url: /services
              - listitem [ref=e20]:
                - link "How it Works" [ref=e21] [cursor=pointer]:
                  - /url: /how-rewards-work
              - listitem [ref=e22]:
                - link "For Pros" [ref=e23] [cursor=pointer]:
                  - /url: /providers
              - listitem [ref=e24]:
                - link "Contact" [ref=e25] [cursor=pointer]:
                  - /url: /contact
          - list [ref=e27]:
            - generic [ref=e29] [cursor=pointer]:
              - checkbox [ref=e30]
              - generic [ref=e31]:
                - img [ref=e33]
                - img [ref=e40]
      - main [ref=e44]:
        - generic [ref=e45]:
          - generic [ref=e46]: Worki Rewards
          - heading "Double the Rewards On Every Job." [level=1] [ref=e47]:
            - text: Double the Rewards
            - text: On Every Job.
          - paragraph [ref=e48]:
            - text: Your Visa or Amex already gives you points when you pay — Worki stacks
            - strong [ref=e49]: cashback on top of that
            - text: . Earn
            - strong [ref=e50]: $60 back on your first job
            - text: ", then"
            - strong [ref=e51]: 5% cashback
            - text: on every job after. Double the rewards for home services you were always going to pay for.
            - generic [ref=e52]: Cash out at $100. 100 pts = $1. Simple.
        - generic [ref=e53]:
          - generic [ref=e54]:
            - generic [ref=e55]: First Job
            - generic [ref=e56]: Earn up to $60
          - generic [ref=e57]:
            - generic [ref=e58]:
              - generic [ref=e59]:
                - generic [ref=e60]: "01"
                - generic [ref=e61]: 📋
              - generic [ref=e62]:
                - heading "Submit a Request — Earn $5" [level=2] [ref=e63]
                - paragraph [ref=e64]: Fill out our 60-second concierge form describing what you need. The moment your request is submitted, 500 points ($5) are added to your wallet. No appointment needed — just asking counts.
              - generic [ref=e65]:
                - generic [ref=e66]: $5
                - generic [ref=e67]: 500 pts
            - generic [ref=e68]:
              - generic [ref=e69]:
                - generic [ref=e70]: "02"
                - generic [ref=e71]: 📅
              - generic [ref=e72]:
                - heading "Get Booked — Earn Another $5" [level=2] [ref=e73]
                - paragraph [ref=e74]: When a vetted Worki pro accepts and schedules your appointment, another 500 points ($5) are credited. You're already at $10 before the work starts.
              - generic [ref=e75]:
                - generic [ref=e76]: $5
                - generic [ref=e77]: 500 pts
            - generic [ref=e78]:
              - generic [ref=e79]:
                - generic [ref=e80]: "03"
                - generic [ref=e81]: 🎉
              - generic [ref=e82]:
                - heading "First Job Done — Earn $50 Bonus" [level=2] [ref=e83]
                - paragraph [ref=e84]: "Once your pro marks the first job complete and our team verifies it, a $50 welcome bonus (5,000 points) lands in your wallet. Total first job value: up to $60 in rewards."
              - generic [ref=e85]:
                - generic [ref=e86]: $50
                - generic [ref=e87]: 5,000 pts
        - generic [ref=e88]:
          - generic [ref=e89]:
            - generic [ref=e90]: Every Job After That
            - generic [ref=e91]: 5% cashback
          - generic [ref=e92]:
            - generic [ref=e93]:
              - generic [ref=e94]: 5%
              - generic [ref=e95]: 💳
            - generic [ref=e96]:
              - heading "Ongoing 5% Cashback — On Every Job" [level=2] [ref=e97]
              - paragraph [ref=e98]: After your first job, every completed booking earns you 5% of the job value in Worki points. A $200 plumbing job? That's $10 back. A $500 HVAC tune-up? $25 back. It adds up fast — and never expires.
            - generic [ref=e100]:
              - generic [ref=e101]: Example
              - generic [ref=e102]: $200 job
              - generic [ref=e103]: = $10 back
        - generic [ref=e105]:
          - generic [ref=e106]: 🏦
          - generic [ref=e107]:
            - heading "Cash Out at $100" [level=2] [ref=e108]
            - paragraph [ref=e109]:
              - text: Once your balance hits
              - strong [ref=e110]: $100 (10,000 points)
              - text: ", you can redeem for Amazon gift cards, Starbucks, or credits toward your next Worki booking. Most homeowners hit $100 after their second or third job. Redemptions are processed within 24 hours."
          - generic [ref=e111]:
            - generic [ref=e112]: Minimum Cashout
            - generic [ref=e113]: $100
        - generic [ref=e114]:
          - heading "How to Redeem" [level=2] [ref=e115]
          - generic [ref=e116]:
            - generic [ref=e117]:
              - generic [ref=e118]: 🎁
              - generic [ref=e119]: Amazon Gift Cards
              - generic [ref=e120]: Spend on anything you need
            - generic [ref=e121]:
              - generic [ref=e122]: ☕
              - generic [ref=e123]: Starbucks Cards
              - generic [ref=e124]: Your next coffee, on us
            - generic [ref=e125]:
              - generic [ref=e126]: 🏠
              - generic [ref=e127]: Service Discounts
              - generic [ref=e128]: Apply to your next Worki booking
        - generic [ref=e129]:
          - link "Start Earning — Request a Service" [ref=e130] [cursor=pointer]:
            - /url: /request-service
          - paragraph [ref=e131]: No account required to get started.
    - region "Notifications (F8)":
      - list
  - img
```

# Test source

```ts
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
> 162 |     await expect(page.getByRole('heading')).toBeVisible();
      |                                             ^ Error: expect(locator).toBeVisible() failed
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