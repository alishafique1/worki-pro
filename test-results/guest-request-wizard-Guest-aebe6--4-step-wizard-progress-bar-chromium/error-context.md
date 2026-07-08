# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: guest-request-wizard.spec.ts >> Guest Wizard — Step 4: Email Verification >> User can see the full 4-step wizard progress bar
- Location: tests/e2e/guest-request-wizard.spec.ts:291:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/get free quotes/i)
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByText(/get free quotes/i)

```

# Page snapshot

```yaml
- generic [ref=e1]:
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
              - link "Services" [ref=e11] [cursor=pointer]:
                - /url: /services
            - listitem [ref=e12]:
              - link "How it Works" [ref=e13] [cursor=pointer]:
                - /url: /how-it-works
            - listitem [ref=e14]:
              - link "For Pros" [ref=e15] [cursor=pointer]:
                - /url: /providers
            - listitem [ref=e16]:
              - link "Contact" [ref=e17] [cursor=pointer]:
                - /url: /contact
          - generic [ref=e18]:
            - link "Log in" [ref=e19] [cursor=pointer]:
              - /url: /login
            - link "Sign up" [ref=e20] [cursor=pointer]:
              - /url: /signup
            - link "Get Help" [ref=e21] [cursor=pointer]:
              - /url: /get-quotes
      - generic [ref=e24]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - img "The Helper" [ref=e27]
            - generic [ref=e28]: The Helper
          - heading "Get matched with a pro" [level=2] [ref=e29]
          - paragraph [ref=e30]: No account needed, no cost — takes 2 minutes
        - generic [ref=e32]:
          - generic [ref=e33]: Service
          - generic [ref=e34]: Questions
          - generic [ref=e35]: Your info
          - generic [ref=e36]: Verify email
        - generic [ref=e40]:
          - heading "What do you need help with?" [level=3] [ref=e41]
          - paragraph [ref=e42]: Select a category to get started.
          - generic [ref=e43]:
            - button "Appliance Repair Washer, dryer, fridge, stove, dishwasher — diagnosis and repair" [ref=e44] [cursor=pointer]:
              - paragraph [ref=e45]: Appliance Repair
              - paragraph [ref=e46]: Washer, dryer, fridge, stove, dishwasher — diagnosis and repair
            - button "Cleaning Regular, deep clean, move-in/out, post-construction, and Airbnb cleans" [ref=e47] [cursor=pointer]:
              - paragraph [ref=e48]: Cleaning
              - paragraph [ref=e49]: Regular, deep clean, move-in/out, post-construction, and Airbnb cleans
            - button "Electrical Wiring, panels, outlets, lighting, and safety inspections" [ref=e50] [cursor=pointer]:
              - paragraph [ref=e51]: Electrical
              - paragraph [ref=e52]: Wiring, panels, outlets, lighting, and safety inspections
            - button "Events Event setup, furniture rentals, tents, AV, and cleanup services" [ref=e53] [cursor=pointer]:
              - paragraph [ref=e54]: Events
              - paragraph [ref=e55]: Event setup, furniture rentals, tents, AV, and cleanup services
            - button "Events & Celebrations Make any occasion unforgettable. Decorators, caterers, entertainment, and event vendors across the GTA." [ref=e56] [cursor=pointer]:
              - paragraph [ref=e57]: Events & Celebrations
              - paragraph [ref=e58]: Make any occasion unforgettable. Decorators, caterers, entertainment, and event vendors across the GTA.
            - button "Fence & Gate Wood, vinyl, chain-link, and aluminum fence install and repair" [ref=e59] [cursor=pointer]:
              - paragraph [ref=e60]: Fence & Gate
              - paragraph [ref=e61]: Wood, vinyl, chain-link, and aluminum fence install and repair
            - button "Flooring Hardwood, tile, laminate, vinyl plank, carpet — supply and install" [ref=e62] [cursor=pointer]:
              - paragraph [ref=e63]: Flooring
              - paragraph [ref=e64]: Hardwood, tile, laminate, vinyl plank, carpet — supply and install
            - button "Garage Door Spring repair, opener install, panel replacement, and seasonal tune-up" [ref=e65] [cursor=pointer]:
              - paragraph [ref=e66]: Garage Door
              - paragraph [ref=e67]: Spring repair, opener install, panel replacement, and seasonal tune-up
            - button "HVAC Heating, ventilation, and air conditioning repairs, tune-ups, and installs" [ref=e68] [cursor=pointer]:
              - paragraph [ref=e69]: HVAC
              - paragraph [ref=e70]: Heating, ventilation, and air conditioning repairs, tune-ups, and installs
            - button "Handyman General home repairs, mounting, assembly, and maintenance" [ref=e71] [cursor=pointer]:
              - paragraph [ref=e72]: Handyman
              - paragraph [ref=e73]: General home repairs, mounting, assembly, and maintenance
            - button "Home Inspection Pre-purchase and annual home inspection with detailed report" [ref=e74] [cursor=pointer]:
              - paragraph [ref=e75]: Home Inspection
              - paragraph [ref=e76]: Pre-purchase and annual home inspection with detailed report
            - button "Junk Removal Furniture, appliances, renovation debris, and estate cleanouts" [ref=e77] [cursor=pointer]:
              - paragraph [ref=e78]: Junk Removal
              - paragraph [ref=e79]: Furniture, appliances, renovation debris, and estate cleanouts
            - button "Landscaping Lawn care, garden beds, interlocking, irrigation, and seasonal cleanup" [ref=e80] [cursor=pointer]:
              - paragraph [ref=e81]: Landscaping
              - paragraph [ref=e82]: Lawn care, garden beds, interlocking, irrigation, and seasonal cleanup
            - button "Locksmith Lock changes, emergency entry, rekeying, and deadbolt installation" [ref=e83] [cursor=pointer]:
              - paragraph [ref=e84]: Locksmith
              - paragraph [ref=e85]: Lock changes, emergency entry, rekeying, and deadbolt installation
            - button "Moving Local moves, packing, furniture assembly, piano moving, and junk removal" [ref=e86] [cursor=pointer]:
              - paragraph [ref=e87]: Moving
              - paragraph [ref=e88]: Local moves, packing, furniture assembly, piano moving, and junk removal
            - button "Painting Interior and exterior painting, drywall prep, colour consultation" [ref=e89] [cursor=pointer]:
              - paragraph [ref=e90]: Painting
              - paragraph [ref=e91]: Interior and exterior painting, drywall prep, colour consultation
            - button "Pest Control Rodent, insect, and wildlife removal — inspection and treatment" [ref=e92] [cursor=pointer]:
              - paragraph [ref=e93]: Pest Control
              - paragraph [ref=e94]: Rodent, insect, and wildlife removal — inspection and treatment
            - button "Plumbing Pipes, drains, water heaters, toilets, and fixture repairs" [ref=e95] [cursor=pointer]:
              - paragraph [ref=e96]: Plumbing
              - paragraph [ref=e97]: Pipes, drains, water heaters, toilets, and fixture repairs
            - button "Pool & Spa Opening, closing, cleaning, equipment repair, and winterization" [ref=e98] [cursor=pointer]:
              - paragraph [ref=e99]: Pool & Spa
              - paragraph [ref=e100]: Opening, closing, cleaning, equipment repair, and winterization
            - button "Renovation Kitchen, bathroom, basement, and general home renovation" [ref=e101] [cursor=pointer]:
              - paragraph [ref=e102]: Renovation
              - paragraph [ref=e103]: Kitchen, bathroom, basement, and general home renovation
            - button "Roofing Shingle repair, full replacement, flat roofs, eavestroughs, and inspections" [ref=e104] [cursor=pointer]:
              - paragraph [ref=e105]: Roofing
              - paragraph [ref=e106]: Shingle repair, full replacement, flat roofs, eavestroughs, and inspections
            - button "Smart Home Smart thermostats, cameras, locks, sensors, and home automation" [ref=e107] [cursor=pointer]:
              - paragraph [ref=e108]: Smart Home
              - paragraph [ref=e109]: Smart thermostats, cameras, locks, sensors, and home automation
            - button "Snow Removal Driveway and walkway clearing, salting, and seasonal contracts" [ref=e110] [cursor=pointer]:
              - paragraph [ref=e111]: Snow Removal
              - paragraph [ref=e112]: Driveway and walkway clearing, salting, and seasonal contracts
            - button "Tree Services Trimming, removal, stump grinding, and emergency tree work" [ref=e113] [cursor=pointer]:
              - paragraph [ref=e114]: Tree Services
              - paragraph [ref=e115]: Trimming, removal, stump grinding, and emergency tree work
            - button "Waterproofing Basement waterproofing, sump pump install, foundation crack repair" [ref=e116] [cursor=pointer]:
              - paragraph [ref=e117]: Waterproofing
              - paragraph [ref=e118]: Basement waterproofing, sump pump install, foundation crack repair
            - button "Window Cleaning Interior and exterior window washing, screens, sills, and tracks" [ref=e119] [cursor=pointer]:
              - paragraph [ref=e120]: Window Cleaning
              - paragraph [ref=e121]: Interior and exterior window washing, screens, sills, and tracks
    - region "Notifications (F8)":
      - list
  - img
  - dialog "We use cookies" [ref=e122]:
    - generic [ref=e123]:
      - generic [ref=e124]:
        - heading "We use cookies" [level=2] [ref=e125]
        - paragraph [ref=e126]: We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookie policy.
      - generic [ref=e128]:
        - button "Accept all" [ref=e129] [cursor=pointer]
        - button "Reject all" [ref=e130] [cursor=pointer]
    - generic [ref=e133]:
      - link "Privacy Policy" [ref=e134] [cursor=pointer]:
        - /url: /privacy
      - link "Terms and Conditions" [ref=e135] [cursor=pointer]:
        - /url: /terms
```

# Test source

```ts
  195 |       page.locator('input[placeholder="L9T 2X5"]').first()
  196 |     ).toBeVisible({ timeout: 5000 });
  197 | 
  198 |     await expect(
  199 |       page.locator('input[placeholder="Jane"]').first()
  200 |     ).toBeVisible({ timeout: 3000 });
  201 |   });
  202 | 
  203 |   test('Step 3 validates required postal code', async ({ page }) => {
  204 |     await navigateToStep3(page);
  205 |     await page.locator('input[placeholder="L9T 2X5"]').first().fill('');
  206 |     await page.locator('input[placeholder="Jane"]').first().fill('Test');
  207 |     await page.locator('input[placeholder*="555"]').first().fill('4165551234');
  208 | 
  209 |     // Click next/continue
  210 |     const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
  211 |     if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  212 |       await nextBtn.click();
  213 |       // Should show postal code validation error
  214 |       await expect(
  215 |         page.getByText(/postal|required|valid/i).first()
  216 |       ).toBeVisible({ timeout: 5000 });
  217 |     }
  218 |   });
  219 | 
  220 |   test('Step 3 advances when contact info is valid', async ({ page }) => {
  221 |     await navigateToStep3(page);
  222 | 
  223 |     // Fill valid contact info
  224 |     await page.locator('input[placeholder="L9T 2X5"]').first().fill('L9T 2X5');
  225 |     await page.locator('input[placeholder="Jane"]').first().fill('Test');
  226 |     await page.locator('input[placeholder*="555" i]').first().fill('4165551234');
  227 | 
  228 |     const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
  229 |     if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  230 |       await nextBtn.click();
  231 |       // Step 4: email verification
  232 |       await expect(
  233 |         page.getByText(/check|verify|email|sent.*code/i).first()
  234 |       ).toBeVisible({ timeout: 8000 });
  235 |     }
  236 |   });
  237 | });
  238 | 
  239 | // ---------------------------------------------------------------------------
  240 | // Step 4: Email Verification (OTP)
  241 | // ---------------------------------------------------------------------------
  242 | 
  243 | test.describe('Guest Wizard — Step 4: Email Verification', () => {
  244 |   async function navigateToStep4(page: Page): Promise<void> {
  245 |     await page.goto('/get-quotes');
  246 |     await dismissCookieConsent(page);
  247 |     await page.waitForLoadState('networkidle');
  248 | 
  249 |     // Step 1: category
  250 |     const cat = page.locator('button[class*="rounded-2xl"]').first();
  251 |     await expect(cat).toBeVisible({ timeout: 10000 });
  252 |     await cat.click();
  253 | 
  254 |     // Step 2: description
  255 |     const textarea = page.locator('textarea').first();
  256 |     if (await textarea.isVisible({ timeout: 5000 }).catch(() => false)) {
  257 |       await textarea.fill('E2E test service request — email verification step.');
  258 |     }
  259 |     const nextBtn1 = page.getByRole('button', { name: /next|continue/i }).first();
  260 |     if (await nextBtn1.isVisible({ timeout: 3000 }).catch(() => false)) await nextBtn1.click();
  261 | 
  262 |     // Step 3: contact info
  263 |     await page.locator('input[placeholder="L9T 2X5"]').first().fill('L9T 2X5');
  264 |     await page.locator('input[placeholder="Jane"]').first().fill('E2E');
  265 |     await page.locator('input[placeholder*="555" i]').first().fill('4165559999');
  266 | 
  267 |     const nextBtn2 = page.getByRole('button', { name: /next|continue/i }).first();
  268 |     if (await nextBtn2.isVisible({ timeout: 3000 }).catch(() => false)) await nextBtn2.click();
  269 |   }
  270 | 
  271 |   test('Step 4 shows OTP code input section', async ({ page }) => {
  272 |     await navigateToStep4(page);
  273 | 
  274 |     // Should show the OTP verification screen with email field and send button
  275 |     // OR already have the code sent if the email field auto-sends
  276 |     await expect(
  277 |       page.getByText(/check|verify|email|sent.*code|codes/i).first()
  278 |     ).toBeVisible({ timeout: 10000 });
  279 | 
  280 |     // Should have either an email input or 6 digit code inputs
  281 |     const emailInput = page.locator('input[type="email"]');
  282 |     const digitInputs = page.locator('input[maxlength="1"], input[inputmode="numeric"][maxlength="1"]');
  283 | 
  284 |     const hasEmail = await emailInput.isVisible({ timeout: 2000 }).catch(() => false);
  285 |     const hasDigits = await digitInputs.first().isVisible({ timeout: 2000 }).catch(() => false);
  286 | 
  287 |     // At least one should be visible
  288 |     expect(hasEmail || hasDigits).toBe(true);
  289 |   });
  290 | 
  291 |   test('User can see the full 4-step wizard progress bar', async ({ page }) => {
  292 |     await page.goto('/get-quotes');
  293 |     await dismissCookieConsent(page);
  294 |     await page.waitForLoadState('networkidle');
> 295 |     await expect(page.getByText(/get free quotes/i)).toBeVisible({ timeout: 10000 });
      |                                                      ^ Error: expect(locator).toBeVisible() failed
  296 | 
  297 |     // The progress bar should show 4 steps: Service, Questions, Your info, Verify email
  298 |     await expect(
  299 |       page.getByText(/service|questions|your info|verify email/i).first()
  300 |     ).toBeVisible({ timeout: 5000 });
  301 |   });
  302 | });
  303 | 
  304 | // ---------------------------------------------------------------------------
  305 | // Auth-aware route redirect behavior
  306 | // ---------------------------------------------------------------------------
  307 | 
  308 | test.describe('Guest Wizard — Auth-aware routing', () => {
  309 |   test('/get-quotes loads without authentication', async ({ page }) => {
  310 |     // Clear cookies to ensure guest state
  311 |     await page.context().clearCookies();
  312 |     await page.goto('/get-quotes');
  313 |     await dismissCookieConsent(page);
  314 |     await waitForPageReady(page);
  315 | 
  316 |     // Wizard page loads with an h2 heading
  317 |     await expect(
  318 |       page.locator('h2').first()
  319 |     ).toBeVisible({ timeout: 10000 });
  320 | 
  321 |     // Guest should NOT be redirected to /login
  322 |     await expect(page).not.toHaveURL(/\/login/);
  323 |   });
  324 | 
  325 |   test('/login redirects to /signup is gone — signup is independent', async ({ page }) => {
  326 |     // This replaced the old /signup → redirect behavior
  327 |     await page.goto('/signup');
  328 |     await dismissCookieConsent(page);
  329 |     await waitForPageReady(page);
  330 | 
  331 |     // Signup should load independently (not redirect to login)
  332 |     await expect(
  333 |       page.locator('input[type="email"]').first()
  334 |     ).toBeVisible({ timeout: 10000 });
  335 |   });
  336 | });
```