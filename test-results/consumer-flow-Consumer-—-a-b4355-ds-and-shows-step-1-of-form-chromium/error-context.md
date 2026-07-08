# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consumer-flow.spec.ts >> Consumer — authenticated flow >> /request-service — loads and shows step 1 of form
- Location: tests/e2e/consumer-flow.spec.ts:116:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /free quotes/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /free quotes/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - banner [ref=e4]:
        - navigation "Global" [ref=e5]:
          - link "The Helper thehelper.ca" [ref=e6] [cursor=pointer]:
            - /url: /
            - img "The Helper" [ref=e7]
            - generic [ref=e8]: thehelper.ca
          - list [ref=e9]:
            - listitem [ref=e10]:
              - link "Services" [ref=e12] [cursor=pointer]:
                - /url: /services
            - listitem [ref=e13]:
              - link "How it Works" [ref=e14] [cursor=pointer]:
                - /url: /how-it-works
            - listitem [ref=e15]:
              - link "Rewards" [ref=e16] [cursor=pointer]:
                - /url: /how-rewards-work
          - generic [ref=e17]:
            - link "Get Help" [ref=e18] [cursor=pointer]:
              - /url: /get-quotes
            - button "consumer@thehelper.ca" [ref=e19]:
              - generic [ref=e20]: consumer@thehelper.ca
              - img [ref=e21]
              - img [ref=e24]
      - generic [ref=e28]:
        - generic [ref=e29]:
          - generic [ref=e30]:
            - img "The Helper" [ref=e31]
            - generic [ref=e32]: The Helper
          - heading "Get matched with a pro" [level=2] [ref=e33]
          - paragraph [ref=e34]: No account needed, no cost — takes 2 minutes
        - generic [ref=e36]:
          - generic [ref=e37]: Service
          - generic [ref=e38]: Questions
          - generic [ref=e39]: Your info
          - generic [ref=e40]: Verify email
        - generic [ref=e44]:
          - heading "What do you need help with?" [level=3] [ref=e45]
          - paragraph [ref=e46]: Select a category to get started.
          - generic [ref=e47]:
            - button "Appliance Repair Washer, dryer, fridge, stove, dishwasher — diagnosis and repair" [ref=e48] [cursor=pointer]:
              - paragraph [ref=e49]: Appliance Repair
              - paragraph [ref=e50]: Washer, dryer, fridge, stove, dishwasher — diagnosis and repair
            - button "Cleaning Regular, deep clean, move-in/out, post-construction, and Airbnb cleans" [ref=e51] [cursor=pointer]:
              - paragraph [ref=e52]: Cleaning
              - paragraph [ref=e53]: Regular, deep clean, move-in/out, post-construction, and Airbnb cleans
            - button "Electrical Wiring, panels, outlets, lighting, and safety inspections" [ref=e54] [cursor=pointer]:
              - paragraph [ref=e55]: Electrical
              - paragraph [ref=e56]: Wiring, panels, outlets, lighting, and safety inspections
            - button "Events Event setup, furniture rentals, tents, AV, and cleanup services" [ref=e57] [cursor=pointer]:
              - paragraph [ref=e58]: Events
              - paragraph [ref=e59]: Event setup, furniture rentals, tents, AV, and cleanup services
            - button "Events & Celebrations Make any occasion unforgettable. Decorators, caterers, entertainment, and event vendors across the GTA." [ref=e60] [cursor=pointer]:
              - paragraph [ref=e61]: Events & Celebrations
              - paragraph [ref=e62]: Make any occasion unforgettable. Decorators, caterers, entertainment, and event vendors across the GTA.
            - button "Fence & Gate Wood, vinyl, chain-link, and aluminum fence install and repair" [ref=e63] [cursor=pointer]:
              - paragraph [ref=e64]: Fence & Gate
              - paragraph [ref=e65]: Wood, vinyl, chain-link, and aluminum fence install and repair
            - button "Flooring Hardwood, tile, laminate, vinyl plank, carpet — supply and install" [ref=e66] [cursor=pointer]:
              - paragraph [ref=e67]: Flooring
              - paragraph [ref=e68]: Hardwood, tile, laminate, vinyl plank, carpet — supply and install
            - button "Garage Door Spring repair, opener install, panel replacement, and seasonal tune-up" [ref=e69] [cursor=pointer]:
              - paragraph [ref=e70]: Garage Door
              - paragraph [ref=e71]: Spring repair, opener install, panel replacement, and seasonal tune-up
            - button "HVAC Heating, ventilation, and air conditioning repairs, tune-ups, and installs" [ref=e72] [cursor=pointer]:
              - paragraph [ref=e73]: HVAC
              - paragraph [ref=e74]: Heating, ventilation, and air conditioning repairs, tune-ups, and installs
            - button "Handyman General home repairs, mounting, assembly, and maintenance" [ref=e75] [cursor=pointer]:
              - paragraph [ref=e76]: Handyman
              - paragraph [ref=e77]: General home repairs, mounting, assembly, and maintenance
            - button "Home Inspection Pre-purchase and annual home inspection with detailed report" [ref=e78] [cursor=pointer]:
              - paragraph [ref=e79]: Home Inspection
              - paragraph [ref=e80]: Pre-purchase and annual home inspection with detailed report
            - button "Junk Removal Furniture, appliances, renovation debris, and estate cleanouts" [ref=e81] [cursor=pointer]:
              - paragraph [ref=e82]: Junk Removal
              - paragraph [ref=e83]: Furniture, appliances, renovation debris, and estate cleanouts
            - button "Landscaping Lawn care, garden beds, interlocking, irrigation, and seasonal cleanup" [ref=e84] [cursor=pointer]:
              - paragraph [ref=e85]: Landscaping
              - paragraph [ref=e86]: Lawn care, garden beds, interlocking, irrigation, and seasonal cleanup
            - button "Locksmith Lock changes, emergency entry, rekeying, and deadbolt installation" [ref=e87] [cursor=pointer]:
              - paragraph [ref=e88]: Locksmith
              - paragraph [ref=e89]: Lock changes, emergency entry, rekeying, and deadbolt installation
            - button "Moving Local moves, packing, furniture assembly, piano moving, and junk removal" [ref=e90] [cursor=pointer]:
              - paragraph [ref=e91]: Moving
              - paragraph [ref=e92]: Local moves, packing, furniture assembly, piano moving, and junk removal
            - button "Painting Interior and exterior painting, drywall prep, colour consultation" [ref=e93] [cursor=pointer]:
              - paragraph [ref=e94]: Painting
              - paragraph [ref=e95]: Interior and exterior painting, drywall prep, colour consultation
            - button "Pest Control Rodent, insect, and wildlife removal — inspection and treatment" [ref=e96] [cursor=pointer]:
              - paragraph [ref=e97]: Pest Control
              - paragraph [ref=e98]: Rodent, insect, and wildlife removal — inspection and treatment
            - button "Plumbing Pipes, drains, water heaters, toilets, and fixture repairs" [ref=e99] [cursor=pointer]:
              - paragraph [ref=e100]: Plumbing
              - paragraph [ref=e101]: Pipes, drains, water heaters, toilets, and fixture repairs
            - button "Pool & Spa Opening, closing, cleaning, equipment repair, and winterization" [ref=e102] [cursor=pointer]:
              - paragraph [ref=e103]: Pool & Spa
              - paragraph [ref=e104]: Opening, closing, cleaning, equipment repair, and winterization
            - button "Renovation Kitchen, bathroom, basement, and general home renovation" [ref=e105] [cursor=pointer]:
              - paragraph [ref=e106]: Renovation
              - paragraph [ref=e107]: Kitchen, bathroom, basement, and general home renovation
            - button "Roofing Shingle repair, full replacement, flat roofs, eavestroughs, and inspections" [ref=e108] [cursor=pointer]:
              - paragraph [ref=e109]: Roofing
              - paragraph [ref=e110]: Shingle repair, full replacement, flat roofs, eavestroughs, and inspections
            - button "Smart Home Smart thermostats, cameras, locks, sensors, and home automation" [ref=e111] [cursor=pointer]:
              - paragraph [ref=e112]: Smart Home
              - paragraph [ref=e113]: Smart thermostats, cameras, locks, sensors, and home automation
            - button "Snow Removal Driveway and walkway clearing, salting, and seasonal contracts" [ref=e114] [cursor=pointer]:
              - paragraph [ref=e115]: Snow Removal
              - paragraph [ref=e116]: Driveway and walkway clearing, salting, and seasonal contracts
            - button "Tree Services Trimming, removal, stump grinding, and emergency tree work" [ref=e117] [cursor=pointer]:
              - paragraph [ref=e118]: Tree Services
              - paragraph [ref=e119]: Trimming, removal, stump grinding, and emergency tree work
            - button "Waterproofing Basement waterproofing, sump pump install, foundation crack repair" [ref=e120] [cursor=pointer]:
              - paragraph [ref=e121]: Waterproofing
              - paragraph [ref=e122]: Basement waterproofing, sump pump install, foundation crack repair
            - button "Window Cleaning Interior and exterior window washing, screens, sills, and tracks" [ref=e123] [cursor=pointer]:
              - paragraph [ref=e124]: Window Cleaning
              - paragraph [ref=e125]: Interior and exterior window washing, screens, sills, and tracks
    - region "Notifications (F8)":
      - list
  - img
```

# Test source

```ts
  21  | 
  22  | async function login(page: Page, email: string, password: string) {
  23  |   await page.goto('/login');
  24  |   await dismissCookieConsent(page);
  25  |   // Wait for the page to hydrate (Wasp SSR)
  26  |   await page.locator('input[type="email"]').waitFor({ state: 'visible', timeout: 15000 });
  27  |   await page.locator('input[type="email"]').fill(email);
  28  | 
  29  |   // Default mode is OTP — switch to password mode
  30  |   const pwToggle = page.getByRole('button', { name: /sign in with password/i });
  31  |   if (await pwToggle.isVisible({ timeout: 5000 }).catch(() => false)) {
  32  |     await pwToggle.click();
  33  |   }
  34  | 
  35  |   // Wait for password field to appear after toggling mode
  36  |   await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 5000 });
  37  |   await page.locator('input[type="password"]').fill(password);
  38  |   await page.getByRole('button', { name: /sign in/i }).click();
  39  | 
  40  |   // Wait for post-login redirect (onboarding for new users, dashboard for returning)
  41  |   await page.waitForURL(
  42  |     /\/(dashboard|onboarding)/,
  43  |     { timeout: 20000 }
  44  |   ).catch(async () => {
  45  |     // Fallback: if redirect didn't match expected routes, the page still needs to be visible
  46  |     await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  47  |   });
  48  | }
  49  | 
  50  | test.describe('Consumer — authenticated flow', () => {
  51  |   test.beforeEach(async ({ page }) => {
  52  |     await login(page, CONSUMER_EMAIL, CONSUMER_PASSWORD);
  53  |     await dismissCookieConsent(page);
  54  |   });
  55  | 
  56  |   test('/dashboard — loads with heading', async ({ page }) => {
  57  |     await page.goto('/dashboard');
  58  |     await dismissCookieConsent(page);
  59  |     await expect(page).not.toHaveURL(/\/login/);
  60  |     // Either a Welcome heading or a generic Dashboard heading
  61  |     await expect(
  62  |       page.locator('h1, h2').first()
  63  |     ).toBeVisible();
  64  |   });
  65  | 
  66  |   test('/my-requests — loads, shows requests or empty state', async ({ page }) => {
  67  |     await page.goto('/my-requests');
  68  |     await dismissCookieConsent(page);
  69  |     await expect(page).not.toHaveURL(/\/login/);
  70  |     // h1 always present on this page — avoid strict mode from .or() matching multiple elements
  71  |     await expect(page.locator('h1').first()).toBeVisible();
  72  |   });
  73  | 
  74  |   test('/rewards — loads and shows balance or rewards section', async ({ page }) => {
  75  |     await page.goto('/rewards');
  76  |     await dismissCookieConsent(page);
  77  |     await expect(page).not.toHaveURL(/\/login/);
  78  |     await expect(page.locator('h1, h2').first()).toBeVisible();
  79  |     // Should show points or rewards content
  80  |     await expect(
  81  |       page.getByText(/point/i)
  82  |         .or(page.getByText(/reward/i))
  83  |         .or(page.getByText(/balance/i))
  84  |         .first()
  85  |     ).toBeVisible();
  86  |   });
  87  | 
  88  |   test('/referral — loads and shows referral code section', async ({ page }) => {
  89  |     await page.goto('/referral');
  90  |     await dismissCookieConsent(page);
  91  |     await expect(page).not.toHaveURL(/\/login/);
  92  |     await expect(page.locator('h1, h2').first()).toBeVisible();
  93  |     // Should show a referral code area
  94  |     await expect(
  95  |       page.locator('code')
  96  |         .or(page.getByText(/referral code/i))
  97  |         .or(page.getByText(/refer/i))
  98  |         .first()
  99  |     ).toBeVisible();
  100 |   });
  101 | 
  102 |   test('/analytics — loads', async ({ page }) => {
  103 |     await page.goto('/analytics');
  104 |     await dismissCookieConsent(page);
  105 |     await expect(page).not.toHaveURL(/\/login/);
  106 |     await expect(page.locator('body')).toBeVisible();
  107 |   });
  108 | 
  109 |   test('/help — loads as authenticated user', async ({ page }) => {
  110 |     await page.goto('/help');
  111 |     await dismissCookieConsent(page);
  112 |     await expect(page).not.toHaveURL(/\/login/);
  113 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  114 |   });
  115 | 
  116 |   test('/request-service — loads and shows step 1 of form', async ({ page }) => {
  117 |     await page.goto('/request-service');
  118 |     await dismissCookieConsent(page);
  119 |     await expect(page).not.toHaveURL(/\/login/);
  120 |     // Step 1 should show service selection — look for the category selection heading
> 121 |     await expect(page.getByRole('heading', { name: /free quotes/i })).toBeVisible();
      |                                                                       ^ Error: expect(locator).toBeVisible() failed
  122 |   });
  123 | 
  124 |   test('/request-service — can select a category', async ({ page }) => {
  125 |     await page.goto('/request-service');
  126 |     await dismissCookieConsent(page);
  127 |     // Look for category cards or buttons
  128 |     const categoryCard = page.locator('[class*="card"]').first()
  129 |       .or(page.getByRole('button').filter({ hasText: /handyman|plumbing|smart.home/i }).first());
  130 |     if (await categoryCard.isVisible({ timeout: 5000 }).catch(() => false)) {
  131 |       await categoryCard.click();
  132 |       // After clicking, should advance or show qualifier questions
  133 |       await expect(
  134 |         page.getByText(/repair|maintenance|describe/i).first()
  135 |           .or(page.locator('textarea').first())
  136 |           .or(page.locator('[class*="step"]').first())
  137 |       ).toBeVisible({ timeout: 5000 });
  138 |     }
  139 |   });
  140 | });
  141 | 
```