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
  test('/ — landing page loads with Get Help Now CTA', async ({ page }) => {
    await gotoAndDismiss(page, '/');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(
      page.getByRole('link', { name: /get help/i }).first()
    ).toBeVisible();
  });

  test('/hvac — loads with HVAC heading', async ({ page }) => {
    await gotoAndDismiss(page, '/hvac');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
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
    await expect(page.locator('form')).toBeVisible();
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
    await expect(page.locator('form')).toBeVisible();
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

  test('/login — loads with email field (OTP default)', async ({ page }) => {
    await gotoAndDismiss(page, '/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /send/i }).first()).toBeVisible();
  });

  test('/signup — redirects to /login', async ({ page }) => {
    await gotoAndDismiss(page, '/signup');
    await expect(page).toHaveURL(/\/login/);
  });

  test('/request-service — redirects to /get-quotes', async ({ page }) => {
    await gotoAndDismiss(page, '/request-service');
    await expect(page).toHaveURL(/\/get-quotes/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('/services — loads', async ({ page }) => {
    await gotoAndDismiss(page, '/services');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('/services/hvac — dynamic category page loads', async ({ page }) => {
    await gotoAndDismiss(page, '/services/hvac');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('/services/plumbing — dynamic category page loads', async ({ page }) => {
    await gotoAndDismiss(page, '/services/plumbing');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 10000 });
  });

  test('footer shows The Helper branding', async ({ page }) => {
    await gotoAndDismiss(page, '/');
    await expect(
      page.getByText(/the helper/i).first()
        .or(page.getByText(/thehelper/i).first())
    ).toBeVisible();
  });

  test('area pages have local content', async ({ page }) => {
    await gotoAndDismiss(page, '/areas/milton');
    await expect(
      page.getByText(/homeowner|neighbour|local/i).first()
    ).toBeVisible();
  });
});
