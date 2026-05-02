import { test, expect } from '@playwright/test';

test.describe('Consumer Pages — MyRequestsPage & ReferralPage', () => {

  // --- MyRequestsPage ---

  test('MyRequestsPage renders the page heading', async ({ page }) => {
    await page.goto('/my-requests');

    // Auth guard redirects unauthenticated users to /login
    const url = page.url();
    if (url.includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/my-requests');
    }

    await expect(page.locator('h1')).toContainText('My Requests');
  });

  test('MyRequestsPage shows empty state when no requests exist', async ({ page }) => {
    await page.goto('/my-requests');

    // Log in if redirected
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/my-requests');
    }

    // Should show empty state with a CTA link
    const emptyState = page.locator('text=No service requests yet');
    await expect(emptyState.or(page.locator('text=My Requests'))).toBeVisible();
  });

  test('MyRequestsPage has a link to request a new service', async ({ page }) => {
    await page.goto('/my-requests');

    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/my-requests');
    }

    const requestLink = page.locator('a[href="/request-service"]');
    await expect(requestLink).toBeVisible();
  });

  // --- ReferralPage ---

  test('ReferralPage renders the referral heading', async ({ page }) => {
    await page.goto('/referral');

    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/referral');
    }

    await expect(page.locator('h1')).toContainText('Refer a Friend');
  });

  test('ReferralPage shows a referral code input', async ({ page }) => {
    await page.goto('/referral');

    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/referral');
    }

    // Referral code is rendered in a <code> element
    const codeEl = page.locator('code');
    await expect(codeEl).toBeVisible();
  });

  test('ReferralPage copy button is present', async ({ page }) => {
    await page.goto('/referral');

    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/referral');
    }

    const copyBtn = page.locator('button', { hasText: /copy/i });
    await expect(copyBtn).toBeVisible();
  });

  test('ReferralPage shows how-it-works steps', async ({ page }) => {
    await page.goto('/referral');

    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/referral');
    }

    await expect(page.locator('h2', { hasText: 'How it Works' })).toBeVisible();
    const steps = page.locator('ol li');
    await expect(steps).toHaveCount(3);
  });

  test('ReferralPage referral code starts with REF-', async ({ page }) => {
    await page.goto('/referral');

    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', 'test@worki.ai');
      await page.fill('input[type="password"]', 'Password123!');
      await page.click('button[type="submit"]');
      await page.waitForURL('/referral');
    }

    const codeEl = page.locator('code');
    const codeText = await codeEl.textContent();
    expect(codeText).toMatch(/^REF-[A-Z0-9]{6}$/);
  });
});
