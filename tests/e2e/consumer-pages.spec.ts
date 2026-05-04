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

async function loginIfNeeded(page: Page) {
  if (!page.url().includes('/login')) return;

  await dismissCookieConsent(page);
  await page.getByLabel(/e-?mail/i).or(page.locator('input[type="email"]')).first().fill(LOGIN_EMAIL);
  await page.getByLabel(/password/i).or(page.locator('input[type="password"]')).first().fill(LOGIN_PASSWORD);
  await page.getByRole('button', { name: /log in/i }).click();

  await page.waitForURL(/\/(dashboard|my-requests|referral|onboarding)(\?.*)?$/i, {
    timeout: 15000,
  });
}

async function gotoAuthed(page: Page, path: '/my-requests' | '/referral') {
  await page.goto(path);
  await loginIfNeeded(page);

  if (page.url().includes('/onboarding')) {
    await page.goto(path);
  }

  await dismissCookieConsent(page);
  await page.waitForURL(new RegExp(`${path.replace('/', '\\/')}(\\?.*)?$`, 'i'));
}

test.describe('Consumer Pages — MyRequestsPage & ReferralPage', () => {
  test('MyRequestsPage renders the page heading', async ({ page }) => {
    await gotoAuthed(page, '/my-requests');
    await expect(page.getByRole('heading', { name: /my bookings & repairs/i })).toBeVisible();
  });

  test('MyRequestsPage shows content or empty state', async ({ page }) => {
    await gotoAuthed(page, '/my-requests');
    await expect(
      page
        .getByText(/you have no active requests yet/i)
        .or(page.getByRole('heading', { name: /my bookings & repairs/i }))
    ).toBeVisible();
  });

  test('MyRequestsPage has a link to request a new service', async ({ page }) => {
    await gotoAuthed(page, '/my-requests');
    await expect(page.locator('a[href="/request-service"]')).toBeVisible();
  });

  test('ReferralPage renders the referral heading', async ({ page }) => {
    await gotoAuthed(page, '/referral');
    await expect(page.getByRole('heading', { name: /refer a friend/i })).toBeVisible();
  });

  test('ReferralPage shows a referral code element', async ({ page }) => {
    await gotoAuthed(page, '/referral');
    await expect(page.locator('code')).toBeVisible();
  });

  test('ReferralPage copy button is present', async ({ page }) => {
    await gotoAuthed(page, '/referral');
    await expect(page.getByRole('button', { name: /copy/i })).toBeVisible();
  });

  test('ReferralPage shows how-it-works steps', async ({ page }) => {
    await gotoAuthed(page, '/referral');
    await expect(page.getByRole('heading', { name: /how it works/i })).toBeVisible();
    await expect(page.locator('ol li')).toHaveCount(3);
  });

  test('ReferralPage referral code starts with REF-', async ({ page }) => {
    await gotoAuthed(page, '/referral');
    await expect.poll(async () => (await page.locator('code').textContent())?.trim() || '').toMatch(/^REF-[A-Z0-9]{6}$/);
  });
});
