import { test, expect, Page } from '@playwright/test';

const PROVIDER_EMAIL = 'hvac@thehelper.ca';
const PROVIDER_PASSWORD = 'HelperTest123';

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
    /\/(provider\/dashboard|provider\/apply|dashboard|onboarding)/,
    { timeout: 20000 }
  ).catch(async () => {
    await expect(page.locator('body')).toBeVisible({ timeout: 5000 });
  });
}

test.describe('Provider — authenticated flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, PROVIDER_EMAIL, PROVIDER_PASSWORD);
    await dismissCookieConsent(page);
  });

  test('/provider/dashboard — loads', async ({ page }) => {
    await page.goto('/provider/dashboard');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/provider/leads — loads, shows leads or empty state', async ({ page }) => {
    await page.goto('/provider/leads');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('/provider/appointments — loads', async ({ page }) => {
    await page.goto('/provider/appointments');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('/provider/profile — loads', async ({ page }) => {
    await page.goto('/provider/profile');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('/provider/billing — loads', async ({ page }) => {
    await page.goto('/provider/billing');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('/provider/services — loads', async ({ page }) => {
    await page.goto('/provider/services');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
    await expect(
      page.locator('h1, h2').first()
        .or(page.getByText(/service/i).first())
    ).toBeVisible();
  });
});
