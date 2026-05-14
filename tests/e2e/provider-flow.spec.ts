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
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL(/\/(dashboard|onboarding|provider\/dashboard|provider\/apply)/, { timeout: 15000 });
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
    // Should show either lead cards or an empty state
    await expect(
      page.locator('h1, h2').first()
        .or(page.getByText(/no.*lead/i))
        .or(page.getByText(/lead/i).first())
        .or(page.getByText(/empty/i))
    ).toBeVisible();
  });

  test('/provider/appointments — loads', async ({ page }) => {
    await page.goto('/provider/appointments');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
    await expect(
      page.locator('h1, h2').first()
        .or(page.getByText(/appointment/i).first())
        .or(page.getByText(/no.*appointment/i))
    ).toBeVisible();
  });

  test('/provider/profile — loads with form fields', async ({ page }) => {
    await page.goto('/provider/profile');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Profile page should have form inputs
    await expect(
      page.locator('input').first()
        .or(page.locator('textarea').first())
        .or(page.locator('form').first())
    ).toBeVisible();
  });

  test('/provider/billing — loads', async ({ page }) => {
    await page.goto('/provider/billing');
    await dismissCookieConsent(page);
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('body')).toBeVisible();
    await expect(
      page.locator('h1, h2').first()
        .or(page.getByText(/billing/i).first())
        .or(page.getByText(/fee/i).first())
    ).toBeVisible();
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
