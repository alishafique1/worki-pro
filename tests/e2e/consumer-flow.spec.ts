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
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 15000 });
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
    await expect(page.locator('h1, h2').first()).toBeVisible();
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
    // Step 1 should show service selection — look for category cards, heading, or progress indicator
    await expect(
      page.locator('h1, h2').first()
        .or(page.getByText(/what.*service/i))
        .or(page.getByText(/select.*category/i))
        .or(page.locator('[class*="step"]').first())
        .or(page.locator('[class*="category"]').first())
        .or(page.locator('[class*="card"]').first())
    ).toBeVisible();
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
