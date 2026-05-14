import { test, expect, Page } from '@playwright/test';

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

async function gotoAndDismiss(page: Page, path: string) {
  await page.goto(path);
  await dismissCookieConsent(page);
  await expect(page.locator('body')).toBeVisible();
}

test.describe('Public pages', () => {
  test('/ — landing page loads with Find a Helper CTA', async ({ page }) => {
    await gotoAndDismiss(page, '/');
    await expect(page).not.toHaveURL(/\/login/);
    // Should have at least one heading
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // CTA button or link referencing getting help / finding a helper
    await expect(
      page
        .getByRole('button', { name: /find a helper/i })
        .or(page.getByRole('link', { name: /find a helper/i }))
        .or(page.getByRole('button', { name: /get started/i }))
        .or(page.getByRole('link', { name: /get started/i }))
        .first()
    ).toBeVisible();
  });

  test('/hvac — loads with HVAC heading', async ({ page }) => {
    await gotoAndDismiss(page, '/hvac');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should mention HVAC somewhere on the page
    await expect(page.getByText(/hvac/i).first()).toBeVisible();
  });

  test('/plumbing — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/plumbing');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/electrical — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/electrical');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/handyman — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/handyman');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/smart-home — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/smart-home');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/appliance-repair — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/appliance-repair');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/areas/milton — loads and mentions Milton', async ({ page }) => {
    await gotoAndDismiss(page, '/areas/milton');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.getByText(/milton/i).first()).toBeVisible();
  });

  test('/areas/oakville — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/areas/oakville');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/areas/burlington — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/areas/burlington');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/how-it-works — loads with step content', async ({ page }) => {
    await gotoAndDismiss(page, '/how-it-works');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should have numbered steps or step headings
    await expect(
      page.locator('ol li').first()
        .or(page.getByText(/step 1/i))
        .or(page.locator('[class*="step"]').first())
    ).toBeVisible();
  });

  test('/how-rewards-work — loads and mentions rewards', async ({ page }) => {
    await gotoAndDismiss(page, '/how-rewards-work');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.getByText(/reward/i).first()).toBeVisible();
  });

  test('/providers — loads with Apply as a Pro CTA', async ({ page }) => {
    await gotoAndDismiss(page, '/providers');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(
      page
        .getByRole('link', { name: /apply/i })
        .or(page.getByRole('button', { name: /apply/i }))
        .first()
    ).toBeVisible();
  });

  test('/providers/apply — loads with form', async ({ page }) => {
    await gotoAndDismiss(page, '/providers/apply');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    // Should have a form or input fields
    await expect(
      page.locator('form').first()
        .or(page.locator('input').first())
    ).toBeVisible();
  });

  test('/help — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/help');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/contact — loads with form', async ({ page }) => {
    await gotoAndDismiss(page, '/contact');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(
      page.locator('form').first()
        .or(page.locator('input').first())
    ).toBeVisible();
  });

  test('/privacy — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/privacy');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/terms — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/terms');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/login — loads with email and password fields', async ({ page }) => {
    await gotoAndDismiss(page, '/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('/signup — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/signup');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/request-service — loads or redirects to login', async ({ page }) => {
    await gotoAndDismiss(page, '/request-service');
    // Either shows the form or redirects to login — both are valid for unauthenticated users
    const isOnLogin = page.url().includes('/login');
    const isOnRequestService = page.url().includes('/request-service');
    expect(isOnLogin || isOnRequestService).toBe(true);
    await expect(page.locator('body')).toBeVisible();
  });

  test('/services — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/services');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });
});
