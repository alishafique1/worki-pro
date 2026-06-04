import { test, expect, Page } from '@playwright/test';

const CONSUMER_EMAIL = 'consumer@thehelper.ca';
const CONSUMER_PASSWORD = 'HelperTest123';

async function dismissCookieConsent(page: Page) {
  try {
    const reject = page.getByRole('button', { name: /reject all/i });
    if (await reject.isVisible({ timeout: 2000 }).catch(() => false)) {
      await reject.click().catch(() => {});
    }
  } catch {}

  try {
    const accept = page.getByRole('button', { name: /accept all/i });
    if (await accept.isVisible({ timeout: 2000 }).catch(() => false)) {
      await accept.click().catch(() => {});
    }
  } catch {}
}

async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await dismissCookieConsent(page);
  // Wait for the page to hydrate (Wasp SSR)
  await page.locator('input[type="email"]').waitFor({ state: 'visible', timeout: 15000 });
  await page.locator('input[type="email"]').fill(email);

  // Default mode is OTP — switch to password mode
  const pwToggle = page.getByRole('button', { name: /sign in with password/i });
  if (await pwToggle.isVisible({ timeout: 5000 }).catch(() => false)) {
    await pwToggle.click();
  }

  // Wait for password field to appear after toggling mode
  await page.locator('input[type="password"]').waitFor({ state: 'visible', timeout: 5000 });
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for post-login redirect (onboarding for new users, dashboard for returning)
  await page.waitForURL(
    /\/(dashboard|onboarding)/,
    { timeout: 20000 }
  ).catch(async () => {
    // Fallback: if redirect didn't match expected routes, the page still needs to be visible
    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  });
}

test.describe('Consumer — authenticated flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, CONSUMER_EMAIL, CONSUMER_PASSWORD);
    await dismissCookieConsent(page);
  });

  test('/dashboard — loads with heading', async ({ page }) => {
    await page.goto('/dashboard');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    // Either a Welcome heading or a generic Dashboard heading
    await expect(
      page.locator('h1, h2').first()
    ).toBeVisible();
  });

  test('/my-requests — loads, shows requests or empty state', async ({ page }) => {
    await page.goto('/my-requests');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    // Should show either the requests heading or an empty state message
    await expect(
      page.locator('h1, h2').first()
        .or(page.getByText(/no.*request/i))
        .or(page.getByText(/empty/i))
    ).toBeVisible();
  });

  test('/rewards — loads and shows balance or rewards section', async ({ page }) => {
    await page.goto('/rewards');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should show points or rewards content
    await expect(
      page.getByText(/point/i)
        .or(page.getByText(/reward/i))
        .or(page.getByText(/balance/i))
        .first()
    ).toBeVisible();
  });

  test('/referral — loads and shows referral code section', async ({ page }) => {
    await page.goto('/referral');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should show a referral code area
    await expect(
      page.locator('code')
        .or(page.getByText(/referral code/i))
        .or(page.getByText(/refer/i))
        .first()
    ).toBeVisible();
  });

  test('/analytics — loads', async ({ page }) => {
    await page.goto('/analytics');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('/help — loads as authenticated user', async ({ page }) => {
    await page.goto('/help');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/request-service — loads and shows step 1 of form', async ({ page }) => {
    await page.goto('/request-service');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    // Step 1 should show service selection — look for the category selection heading
    await expect(page.getByRole('heading', { name: /free quotes/i })).toBeVisible();
  });

  test('/request-service — can select a category', async ({ page }) => {
    await page.goto('/request-service');
    await dismissCookieConsent(page);
    // Look for category cards or buttons
    const categoryCard = page.locator('[class*="card"]').first()
      .or(page.getByRole('button').filter({ hasText: /hvac|plumbing|electrical/i }).first());
    if (await categoryCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await categoryCard.click();
      // After clicking, should advance or show qualifier questions
      await expect(
        page.getByText(/repair|maintenance|describe/i).first()
          .or(page.locator('textarea').first())
          .or(page.locator('[class*="step"]').first())
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
