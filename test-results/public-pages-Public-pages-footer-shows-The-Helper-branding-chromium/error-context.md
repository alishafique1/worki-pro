# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: public-pages.spec.ts >> Public pages >> footer shows The Helper branding
- Location: tests/e2e/public-pages.spec.ts:199:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/the helper/i).first().or(getByText(/thehelper/i).first())
Expected: visible
Error: strict mode violation: getByText(/the helper/i).first().or(getByText(/thehelper/i).first()) resolved to 2 elements:
    1) <span class="text-sm font-extrabold text-[#0F172A] tracking-tight">…</span> aka getByRole('link', { name: 'The Helper thehelper.ca' })
    2) <p class="mb-3 text-xs font-semibold uppercase tracking-widest text-[#93C5FD]">THE HELPER REWARDS</p> aka getByText('THE HELPER REWARDS')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/the helper/i).first().or(getByText(/thehelper/i).first())

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
      - main [ref=e23]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]: Now serving GTA · Milton · Oakville · Burlington
            - heading "Book a verified pro in under 15 minutes." [level=1] [ref=e29]:
              - text: Book a verified pro
              - text: in under 15 minutes.
            - paragraph [ref=e30]: Submit one request. Get matched with a local pro who's licensed, insured, and ready today. No calling around. No waiting until Monday.
            - generic [ref=e31]:
              - img [ref=e32]
              - text: Earn $60+ cash back on your first completed job
            - generic [ref=e36]:
              - link "Get matched now" [ref=e37] [cursor=pointer]:
                - /url: /get-quotes
                - text: Get matched now
                - img [ref=e38]
              - button "Browse services" [ref=e40]:
                - img [ref=e41]
                - text: Browse services
            - generic [ref=e44]:
              - generic [ref=e45]:
                - img [ref=e47]
                - text: 100% Free for Homeowners
              - generic [ref=e50]:
                - img [ref=e52]
                - text: Verified & Insured Pros
              - generic [ref=e55]:
                - img [ref=e57]
                - text: Same-Day Service
              - generic [ref=e60]:
                - img [ref=e62]
                - text: 4.9★ Average Rating
          - generic [ref=e65]:
            - generic [ref=e66]:
              - img "Verified professional completing a home service" [ref=e67]
              - generic [ref=e70]:
                - img [ref=e72]
                - text: Sarah earned $5 · AC repair · Milton
            - generic [ref=e75]:
              - generic [ref=e76]:
                - paragraph [ref=e77]: Live requests near you
                - generic [ref=e78]: Live
              - generic [ref=e80]:
                - generic [ref=e81]:
                  - generic [ref=e82]:
                    - paragraph [ref=e83]: HVAC Repair
                    - paragraph [ref=e84]: Milton · Matched in 12 min
                  - generic [ref=e85]: Done
                - generic [ref=e86]:
                  - generic [ref=e87]:
                    - paragraph [ref=e88]: Plumbing
                    - paragraph [ref=e89]: Oakville · Matched in 8 min
                  - generic [ref=e90]: Active
                - generic [ref=e91]:
                  - generic [ref=e92]:
                    - paragraph [ref=e93]: Handyman
                    - paragraph [ref=e94]: Burlington · Just now
                  - generic [ref=e95]: New
              - generic [ref=e96]:
                - img [ref=e97]
                - text: James earned $50 cash back this month
        - generic [ref=e102]:
          - generic [ref=e103]:
            - paragraph [ref=e104]: WHAT WE HELP WITH
            - heading "Every service. One platform." [level=2] [ref=e105]
            - paragraph [ref=e106]: HVAC, plumbing, electrical, handyman, and more — all from verified local pros in your neighbourhood.
          - generic [ref=e107]:
            - link [ref=e108] [cursor=pointer]:
              - /url: /services/handyman
              - article [ref=e109]:
                - generic [ref=e110]:
                  - img "Handyman" [ref=e111]
                  - img [ref=e114]
                - generic [ref=e118]:
                  - generic [ref=e119]:
                    - heading "Handyman" [level=3] [ref=e120]
                    - img [ref=e121]
                  - paragraph [ref=e123]: Repairs, mounting, assembly, small projects, and punch lists.
            - link [ref=e124] [cursor=pointer]:
              - /url: /services/plumbing
              - article [ref=e125]:
                - generic [ref=e126]:
                  - img "Plumbing" [ref=e127]
                  - img [ref=e130]
                - generic [ref=e134]:
                  - generic [ref=e135]:
                    - heading "Plumbing" [level=3] [ref=e136]
                    - img [ref=e137]
                  - paragraph [ref=e139]: Leaks, fixtures, drains, water heaters, and urgent repairs.
            - link [ref=e140] [cursor=pointer]:
              - /url: /services/smart-home
              - article [ref=e141]:
                - generic [ref=e142]:
                  - img "Smart Home" [ref=e143]
                  - img [ref=e146]
                - generic [ref=e150]:
                  - generic [ref=e151]:
                    - heading "Smart Home" [level=3] [ref=e152]
                    - img [ref=e153]
                  - paragraph [ref=e155]: Cameras, thermostats, locks, sensors, and connected devices.
            - link [ref=e156] [cursor=pointer]:
              - /url: /services/events
              - article [ref=e157]:
                - generic [ref=e158]:
                  - img "Events" [ref=e159]
                  - img [ref=e162]
                - generic [ref=e165]:
                  - generic [ref=e166]:
                    - heading "Events" [level=3] [ref=e167]
                    - img [ref=e168]
                  - paragraph [ref=e170]: Event planning, setup, coordination, and day-of management.
            - link [ref=e171] [cursor=pointer]:
              - /url: /services/food-catering
              - article [ref=e172]:
                - generic [ref=e173]:
                  - img "Food Catering" [ref=e174]
                  - img [ref=e177]
                - generic [ref=e182]:
                  - generic [ref=e183]:
                    - heading "Food Catering" [level=3] [ref=e184]
                    - img [ref=e185]
                  - paragraph [ref=e187]: Full catering, food trucks, private dining, and custom menus.
            - link [ref=e188] [cursor=pointer]:
              - /url: /services/shisha-lounge
              - article [ref=e189]:
                - generic [ref=e190]:
                  - img "Shisha Lounge" [ref=e191]
                  - img [ref=e194]
                - generic [ref=e196]:
                  - generic [ref=e197]:
                    - heading "Shisha Lounge" [level=3] [ref=e198]
                    - img [ref=e199]
                  - paragraph [ref=e201]: Shisha setup and rental for events and private gatherings.
            - link [ref=e202] [cursor=pointer]:
              - /url: /services/ai-services
              - article [ref=e203]:
                - generic [ref=e204]:
                  - img "AI Services" [ref=e205]
                  - img [ref=e208]
                - generic [ref=e211]:
                  - generic [ref=e212]:
                    - heading "AI Services" [level=3] [ref=e213]
                    - img [ref=e214]
                  - paragraph [ref=e216]: Automation, chatbots, workflow tools, and digital assistants.
            - link [ref=e217] [cursor=pointer]:
              - /url: /services/website-design
              - article [ref=e218]:
                - generic [ref=e219]:
                  - img "Website Design" [ref=e220]
                  - img [ref=e223]
                - generic [ref=e226]:
                  - generic [ref=e227]:
                    - heading "Website Design" [level=3] [ref=e228]
                    - img [ref=e229]
                  - paragraph [ref=e231]: Custom websites, landing pages, e-commerce, and brand design.
          - paragraph [ref=e233]: Coming Soon
          - link "View all services" [ref=e235] [cursor=pointer]:
            - /url: /get-quotes
            - text: View all services
            - img [ref=e236]
        - generic [ref=e239]:
          - generic [ref=e240]:
            - paragraph [ref=e241]: HOW IT WORKS
            - heading "One request. Matched in 15 minutes." [level=2] [ref=e242]
            - paragraph [ref=e243]: Submit in under 2 minutes. We handle the matching, scheduling, and follow-up.
          - generic [ref=e246]:
            - generic [ref=e247]:
              - generic [ref=e248]: "01"
              - heading "Submit your request" [level=3] [ref=e249]
              - paragraph [ref=e250]: Takes under 2 minutes. Tell us what's broken. 100% free for homeowners.
            - generic [ref=e251]:
              - generic [ref=e252]: "02"
              - heading "Get matched fast" [level=3] [ref=e253]
              - paragraph [ref=e254]: A verified local pro responds within 15 minutes. No calling around.
            - generic [ref=e255]:
              - generic [ref=e256]: "03"
              - heading "Book a time that works" [level=3] [ref=e257]
              - paragraph [ref=e258]: Same-day for urgent jobs. Or schedule a window that fits your week.
            - generic [ref=e259]:
              - generic [ref=e260]: "04"
              - heading "Job done. Earn rewards." [level=3] [ref=e261]
              - paragraph [ref=e262]: $60+ cash back on your first completed job. Redeemable as gift cards.
          - link "Get matched now" [ref=e264] [cursor=pointer]:
            - /url: /get-quotes
            - text: Get matched now
            - img [ref=e265]
        - generic [ref=e269]:
          - generic [ref=e270]:
            - paragraph [ref=e271]: THE HELPER REWARDS
            - heading "The only platform where you get rewarded for getting things done." [level=2] [ref=e272]:
              - text: The
              - strong [ref=e273]: only
              - text: platform where you get rewarded for getting things done.
            - paragraph [ref=e274]: Every completed job earns you points you can redeem for gift cards. The more you use The Helper, the more you save.
            - link "Learn about rewards" [ref=e275] [cursor=pointer]:
              - /url: /how-rewards-work
              - text: Learn about rewards
              - img [ref=e276]
          - generic [ref=e278]:
            - generic [ref=e279]:
              - img [ref=e281]
              - generic [ref=e284]:
                - paragraph [ref=e285]: New Homeowner
                - paragraph [ref=e286]: Start earning from your first booking
              - generic [ref=e287]: 0 – 499 pts
            - generic [ref=e288]:
              - img [ref=e290]
              - generic [ref=e292]:
                - paragraph [ref=e293]: Active Homeowner
                - paragraph [ref=e294]: Keep going — your next job unlocks more
              - generic [ref=e295]: 500 – 1,999 pts
            - generic [ref=e296]:
              - img [ref=e298]
              - generic [ref=e301]:
                - paragraph [ref=e302]: Smart Maintainer
                - paragraph [ref=e303]: You're a regular — thank you
              - generic [ref=e304]: 2,000 – 4,999 pts
            - generic [ref=e305]:
              - img [ref=e307]
              - generic [ref=e309]:
                - paragraph [ref=e310]: Home Rewards Pro
                - paragraph [ref=e311]: Top tier with maximum rewards every time
              - generic [ref=e312]: 5,000+ pts
            - generic [ref=e313]:
              - img [ref=e314]
              - text: Refer a friend — both of you earn $5 when they submit their first request.
            - generic [ref=e318]:
              - generic [ref=e319]: Submit → +$5
              - generic [ref=e320]: ·
              - generic [ref=e321]: Book → +$5
              - generic [ref=e322]: ·
              - generic [ref=e323]:
                - text: Job done →
                - strong [ref=e324]: +$50
              - generic [ref=e325]: ·
              - generic [ref=e326]: Referral → +$5 each
        - generic [ref=e328]:
          - generic [ref=e329]:
            - paragraph [ref=e330]: BUILT ON TRUST
            - heading "Every pro verified. Every job tracked." [level=2] [ref=e331]
          - generic [ref=e332]:
            - article [ref=e333]:
              - img [ref=e335]
              - heading "Every pro verified" [level=3] [ref=e338]
              - paragraph [ref=e339]: Licenses, insurance, and service area reviewed before they can accept jobs. No exceptions.
            - article [ref=e340]:
              - img [ref=e342]
              - heading "Real reviews only" [level=3] [ref=e344]
              - paragraph [ref=e345]: Ratings come from verified completed jobs. If a job is not done, the review does not post.
            - article [ref=e346]:
              - img [ref=e348]
              - heading "All comms in one place" [level=3] [ref=e350]
              - paragraph [ref=e351]: Quotes, scheduling, and job updates stay connected to the job. No scattered texts or voicemails.
            - article [ref=e352]:
              - img [ref=e354]
              - heading "GTA built, GTA focused" [level=3] [ref=e357]
              - paragraph [ref=e358]: Built for Milton, Oakville, Burlington, Mississauga, and Brampton homeowners first.
        - generic [ref=e360]:
          - generic [ref=e361]:
            - paragraph [ref=e362]: WHAT HOMEOWNERS SAY
            - heading "Trusted by GTA homeowners." [level=2] [ref=e363]
          - generic [ref=e364]:
            - article [ref=e365]:
              - generic [ref=e366]: "\""
              - generic [ref=e367]:
                - generic [ref=e368]: ★
                - generic [ref=e369]: ★
                - generic [ref=e370]: ★
                - generic [ref=e371]: ★
                - generic [ref=e372]: ★
              - paragraph [ref=e373]: "\"My AC broke on a Saturday afternoon. Submitted at 2pm, tech booked by 4pm, done by 6pm. First time I've not spent hours calling around.\""
              - generic [ref=e374]:
                - img "Sarah M." [ref=e375]
                - generic [ref=e376]:
                  - paragraph [ref=e377]: Sarah M.
                  - paragraph [ref=e378]: Milton
            - article [ref=e379]:
              - generic [ref=e380]: "\""
              - generic [ref=e381]:
                - generic [ref=e382]: ★
                - generic [ref=e383]: ★
                - generic [ref=e384]: ★
                - generic [ref=e385]: ★
                - generic [ref=e386]: ★
              - paragraph [ref=e387]: "\"Found an electrician in 45 minutes on a weeknight. The app sent the quote, I booked, and it was fixed before the weekend. The rewards points are a bonus.\""
              - generic [ref=e388]:
                - img "James K." [ref=e389]
                - generic [ref=e390]:
                  - paragraph [ref=e391]: James K.
                  - paragraph [ref=e392]: Oakville
            - article [ref=e393]:
              - generic [ref=e394]: "\""
              - generic [ref=e395]:
                - generic [ref=e396]: ★
                - generic [ref=e397]: ★
                - generic [ref=e398]: ★
                - generic [ref=e399]: ★
                - generic [ref=e400]: ★
              - paragraph [ref=e401]: "\"Most platforms connect you and disappear. This one tracks the whole job and makes it easy to get someone out fast. The cash back adds up.\""
              - generic [ref=e402]:
                - img "Priya S." [ref=e403]
                - generic [ref=e404]:
                  - paragraph [ref=e405]: Priya S.
                  - paragraph [ref=e406]: Burlington
        - generic [ref=e409]:
          - generic [ref=e410]:
            - paragraph [ref=e411]: 15 min
            - paragraph [ref=e412]: Average match time
          - generic [ref=e413]:
            - paragraph [ref=e414]: 500+
            - paragraph [ref=e415]: GTA homeowners served
          - generic [ref=e416]:
            - paragraph [ref=e417]: 4.9★
            - paragraph [ref=e418]: Average rating
          - generic [ref=e419]:
            - paragraph [ref=e420]: $60+
            - paragraph [ref=e421]: Cash back on first job
        - generic [ref=e424]:
          - generic [ref=e425]:
            - heading "Local pro? Stop paying for leads that never close." [level=3] [ref=e426]
            - paragraph [ref=e427]: Get matched with homeowners in your service area who are ready to book. Manage leads, jobs, and reviews in one dashboard.
            - generic [ref=e428]:
              - generic [ref=e429]:
                - img [ref=e430]
                - text: 6 service categories
              - generic [ref=e434]:
                - img [ref=e435]
                - text: GTA coverage
              - generic [ref=e438]:
                - img [ref=e439]
                - text: Free to apply
          - link "Apply as a Pro" [ref=e442] [cursor=pointer]:
            - /url: /providers/apply
            - text: Apply as a Pro
            - img [ref=e443]
        - generic [ref=e448]:
          - generic [ref=e449]:
            - img [ref=e450]
            - text: Takes under 2 minutes
          - heading "Stop calling around. Get matched with a verified pro in 15 minutes." [level=2] [ref=e452]
          - paragraph [ref=e453]: One request. Matched with a licensed, insured local pro. 100% free for homeowners. $60+ cash back on your first completed job.
          - generic [ref=e454]:
            - link "Get Help Now" [ref=e455] [cursor=pointer]:
              - /url: /get-quotes
              - text: Get Help Now
              - img [ref=e456]
            - link "Join as a Pro" [ref=e458] [cursor=pointer]:
              - /url: /providers/apply
        - generic [ref=e460]:
          - generic [ref=e461]:
            - generic [ref=e462]:
              - paragraph [ref=e463]: The Helper
              - paragraph [ref=e464]: Canada's trusted platform for home services and local help.
              - generic [ref=e465]:
                - generic [ref=e466]: 🇨🇦
                - generic [ref=e467]: Made in Canada · Serving the GTA
            - generic [ref=e468]:
              - paragraph [ref=e469]: Services
              - list [ref=e470]:
                - listitem [ref=e471]:
                  - link "HVAC" [ref=e472] [cursor=pointer]:
                    - /url: /hvac
                - listitem [ref=e473]:
                  - link "Plumbing" [ref=e474] [cursor=pointer]:
                    - /url: /plumbing
                - listitem [ref=e475]:
                  - link "Electrical" [ref=e476] [cursor=pointer]:
                    - /url: /electrical
                - listitem [ref=e477]:
                  - link "Handyman" [ref=e478] [cursor=pointer]:
                    - /url: /handyman
                - listitem [ref=e479]:
                  - link "Smart Home" [ref=e480] [cursor=pointer]:
                    - /url: /smart-home
            - generic [ref=e481]:
              - paragraph [ref=e482]: Company
              - list [ref=e483]:
                - listitem [ref=e484]:
                  - link "How it works" [ref=e485] [cursor=pointer]:
                    - /url: /how-it-works
                - listitem [ref=e486]:
                  - link "Rewards" [ref=e487] [cursor=pointer]:
                    - /url: /how-rewards-work
                - listitem [ref=e488]:
                  - link "For Pros" [ref=e489] [cursor=pointer]:
                    - /url: /providers
                - listitem [ref=e490]:
                  - link "Areas served" [ref=e491] [cursor=pointer]:
                    - /url: /areas/milton
                - listitem [ref=e492]:
                  - link "Help centre" [ref=e493] [cursor=pointer]:
                    - /url: /help
            - generic [ref=e494]:
              - paragraph [ref=e495]: Legal
              - list [ref=e496]:
                - listitem [ref=e497]:
                  - link "Privacy Policy" [ref=e498] [cursor=pointer]:
                    - /url: /privacy
                - listitem [ref=e499]:
                  - link "Terms of Service" [ref=e500] [cursor=pointer]:
                    - /url: /terms
          - generic [ref=e501]:
            - paragraph [ref=e502]:
              - img [ref=e503]
              - text: © 2026 The Helper · Milton, Ontario, Canada
            - generic [ref=e506]:
              - link "Privacy Policy" [ref=e507] [cursor=pointer]:
                - /url: /privacy
              - link "Terms of Service" [ref=e508] [cursor=pointer]:
                - /url: /terms
    - region "Notifications (F8)":
      - list
  - img
```

# Test source

```ts
  104 |     await expect(page).not.toHaveURL(/\/login/);
  105 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  106 |     await expect(page.getByText(/reward/i).first()).toBeVisible();
  107 |   });
  108 | 
  109 |   test('/providers — loads with Apply as a Pro CTA', async ({ page }) => {
  110 |     await gotoAndDismiss(page, '/providers');
  111 |     await expect(page).not.toHaveURL(/\/login/);
  112 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  113 |     await expect(
  114 |       page
  115 |         .getByRole('link', { name: /apply/i })
  116 |         .or(page.getByRole('button', { name: /apply/i }))
  117 |         .first()
  118 |     ).toBeVisible();
  119 |   });
  120 | 
  121 |   test('/providers/apply — loads with form', async ({ page }) => {
  122 |     await gotoAndDismiss(page, '/providers/apply');
  123 |     await expect(page).not.toHaveURL(/\/login/);
  124 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  125 |     await expect(page.locator('form')).toBeVisible();
  126 |   });
  127 | 
  128 |   test('/help — loads', async ({ page }) => {
  129 |     await gotoAndDismiss(page, '/help');
  130 |     await expect(page).not.toHaveURL(/\/login/);
  131 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  132 |   });
  133 | 
  134 |   test('/contact — loads with form', async ({ page }) => {
  135 |     await gotoAndDismiss(page, '/contact');
  136 |     await expect(page).not.toHaveURL(/\/login/);
  137 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  138 |     await expect(page.locator('form')).toBeVisible();
  139 |   });
  140 | 
  141 |   test('/privacy — loads', async ({ page }) => {
  142 |     await gotoAndDismiss(page, '/privacy');
  143 |     await expect(page).not.toHaveURL(/\/login/);
  144 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  145 |   });
  146 | 
  147 |   test('/terms — loads', async ({ page }) => {
  148 |     await gotoAndDismiss(page, '/terms');
  149 |     await expect(page).not.toHaveURL(/\/login/);
  150 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  151 |   });
  152 | 
  153 |   test('/login — loads with email field (OTP default)', async ({ page }) => {
  154 |     await gotoAndDismiss(page, '/login');
  155 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  156 |     await expect(page.getByRole('button', { name: /send/i }).first()).toBeVisible();
  157 |   });
  158 | 
  159 |   test('/signup — loads the dedicated signup page', async ({ page }) => {
  160 |     await gotoAndDismiss(page, '/signup');
  161 |     await expect(page).not.toHaveURL(/^\/login/);
  162 |     // Should show signup form (email + password fields)
  163 |     await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 10000 });
  164 |     await expect(page.locator('input[type="password"]').first()).toBeVisible();
  165 |     // Heading should mention account creation
  166 |     await expect(page.locator('h2').first()).toContainText(/create|sign up|account/i);
  167 |   });
  168 | 
  169 |   test('/request-service — redirects to /get-quotes', async ({ page }) => {
  170 |     await gotoAndDismiss(page, '/request-service');
  171 |     await expect(page).toHaveURL(/\/get-quotes/);
  172 |     await expect(page.locator('body')).toBeVisible();
  173 |   });
  174 | 
  175 |   test('/services — loads', async ({ page }) => {
  176 |     await gotoAndDismiss(page, '/services');
  177 |     await expect(page).not.toHaveURL(/\/login/);
  178 |     await expect(page.locator('h1, h2').first()).toBeVisible();
  179 |   });
  180 | 
  181 |   test('/services/handyman — dynamic category page loads', async ({ page }) => {
  182 |     await gotoAndDismiss(page, '/services/handyman');
  183 |     await expect(page).not.toHaveURL(/\/login/);
  184 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  185 |   });
  186 | 
  187 |   test('/services/events — dynamic category page loads', async ({ page }) => {
  188 |     await gotoAndDismiss(page, '/services/events');
  189 |     await expect(page).not.toHaveURL(/\/login/);
  190 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  191 |   });
  192 | 
  193 |   test('/services/plumbing — dynamic category page loads', async ({ page }) => {
  194 |     await gotoAndDismiss(page, '/services/plumbing');
  195 |     await expect(page).not.toHaveURL(/\/login/);
  196 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  197 |   });
  198 | 
  199 |   test('footer shows The Helper branding', async ({ page }) => {
  200 |     await gotoAndDismiss(page, '/');
  201 |     await expect(
  202 |       page.getByText(/the helper/i).first()
  203 |         .or(page.getByText(/thehelper/i).first())
> 204 |     ).toBeVisible();
      |       ^ Error: expect(locator).toBeVisible() failed
  205 |   });
  206 | 
  207 |   test('area pages have local content', async ({ page }) => {
  208 |     await gotoAndDismiss(page, '/areas/milton');
  209 |     await expect(
  210 |       page.getByText(/homeowner|neighbour|local/i).first()
  211 |     ).toBeVisible();
  212 |   });
  213 | });
  214 | 
```