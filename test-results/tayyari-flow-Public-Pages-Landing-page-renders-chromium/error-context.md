# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tayyari-flow.spec.ts >> Public Pages >> Landing page renders
- Location: tests/e2e/tayyari-flow.spec.ts:153:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading')
Expected: visible
Error: strict mode violation: getByRole('heading') resolved to 51 elements:
    1) <h1 class="mt-6 max-w-3xl text-balance text-[42px] font-bold leading-[1.02] text-[#FEFEFD] sm:text-6xl lg:text-7xl">Find trusted local services without the back-and-…</h1> aka getByRole('heading', { name: 'Find trusted local services' })
    2) <h2 class="text-balance text-[34px] font-bold leading-tight text-[#1D1C27] sm:text-[42px]">Finding a reliable pro should not feel like detec…</h2> aka getByRole('heading', { name: 'Finding a reliable pro should' })
    3) <h3 class="text-base font-semibold text-[#232323]">Missed calls</h3> aka getByRole('heading', { name: 'Missed calls' })
    4) <h3 class="text-base font-semibold text-[#232323]">Incomplete details</h3> aka getByRole('heading', { name: 'Incomplete details' })
    5) <h3 class="text-base font-semibold text-[#232323]">No-shows</h3> aka getByRole('heading', { name: 'No-shows' })
    6) <h3 class="text-base font-semibold text-[#232323]">Scattered messages</h3> aka getByRole('heading', { name: 'Scattered messages' })
    7) <h3 class="text-base font-semibold text-[#232323]">Unclear fit</h3> aka getByRole('heading', { name: 'Unclear fit' })
    8) <h3 class="text-base font-semibold text-[#232323]">Poor follow-up</h3> aka getByRole('heading', { name: 'Poor follow-up' })
    9) <h2 class="text-balance text-[34px] font-bold leading-tight text-[#1D1C27] sm:text-[42px]">One place to request local home services.</h2> aka getByRole('heading', { name: 'One place to request local' })
    10) <h3 class="text-base font-semibold text-[#232323]">Choose</h3> aka getByRole('heading', { name: 'Choose' })
    ...

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]: Local home services are live for request intake.
        - link "Request Service" [ref=e6] [cursor=pointer]:
          - /url: /request-service
      - banner [ref=e7]:
        - navigation "Global" [ref=e9]:
          - generic [ref=e10]:
            - link "Worki Worki" [ref=e11] [cursor=pointer]:
              - /url: /
              - img "Worki" [ref=e12]
              - generic [ref=e13]: Worki
            - list [ref=e14]:
              - listitem [ref=e15]:
                - link "HVAC" [ref=e16] [cursor=pointer]:
                  - /url: /hvac
              - listitem [ref=e17]:
                - link "Handyman" [ref=e18] [cursor=pointer]:
                  - /url: /handyman
              - listitem [ref=e19]:
                - link "Appliance Repair" [ref=e20] [cursor=pointer]:
                  - /url: /appliance-repair
              - listitem [ref=e21]:
                - link "Services" [ref=e22] [cursor=pointer]:
                  - /url: /services
              - listitem [ref=e23]:
                - link "How it Works" [ref=e24] [cursor=pointer]:
                  - /url: /how-rewards-work
              - listitem [ref=e25]:
                - link "For Pros" [ref=e26] [cursor=pointer]:
                  - /url: /providers
              - listitem [ref=e27]:
                - link "Contact" [ref=e28] [cursor=pointer]:
                  - /url: /contact
          - list [ref=e30]:
            - generic [ref=e32] [cursor=pointer]:
              - checkbox [ref=e33]
              - generic [ref=e34]:
                - img [ref=e36]
                - img [ref=e43]
      - main [ref=e46]:
        - generic [ref=e49]:
          - generic [ref=e50]:
            - generic [ref=e51]:
              - img [ref=e52]
              - text: Live local service requests
            - heading "Find trusted local services without the back-and-forth." [level=1] [ref=e54]
            - paragraph [ref=e55]: Worki helps homeowners submit clear requests for HVAC, handyman, plumbing, electrical, appliance repair, and smart home services.
            - generic [ref=e56]:
              - link "Request Service" [ref=e57] [cursor=pointer]:
                - /url: /request-service
                - text: Request Service
                - img [ref=e58]
              - link "Become a Provider" [ref=e60] [cursor=pointer]:
                - /url: /providers/apply
            - generic [ref=e61]:
              - generic [ref=e62]:
                - img [ref=e64]
                - text: Live service request form
              - generic [ref=e66]:
                - img [ref=e68]
                - text: HVAC, plumbing, electrical
              - generic [ref=e70]:
                - img [ref=e72]
                - text: Handyman, appliance, smart home
              - generic [ref=e74]:
                - img [ref=e76]
                - text: Built for homeowners and pros
          - generic [ref=e78]:
            - generic [ref=e80]:
              - img [ref=e81]
              - text: Request update
            - generic [ref=e87]:
              - generic [ref=e88]:
                - generic [ref=e89]:
                  - img [ref=e90]
                  - generic [ref=e93]: What service do you need?
                - button "Start request" [ref=e94]
              - generic [ref=e95]:
                - generic [ref=e96]:
                  - generic [ref=e98]:
                    - img [ref=e100]
                    - generic [ref=e103]:
                      - paragraph [ref=e105]: HVAC repair
                      - paragraph [ref=e106]: Heating, cooling, maintenance
                      - generic [ref=e107]:
                        - generic [ref=e108]: Service category selected
                        - generic [ref=e109]: Supported
                  - generic [ref=e111]:
                    - img [ref=e113]
                    - generic [ref=e116]:
                      - paragraph [ref=e118]: Plumbing
                      - paragraph [ref=e119]: Leaks, drains, fixtures
                      - generic [ref=e120]:
                        - generic [ref=e121]: Postal code captured
                        - generic [ref=e122]: Supported
                  - generic [ref=e124]:
                    - img [ref=e126]
                    - generic [ref=e129]:
                      - paragraph [ref=e131]: Handyman
                      - paragraph [ref=e132]: Handyman
                      - generic [ref=e133]:
                        - generic [ref=e134]: Schedule preference added
                        - generic [ref=e135]: Supported
                - generic [ref=e136]:
                  - generic [ref=e137]:
                    - generic [ref=e138]:
                      - paragraph [ref=e139]: Request details
                      - img [ref=e140]
                    - generic [ref=e141]:
                      - generic [ref=e142]:
                        - generic [ref=e143]: Service category selected
                        - generic [ref=e144]: Added
                      - generic [ref=e145]:
                        - generic [ref=e146]: Postal code captured
                        - generic [ref=e147]: Added
                  - generic [ref=e148]:
                    - generic [ref=e149]:
                      - paragraph [ref=e150]: Request status
                      - img [ref=e151]
                    - generic [ref=e154]:
                      - generic [ref=e155]:
                        - img [ref=e157]
                        - text: Service selected
                      - generic [ref=e159]:
                        - img [ref=e161]
                        - text: Details captured
                      - generic [ref=e163]: Ready to submit
        - generic [ref=e167]:
          - generic [ref=e168]:
            - paragraph [ref=e169]: Local-first
            - paragraph [ref=e170]: Service model
          - generic [ref=e171]:
            - paragraph [ref=e172]: Select pros
            - paragraph [ref=e173]: Provider onboarding
          - generic [ref=e174]:
            - paragraph [ref=e175]: One place
            - paragraph [ref=e176]: Bookings, messages, updates
        - generic [ref=e178]:
          - generic [ref=e179]:
            - paragraph [ref=e180]: The problem
            - heading "Finding a reliable pro should not feel like detective work." [level=2] [ref=e181]
            - paragraph [ref=e182]: Most homeowners still rely on group chats, old referrals, missed calls, and directories that do not tell the full story.
          - generic [ref=e183]:
            - article [ref=e184]:
              - img [ref=e186]
              - heading "Missed calls" [level=3] [ref=e189]
              - paragraph [ref=e190]: You explain the same job again and again.
            - article [ref=e191]:
              - img [ref=e193]
              - heading "Incomplete details" [level=3] [ref=e196]
              - paragraph [ref=e197]: Important job context gets missed in calls and texts.
            - article [ref=e198]:
              - img [ref=e200]
              - heading "No-shows" [level=3] [ref=e203]
              - paragraph [ref=e204]: Your day gets blocked, then the provider disappears.
            - article [ref=e205]:
              - img [ref=e207]
              - heading "Scattered messages" [level=3] [ref=e209]
              - paragraph [ref=e210]: Details live across texts, calls, WhatsApp, and email.
            - article [ref=e211]:
              - img [ref=e213]
              - heading "Unclear fit" [level=3] [ref=e216]
              - paragraph [ref=e217]: It is not always obvious which service category to request.
            - article [ref=e218]:
              - img [ref=e220]
              - heading "Poor follow-up" [level=3] [ref=e222]
              - paragraph [ref=e223]: You are left chasing updates after requesting help.
        - generic [ref=e226]:
          - generic [ref=e227]:
            - paragraph [ref=e228]: The solution
            - heading "One place to request local home services." [level=2] [ref=e229]
            - paragraph [ref=e230]: Worki turns a messy service request into a structured intake flow so homeowners can share the right details from the start.
          - generic [ref=e231]:
            - article [ref=e232]:
              - img [ref=e234]
              - heading "Choose" [level=3] [ref=e237]
              - paragraph [ref=e238]: Choose the service you need and describe the job.
            - article [ref=e239]:
              - img [ref=e241]
              - heading "Submit" [level=3] [ref=e244]
              - paragraph [ref=e245]: Send the request with your location, schedule, urgency, and contact details.
            - article [ref=e246]:
              - img [ref=e248]
              - heading "Coordinate" [level=3] [ref=e251]
              - paragraph [ref=e252]: Worki captures the details needed to coordinate next steps.
            - article [ref=e253]:
              - img [ref=e255]
              - heading "Track" [level=3] [ref=e258]
              - paragraph [ref=e259]: Follow request status and appointment details from your account.
        - generic [ref=e261]:
          - generic [ref=e262]:
            - paragraph [ref=e263]: Marketplace categories
            - heading "The service categories available in Worki today." [level=2] [ref=e264]
            - paragraph [ref=e265]: Request HVAC, handyman, plumbing, electrical, appliance repair, or smart home help from the live service form.
          - generic [ref=e266]:
            - article [ref=e267]:
              - generic [ref=e268]:
                - img [ref=e270]
                - img [ref=e274]
              - heading "HVAC" [level=3] [ref=e276]
              - paragraph [ref=e277]: Repairs, tune-ups, installs, and seasonal maintenance.
            - article [ref=e278]:
              - generic [ref=e279]:
                - img [ref=e281]
                - img [ref=e285]
              - heading "Plumbing" [level=3] [ref=e287]
              - paragraph [ref=e288]: Leaks, fixtures, drains, water heaters, and urgent repairs.
            - article [ref=e289]:
              - generic [ref=e290]:
                - img [ref=e292]
                - img [ref=e298]
              - heading "Electrical" [level=3] [ref=e300]
              - paragraph [ref=e301]: Panels, outlets, fixtures, safety checks, and installations.
            - article [ref=e302]:
              - generic [ref=e303]:
                - img [ref=e305]
                - img [ref=e309]
              - heading "Appliance Repair" [level=3] [ref=e311]
              - paragraph [ref=e312]: Kitchen, laundry, diagnosis, repair, and replacement support.
            - article [ref=e313]:
              - generic [ref=e314]:
                - img [ref=e316]
                - img [ref=e320]
              - heading "Handyman" [level=3] [ref=e322]
              - paragraph [ref=e323]: Repairs, mounting, assembly, small projects, and punch lists.
            - article [ref=e324]:
              - generic [ref=e325]:
                - img [ref=e327]
                - img [ref=e329]
              - heading "Smart Home" [level=3] [ref=e331]
              - paragraph [ref=e332]: Cameras, thermostats, locks, sensors, and connected devices.
        - generic [ref=e334]:
          - generic [ref=e335]:
            - paragraph [ref=e336]: Two-sided marketplace
            - heading "Simple for homeowners. Useful for providers." [level=2] [ref=e337]
            - paragraph [ref=e338]: The customer journey and provider workflow are designed together so every request has better context from the start.
          - generic [ref=e339]:
            - generic [ref=e340]:
              - generic [ref=e341]:
                - img [ref=e343]
                - generic [ref=e347]:
                  - paragraph [ref=e348]: For customers
                  - paragraph [ref=e349]: Less chasing. More clarity.
              - generic [ref=e350]:
                - article [ref=e351]:
                  - generic [ref=e352]: "01"
                  - heading "Describe the job" [level=3] [ref=e353]
                  - paragraph [ref=e354]: Tell Worki what happened, where you are, and when you need help.
                - article [ref=e355]:
                  - generic [ref=e356]: "02"
                  - heading "Share details" [level=3] [ref=e357]
                  - paragraph [ref=e358]: Add location, urgency, schedule, and contact information.
                - article [ref=e359]:
                  - generic [ref=e360]: "03"
                  - heading "Submit the request" [level=3] [ref=e361]
                  - paragraph [ref=e362]: Send the request through the live Worki intake flow.
                - article [ref=e363]:
                  - generic [ref=e364]: "04"
                  - heading "Track next steps" [level=3] [ref=e365]
                  - paragraph [ref=e366]: Use your account to follow request and appointment updates.
            - generic [ref=e367]:
              - generic [ref=e368]:
                - img [ref=e370]
                - generic [ref=e374]:
                  - paragraph [ref=e375]: For providers
                  - paragraph [ref=e376]: Better leads. Less admin.
              - generic [ref=e377]:
                - article [ref=e378]:
                  - generic [ref=e379]: "01"
                  - heading "Create your profile" [level=3] [ref=e380]
                  - paragraph [ref=e381]: Show your services, areas, credentials, and availability.
                - article [ref=e382]:
                  - generic [ref=e383]: "02"
                  - heading "Receive qualified leads" [level=3] [ref=e384]
                  - paragraph [ref=e385]: Receive requests for supported categories and service areas.
                - article [ref=e386]:
                  - generic [ref=e387]: "03"
                  - heading "Schedule the job" [level=3] [ref=e388]
                  - paragraph [ref=e389]: Confirm the appointment and keep the customer updated.
                - article [ref=e390]:
                  - generic [ref=e391]: "04"
                  - heading "Manage the work" [level=3] [ref=e392]
                  - paragraph [ref=e393]: Keep accepted requests, appointments, and updates organized.
        - generic [ref=e396]:
          - generic [ref=e397]:
            - generic [ref=e398]:
              - img [ref=e399]
              - text: Internal roadmap
            - generic [ref=e402]:
              - heading "Future assistance stays behind the scenes." [level=2] [ref=e403]
              - paragraph [ref=e404]: Any automation is framed as internal support for clearer requests and operations. Worki's live customer flow is the service request form.
            - link "Request Service" [ref=e405] [cursor=pointer]:
              - /url: /request-service
          - generic [ref=e406]:
            - article [ref=e407]:
              - img [ref=e409]
              - heading "Structured intake" [level=3] [ref=e412]
              - paragraph [ref=e413]: The live form captures the essentials before a request is sent.
            - article [ref=e414]:
              - img [ref=e416]
              - heading "Category clarity" [level=3] [ref=e419]
              - paragraph [ref=e420]: Supported service types mirror the request form categories.
            - article [ref=e421]:
              - img [ref=e423]
              - heading "Service-area context" [level=3] [ref=e426]
              - paragraph [ref=e427]: Postal code and category details help Worki understand where coverage is needed.
            - article [ref=e428]:
              - img [ref=e430]
              - heading "Future internal assistance" [level=3] [ref=e433]
              - paragraph [ref=e434]: Automation may support internal request triage later, but it is not presented as a customer-facing promise.
        - generic [ref=e436]:
          - generic [ref=e437]:
            - paragraph [ref=e438]: Trust layer
            - heading "Built for trust from the first click." [level=2] [ref=e439]
            - paragraph [ref=e440]: Worki gives customers and providers shared context, clearer expectations, and a local-first marketplace foundation.
          - generic [ref=e441]:
            - article [ref=e442]:
              - img [ref=e444]
              - heading "Verified providers" [level=3] [ref=e447]
              - paragraph [ref=e448]: Profiles can include business details, service categories, service areas, and approval status.
            - article [ref=e449]:
              - img [ref=e451]
              - heading "Service records" [level=3] [ref=e454]
              - paragraph [ref=e455]: Request and appointment history can stay tied to the customer account.
            - article [ref=e456]:
              - img [ref=e458]
              - heading "Clear communication" [level=3] [ref=e460]
              - paragraph [ref=e461]: Booking details, messages, and status updates stay connected to the job.
            - article [ref=e462]:
              - img [ref=e464]
              - heading "Local-first marketplace" [level=3] [ref=e467]
              - paragraph [ref=e468]: Worki starts city by city, building supply quality before scaling.
        - generic [ref=e471]:
          - generic [ref=e472]:
            - generic [ref=e473]:
              - img [ref=e474]
              - text: Provider applications open
            - generic [ref=e477]:
              - heading "Apply to become a Worki provider." [level=2] [ref=e478]
              - paragraph [ref=e479]: Providers can apply to be considered for categories and service areas supported by the marketplace.
            - generic [ref=e480]:
              - link "Become a Provider" [ref=e481] [cursor=pointer]:
                - /url: /providers/apply
              - link "Request Service" [ref=e482] [cursor=pointer]:
                - /url: /request-service
            - paragraph [ref=e483]: Provider availability depends on category and service area.
          - generic [ref=e484]:
            - article [ref=e485]:
              - img [ref=e487]
              - heading "Receive service requests" [level=3] [ref=e491]
              - paragraph [ref=e492]: Connect with homeowners who submit supported request types.
            - article [ref=e493]:
              - img [ref=e495]
              - heading "Category and area fit" [level=3] [ref=e499]
              - paragraph [ref=e500]: Apply for the services and locations your business supports.
            - article [ref=e501]:
              - img [ref=e503]
              - heading "Reduce admin" [level=3] [ref=e507]
              - paragraph [ref=e508]: Keep requests, appointments, messages, and follow-ups organized in one flow.
            - article [ref=e509]:
              - img [ref=e511]
              - heading "Build local visibility" [level=3] [ref=e515]
              - paragraph [ref=e516]: Use a clear profile and accepted jobs to build marketplace presence.
        - generic [ref=e519]:
          - generic [ref=e520]:
            - paragraph [ref=e521]: Marketplace foundation
            - heading "Starting local. Built to scale." [level=2] [ref=e522]
            - paragraph [ref=e523]: Worki operates locally first so the marketplace can grow around supported categories, provider coverage, and real service demand.
          - generic [ref=e524]:
            - article [ref=e525]:
              - paragraph [ref=e526]: Local marketplace foundation
              - heading "Built around select local providers." [level=3] [ref=e527]
              - paragraph [ref=e528]: Worki is starting city by city so provider coverage and customer trust can grow around real requests.
            - article [ref=e529]:
              - img [ref=e531]
              - heading "Select-provider model" [level=3] [ref=e534]
              - paragraph [ref=e535]: Supply quality comes before broad coverage or vanity metrics.
            - article [ref=e536]:
              - img [ref=e538]
              - heading "Local service rollout" [level=3] [ref=e541]
              - paragraph [ref=e542]: Coverage expands by city, category, and provider availability.
            - article [ref=e543]:
              - img [ref=e545]
              - heading "Marketplace foundation" [level=3] [ref=e549]
              - paragraph [ref=e550]: Requests, appointments, provider applications, and status updates can scale from the same structure.
        - generic [ref=e552]:
          - generic [ref=e553]:
            - paragraph [ref=e554]: FAQ
            - heading "Questions before requesting service?" [level=2] [ref=e555]
            - paragraph [ref=e556]: Straight answers for homeowners and providers.
          - generic [ref=e558]:
            - group [ref=e559]:
              - generic "Is Worki free to use? +" [ref=e560] [cursor=pointer]:
                - text: Is Worki free to use?
                - generic [ref=e561]: +
            - group [ref=e562]:
              - generic "How are providers verified? +" [ref=e563] [cursor=pointer]:
                - text: How are providers verified?
                - generic [ref=e564]: +
            - group [ref=e565]:
              - generic "Where is Worki available? +" [ref=e566] [cursor=pointer]:
                - text: Where is Worki available?
                - generic [ref=e567]: +
            - group [ref=e568]:
              - generic "Can providers join now? +" [ref=e569] [cursor=pointer]:
                - text: Can providers join now?
                - generic [ref=e570]: +
            - group [ref=e571]:
              - generic "Does Worki use automation? +" [ref=e572] [cursor=pointer]:
                - text: Does Worki use automation?
                - generic [ref=e573]: +
            - group [ref=e574]:
              - generic "How do bookings work? +" [ref=e575] [cursor=pointer]:
                - text: How do bookings work?
                - generic [ref=e576]: +
        - generic [ref=e579]:
          - generic [ref=e580]:
            - img [ref=e581]
            - text: Live requests for supported service categories
          - heading "Stop chasing service providers. Start with Worki." [level=2] [ref=e584]
          - paragraph [ref=e585]: Submit a home service request now, or apply to become a provider for supported categories and service areas.
          - generic [ref=e586]:
            - link "Request Service" [ref=e587] [cursor=pointer]:
              - /url: /request-service
            - link "Become a Provider" [ref=e588] [cursor=pointer]:
              - /url: /providers/apply
        - generic [ref=e590]:
          - paragraph [ref=e591]: Worki
          - paragraph [ref=e592]: Trusted local services, handled in one place.
          - generic [ref=e593]:
            - link "Privacy" [ref=e594] [cursor=pointer]:
              - /url: /privacy
            - link "Terms" [ref=e595] [cursor=pointer]:
              - /url: /terms
    - region "Notifications (F8)":
      - list
  - img
```

# Test source

```ts
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
> 156 |     await expect(page.getByRole('heading')).toBeVisible();
      |                                             ^ Error: expect(locator).toBeVisible() failed
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