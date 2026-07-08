# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: consumer-journey.spec.ts >> Consumer — Request Service (get-quotes) >> get-quotes wizard loads — Step 1 category selection
- Location: tests/e2e/consumer-journey.spec.ts:363:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1, h2').filter({ hasText: /quote|service|category/i }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('h1, h2').filter({ hasText: /quote|service|category/i }).first()

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
  273 |     if (await consumerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  274 |       await consumerBtn.click();
  275 |     }
  276 |     await page.getByRole('button', { name: /next|continue/i }).click();
  277 | 
  278 |     // Step 2: try to advance without filling required fields
  279 |     await page.getByRole('button', { name: /next|continue|find a pro|complete/i }).click();
  280 | 
  281 |     // Validation error should appear
  282 |     await expect(
  283 |       page.getByText(/required|is needed|can't be empty/i).first()
  284 |     ).toBeVisible({ timeout: 3000 });
  285 |   });
  286 | 
  287 |   test('Consumer onboarding — navigating between steps', async ({ page }) => {
  288 |     await loginConsumer(page);
  289 | 
  290 |     if (page.url().includes('/dashboard')) return;
  291 | 
  292 |     // Select role
  293 |     const consumerBtn = page.getByRole('button', { name: /homeowner|consumer/i }).first();
  294 |     if (await consumerBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  295 |       await consumerBtn.click();
  296 |     }
  297 |     await page.getByRole('button', { name: /next|continue/i }).click();
  298 | 
  299 |     // Back button should work
  300 |     const backBtn = page.getByRole('button', { name: /back/i });
  301 |     if (await backBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  302 |       await backBtn.click();
  303 |       // Should return to step 1
  304 |       await expect(page.getByText(/role/i).first()).toBeVisible({ timeout: 3000 });
  305 |     }
  306 |   });
  307 | 
  308 |   test('Consumer completes full onboarding → redirected to get-quotes', async ({ page }) => {
  309 |     await loginConsumer(page);
  310 | 
  311 |     if (page.url().includes('/dashboard')) {
  312 |       // Already onboarded — verify dashboard works
  313 |       await expect(page.locator('body')).toBeVisible();
  314 |       return;
  315 |     }
  316 | 
  317 |     // Step 1: select consumer role
  318 |     const consumerBtn = page.getByRole('button', { name: /homeowner|consumer/i }).first();
  319 |     await consumerBtn.click();
  320 |     await page.getByRole('button', { name: /next/i }).click();
  321 | 
  322 |     // Step 2: fill profile
  323 |     await page.locator('input[name*="first"], input[placeholder*="first" i]')
  324 |       .fill('Test');
  325 |     await page.locator('input[name*="phone"], input[placeholder*="phone" i]')
  326 |       .fill('4165551234');
  327 |     await page.locator('input[name*="postal"], input[placeholder*="postal" i]')
  328 |       .fill('M5V 3A8');
  329 | 
  330 |     await page.getByRole('button', { name: /next/i }).click();
  331 | 
  332 |     // Step 3 (consumer): "Ready to get quotes?" page
  333 |     await expect(
  334 |       page.getByText(/ready|find a pro|get quotes/i).first()
  335 |     ).toBeVisible({ timeout: 5000 });
  336 | 
  337 |     // Click "Find a local pro" — should go to /get-quotes
  338 |     const ctaBtn = page.getByRole('button', { name: /find a pro|get quotes/i }).first();
  339 |     await ctaBtn.click();
  340 | 
  341 |     await expect(page).toHaveURL(/\/get-quotes/, { timeout: 10000 });
  342 |   });
  343 | });
  344 | 
  345 | // ---------------------------------------------------------------------------
  346 | // Request Service (Guest) — auth-first flow
  347 | // ---------------------------------------------------------------------------
  348 | 
  349 | test.describe('Consumer — Request Service (get-quotes)', () => {
  350 |   async function loginConsumer(page: Page): Promise<void> {
  351 |     const email = process.env.CONSUMER_EMAIL ?? 'consumer@thehelper.ca';
  352 |     const password = process.env.CONSUMER_PASSWORD ?? 'HelperTest123';
  353 |     await page.goto('/login');
  354 |     await dismissCookieConsent(page);
  355 |     const pwBtn = page.getByRole('button', { name: /sign in with password/i });
  356 |     if (await pwBtn.isVisible({ timeout: 3000 }).catch(() => false)) await pwBtn.click();
  357 |     await page.locator('input[type="email"]').fill(email);
  358 |     await page.locator('input[type="password"]').fill(password);
  359 |     await page.getByRole('button', { name: /sign in/i }).click();
  360 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 }).catch(() => {});
  361 |   }
  362 | 
  363 |   test('get-quotes wizard loads — Step 1 category selection', async ({ page }) => {
  364 |     await loginConsumer(page);
  365 |     await dismissCookieConsent(page);
  366 | 
  367 |     await page.goto('/get-quotes');
  368 |     await waitForPageReady(page);
  369 | 
  370 |     // Should show category/service selection
  371 |     await expect(
  372 |       page.locator('h1, h2').filter({ hasText: /quote|service|category/i }).first()
> 373 |     ).toBeVisible({ timeout: 10000 });
      |       ^ Error: expect(locator).toBeVisible() failed
  374 |   });
  375 | 
  376 |   test('get-quotes wizard — user can select a service category', async ({ page }) => {
  377 |     await loginConsumer(page);
  378 |     await page.goto('/get-quotes');
  379 |     await waitForPageReady(page);
  380 | 
  381 |     // Click first visible category card
  382 |     const card = page.locator('[class*="card"], button[class*="rounded"]').first();
  383 |     if (await card.isVisible({ timeout: 5000 }).catch(() => false)) {
  384 |       await card.click();
  385 | 
  386 |       // Should advance — look for step indicator or next input
  387 |       await expect(
  388 |         page.locator('textarea, input, [class*="step"]').first()
  389 |       ).toBeVisible({ timeout: 5000 });
  390 |     }
  391 |   });
  392 | 
  393 |   test('get-quotes wizard — multi-step form navigates', async ({ page }) => {
  394 |     await loginConsumer(page);
  395 |     await page.goto('/get-quotes');
  396 |     await waitForPageReady(page);
  397 | 
  398 |     // Step through if categories are visible
  399 |     const category = page.locator('button, [class*="card"]').filter({ hasText: /handyman|plumbing|smart.home/i }).first();
  400 |     if (await category.isVisible({ timeout: 5000 }).catch(() => false)) {
  401 |       await category.click();
  402 |       await page.waitForTimeout(500);
  403 | 
  404 |       // Description field should appear
  405 |       const textarea = page.locator('textarea').first();
  406 |       if (await textarea.isVisible({ timeout: 5000 })) {
  407 |         await textarea.fill('Need plumbing repair — leaking pipe under kitchen sink.');
  408 |       }
  409 | 
  410 |       // Next button
  411 |       const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
  412 |       if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  413 |         await nextBtn.click();
  414 |         await expect(page.locator('body')).toBeVisible();
  415 |       }
  416 |     }
  417 |   });
  418 | 
  419 |   test('submitting a service request shows confirmation', async ({ page }) => {
  420 |     await loginConsumer(page);
  421 |     await page.goto('/get-quotes');
  422 |     await waitForPageReady(page);
  423 | 
  424 |     // Try to go as far as possible through the wizard
  425 |     const category = page.locator('button, [class*="card"]').first();
  426 |     if (await category.isVisible({ timeout: 5000 }).catch(() => false)) {
  427 |       await category.click();
  428 |       await page.waitForTimeout(500);
  429 | 
  430 |       const textarea = page.locator('textarea').first();
  431 |       if (await textarea.isVisible({ timeout: 3000 })) {
  432 |         await textarea.fill('Test service request from E2E test.');
  433 |       }
  434 | 
  435 |       const nextBtn = page.getByRole('button', { name: /next|continue|submit|request/i }).first();
  436 |       if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
  437 |         await nextBtn.click();
  438 |         // Should show confirmation or proceed to next step
  439 |         await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  440 |       }
  441 |     }
  442 |   });
  443 | });
  444 | 
  445 | // ---------------------------------------------------------------------------
  446 | // Consumer Dashboard — post-onboarding authenticated pages
  447 | // ---------------------------------------------------------------------------
  448 | 
  449 | test.describe('Consumer — Authenticated Dashboard Pages', () => {
  450 |   const CONSUMER_EMAIL = process.env.CONSUMER_EMAIL ?? 'consumer@thehelper.ca';
  451 |   const CONSUMER_PASSWORD = process.env.CONSUMER_PASSWORD ?? 'HelperTest123';
  452 | 
  453 |   async function login(page: Page): Promise<void> {
  454 |     await page.goto('/login');
  455 |     await dismissCookieConsent(page);
  456 |     const pwBtn = page.getByRole('button', { name: /sign in with password/i });
  457 |     if (await pwBtn.isVisible({ timeout: 3000 }).catch(() => false)) await pwBtn.click();
  458 |     await page.locator('input[type="email"]').fill(CONSUMER_EMAIL);
  459 |     await page.locator('input[type="password"]').fill(CONSUMER_PASSWORD);
  460 |     await page.getByRole('button', { name: /sign in/i }).click();
  461 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 }).catch(() => {});
  462 |   }
  463 | 
  464 |   test.beforeEach(async ({ page }) => {
  465 |     await login(page);
  466 |     await dismissCookieConsent(page);
  467 |   });
  468 | 
  469 |   test('/dashboard — shows user dashboard', async ({ page }) => {
  470 |     await page.goto('/dashboard');
  471 |     await waitForPageReady(page);
  472 | 
  473 |     // Should be authenticated (not redirected to login)
```