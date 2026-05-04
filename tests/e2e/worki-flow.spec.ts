import { test, expect, Page } from '@playwright/test';

const LOGIN_EMAIL = 'test@worki.ai';
const LOGIN_PASSWORD = 'Password123!';

async function dismissCookieConsent(page: Page) {
  const reject = page.getByRole('button', { name: /reject all/i });
  if (await reject.isVisible().catch(() => false)) {
    await reject.click().catch(() => {});
  }

  const accept = page.getByRole('button', { name: /accept all/i });
  if (await accept.isVisible().catch(() => false)) {
    await accept.click().catch(() => {});
  }
}

async function login(page: Page, email = LOGIN_EMAIL, password = LOGIN_PASSWORD) {
  await page.goto('/login');
  await dismissCookieConsent(page);

  await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  await page
    .getByLabel(/e-?mail/i)
    .or(page.locator('input[type="email"]'))
    .first()
    .fill(email);
  await page
    .getByLabel(/password/i)
    .or(page.locator('input[type="password"]'))
    .first()
    .fill(password);
  await page.getByRole('button', { name: /log in/i }).click();

  await page.waitForURL(/\/(dashboard|onboarding|provider\/dashboard|provider\/apply)(\?.*)?$/i, {
    timeout: 15000,
  });

  const url = page.url();
  if (url.includes('/onboarding')) {
    await page.goto('/provider/dashboard');
  }
}

test.describe('Worki End-to-End Flow', () => {
  test('Provider Dashboard renders correctly', async ({ page }) => {
    await login(page);
    await page.goto('/provider/dashboard');
    await dismissCookieConsent(page);

    await expect(page.getByRole('heading', { name: /provider portal/i })).toBeVisible();
    await expect(page.getByText(/new leads/i)).toBeVisible();
  });
});
