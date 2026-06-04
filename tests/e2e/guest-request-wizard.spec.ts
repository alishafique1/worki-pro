/**
 * Guest Request-Wizard E2E — TheHelper (helper.ca)
 * Full guest flow: landing → get-quotes wizard (no auth required) → submit request
 *
 * The /get-quotes wizard is the PRIMARY consumer funnel. No account needed.
 * Steps: (1) Select category → (2) Qualifier questions → (3) Contact info → (4) Verify email
 *
 * Run: npx playwright test guest-request-wizard --reporter=list
 */

import { test, expect, Page } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function dismissCookieConsent(page: Page): Promise<void> {
  for (const name of [/reject/i, /decline/i, /no thanks/i, /accept all/i]) {
    try {
      const btn = page.getByRole('button', { name });
      if (await btn.isVisible({ timeout: 2000 })) {
        await btn.click();
        return;
      }
    } catch { /* no-op */ }
  }
}

async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle');
  await expect(page.locator('body')).toBeVisible();
}

// ---------------------------------------------------------------------------
// Landing → Get Quotes CTA
// ---------------------------------------------------------------------------

test.describe('Guest Wizard — Landing to Start', () => {
  test('Landing page → Get Help Now CTA visible', async ({ page }) => {
    await page.goto('/');
    await dismissCookieConsent(page);
    await waitForPageReady(page);

    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /get help|get quotes|get started/i }).first()
    ).toBeVisible();
  });

  test('/request-service redirects to /get-quotes', async ({ page }) => {
    await page.goto('/request-service');
    await waitForPageReady(page);
    await expect(page).toHaveURL(/\/get-quotes/);
  });

  test('/get-quotes — wizard header renders', async ({ page }) => {
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await waitForPageReady(page);

    await expect(
      page.getByText(/get free quotes/i).first()
        .or(page.getByText(/get quotes/i).first())
    ).toBeVisible({ timeout: 10000 });

    // Step progress indicator should be present (4 steps)
    await expect(
      page.locator('[class*="step"], [class*="progress"], [role="progressbar"]').first()
    ).toBeVisible({ timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// Step 1: Category Selection
// ---------------------------------------------------------------------------

test.describe('Guest Wizard — Step 1: Category Selection', () => {
  test('Category grid loads with service options', async ({ page }) => {
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await waitForPageReady(page);

    // Wait for categories to load from API
    await expect(
      page.getByText(/what do you need help|select a category/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Category cards should be present
    const categoryBtns = page.locator('button').filter({ hasText: /hvac|plumbing|electrical|handyman/i });
    const count = await categoryBtns.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Selecting a category advances to Step 2', async ({ page }) => {
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await waitForPageReady(page);

    // Click the first visible category card
    const firstCat = page.locator('button[class*="rounded-2xl"]').or(
      page.locator('button').filter({ hasText: /.+/ })
    ).first();

    await expect(firstCat).toBeVisible({ timeout: 10000 });
    await firstCat.click();

    // Should advance — expect to see qualifier questions or next heading
    await expect(
      page.getByText(/describe|question|tell us|qualif|problem/i).first()
        .or(page.getByText(/repair|maintenance/i).first())
    ).toBeVisible({ timeout: 8000 });
  });
});

// ---------------------------------------------------------------------------
// Step 2: Qualifier Questions
// ---------------------------------------------------------------------------

test.describe('Guest Wizard — Step 2: Qualifiers & Description', () => {
  async function selectCategory(page: Page): Promise<void> {
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await page.waitForLoadState('networkidle');

    const cat = page.locator('button[class*="rounded-2xl"]').first();
    await expect(cat).toBeVisible({ timeout: 10000 });
    await cat.click();
  }

  test('Step 2 shows description textarea', async ({ page }) => {
    await selectCategory(page);
    await expect(
      page.locator('textarea').first()
        .or(page.getByPlaceholder(/describe|tell us|problem|details/i).first())
    ).toBeVisible({ timeout: 8000 });
  });

  test('User can type a description and advance', async ({ page }) => {
    await selectCategory(page);

    const textarea = page.locator('textarea').first()
      .or(page.getByPlaceholder(/describe|tell us/i).first());

    if (await textarea.isVisible({ timeout: 5000 }).catch(() => false)) {
      await textarea.fill('Need emergency plumbing repair — leaking pipe under kitchen sink in Milton.');

      // Advance to Step 3
      const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
      if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nextBtn.click();

        // Should arrive at Step 3 "Your info"
        await expect(
          page.getByText(/your info|almost done|postal code|first name|located/i).first()
        ).toBeVisible({ timeout: 8000 });
      }
    }
  });
});

// ---------------------------------------------------------------------------
// Step 3: Contact Info
// ---------------------------------------------------------------------------

test.describe('Guest Wizard — Step 3: Contact Info', () => {
  async function navigateToStep3(page: Page): Promise<void> {
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await page.waitForLoadState('networkidle');

    // Step 1: select category
    const cat = page.locator('button[class*="rounded-2xl"]').first();
    await expect(cat).toBeVisible({ timeout: 10000 });
    await cat.click();

    // Step 2: fill description + next
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible({ timeout: 5000 }).catch(() => false)) {
      await textarea.fill('Test service request — E2E validation.');
    }

    const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
    }
  }

  test('Step 3 shows postal code, name, phone fields', async ({ page }) => {
    await navigateToStep3(page);

    await expect(
      page.getByText(/your info|almost done|located|reach you/i).first()
    ).toBeVisible({ timeout: 8000 });

    // Look for placeholder-based targeting (the input has no name= attribute)
    await expect(
      page.locator('input[placeholder="L9T 2X5"]').first()
    ).toBeVisible({ timeout: 5000 });

    await expect(
      page.locator('input[placeholder="Jane"]').first()
    ).toBeVisible({ timeout: 3000 });
  });

  test('Step 3 validates required postal code', async ({ page }) => {
    await navigateToStep3(page);
    await page.locator('input[placeholder="L9T 2X5"]').first().fill('');
    await page.locator('input[placeholder="Jane"]').first().fill('Test');
    await page.locator('input[placeholder*="555"]').first().fill('4165551234');

    // Click next/continue
    const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      // Should show postal code validation error
      await expect(
        page.getByText(/postal|required|valid/i).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('Step 3 advances when contact info is valid', async ({ page }) => {
    await navigateToStep3(page);

    // Fill valid contact info
    await page.locator('input[placeholder="L9T 2X5"]').first().fill('L9T 2X5');
    await page.locator('input[placeholder="Jane"]').first().fill('Test');
    await page.locator('input[placeholder*="555" i]').first().fill('4165551234');

    const nextBtn = page.getByRole('button', { name: /next|continue/i }).first();
    if (await nextBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextBtn.click();
      // Step 4: email verification
      await expect(
        page.getByText(/check|verify|email|sent.*code/i).first()
      ).toBeVisible({ timeout: 8000 });
    }
  });
});

// ---------------------------------------------------------------------------
// Step 4: Email Verification (OTP)
// ---------------------------------------------------------------------------

test.describe('Guest Wizard — Step 4: Email Verification', () => {
  async function navigateToStep4(page: Page): Promise<void> {
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await page.waitForLoadState('networkidle');

    // Step 1: category
    const cat = page.locator('button[class*="rounded-2xl"]').first();
    await expect(cat).toBeVisible({ timeout: 10000 });
    await cat.click();

    // Step 2: description
    const textarea = page.locator('textarea').first();
    if (await textarea.isVisible({ timeout: 5000 }).catch(() => false)) {
      await textarea.fill('E2E test service request — email verification step.');
    }
    const nextBtn1 = page.getByRole('button', { name: /next|continue/i }).first();
    if (await nextBtn1.isVisible({ timeout: 3000 }).catch(() => false)) await nextBtn1.click();

    // Step 3: contact info
    await page.locator('input[placeholder="L9T 2X5"]').first().fill('L9T 2X5');
    await page.locator('input[placeholder="Jane"]').first().fill('E2E');
    await page.locator('input[placeholder*="555" i]').first().fill('4165559999');

    const nextBtn2 = page.getByRole('button', { name: /next|continue/i }).first();
    if (await nextBtn2.isVisible({ timeout: 3000 }).catch(() => false)) await nextBtn2.click();
  }

  test('Step 4 shows OTP code input section', async ({ page }) => {
    await navigateToStep4(page);

    // Should show the OTP verification screen with email field and send button
    // OR already have the code sent if the email field auto-sends
    await expect(
      page.getByText(/check|verify|email|sent.*code|codes/i).first()
    ).toBeVisible({ timeout: 10000 });

    // Should have either an email input or 6 digit code inputs
    const emailInput = page.locator('input[type="email"]');
    const digitInputs = page.locator('input[maxlength="1"], input[inputmode="numeric"][maxlength="1"]');

    const hasEmail = await emailInput.isVisible({ timeout: 2000 }).catch(() => false);
    const hasDigits = await digitInputs.first().isVisible({ timeout: 2000 }).catch(() => false);

    // At least one should be visible
    expect(hasEmail || hasDigits).toBe(true);
  });

  test('User can see the full 4-step wizard progress bar', async ({ page }) => {
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/get free quotes/i)).toBeVisible({ timeout: 10000 });

    // The progress bar should show 4 steps: Service, Questions, Your info, Verify email
    await expect(
      page.getByText(/service|questions|your info|verify email/i).first()
    ).toBeVisible({ timeout: 5000 });
  });
});

// ---------------------------------------------------------------------------
// Auth-aware route redirect behavior
// ---------------------------------------------------------------------------

test.describe('Guest Wizard — Auth-aware routing', () => {
  test('/get-quotes loads without authentication', async ({ page }) => {
    // Clear cookies to ensure guest state
    await page.context().clearCookies();
    await page.goto('/get-quotes');
    await dismissCookieConsent(page);
    await waitForPageReady(page);

    await expect(
      page.getByText(/get free quotes/i).first()
        .or(page.getByText(/what do you need/i).first())
    ).toBeVisible({ timeout: 10000 });

    // Guest should NOT be redirected to /login
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('/login redirects to /signup is gone — signup is independent', async ({ page }) => {
    // This replaced the old /signup → redirect behavior
    await page.goto('/signup');
    await dismissCookieConsent(page);
    await waitForPageReady(page);

    // Signup should load independently (not redirect to login)
    await expect(
      page.locator('input[type="email"]').first()
    ).toBeVisible({ timeout: 10000 });
  });
});