import { test, expect, Page } from '@playwright/test';

function uniqueEmail(prefix = 'playwright') {
  const ts = Date.now();
  return `${prefix}+${ts}@worki.test`;
}

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

async function login(page: Page, email: string, password: string, targetAfterLogin?: string) {
  await page.goto('/login');
  await dismissCookieConsent(page);

  await page.getByLabel(/e-?mail/i).or(page.locator('input[type="email"]')).first().fill(email);
  await page.getByLabel(/password/i).or(page.locator('input[type="password"]')).first().fill(password);
  await page.getByRole('button', { name: /log in/i }).click();

  await page.waitForURL(/\/(dashboard|onboarding|provider\/dashboard|provider\/apply)(\?.*)?$/i, {
    timeout: 15000,
  });

  if (targetAfterLogin) {
    await page.goto(targetAfterLogin);
    await dismissCookieConsent(page);
  }
}

test.describe('Couple (Consumer) Happy Path', () => {
  test('Signup → redirected to dashboard or onboarding', async ({ page }) => {
    const email = uniqueEmail('consumer');

    await page.goto('/signup');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();

    await page.getByRole('radio', { name: /homeowner/i }).check();
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /create account/i }).click();

    await page.waitForURL(/\/(dashboard|onboarding|provider\/apply|provider\/dashboard)?(\?.*)?$/i, {
      timeout: 15000,
    });
    await expect(page).toHaveURL(/\/(dashboard|onboarding|provider\/apply|provider\/dashboard)?(\?.*)?$/i);
  });

  test('Dashboard shows rewards widget and active jobs section', async ({ page }) => {
    await login(page, 'test@worki.ai', 'Password123!', '/dashboard');

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /requests & bookings/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /rewards/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /request new service/i })).toBeVisible();
  });

  test('Request service multi-step form renders all steps', async ({ page }) => {
    await login(page, 'test@worki.ai', 'Password123!', '/request-service');
    await expect(page.getByRole('heading', { name: /what kind of help do you need/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /tell us what is happening/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /where and when should we follow up/i })).toBeVisible();
    await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email address/i)).toBeVisible();
    await expect(page.getByPlaceholder(/phone number/i)).toBeVisible();
    await expect(page.getByLabel(/postal code/i)).toBeVisible();
  });

  test('Rewards page renders account balance', async ({ page }) => {
    await login(page, 'test@worki.ai', 'Password123!', '/rewards');
    await expect(page.getByRole('heading', { name: /rewards wallet/i })).toBeVisible();
    await expect(page.getByText(/available points/i)).toBeVisible();
  });
});

test.describe('Vendor Happy Path', () => {
  test('Provider signup and apply page renders', async ({ page }) => {
    const email = uniqueEmail('vendor');

    await page.goto('/signup');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();

    await page.getByRole('radio', { name: /service pro/i }).check();
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill('TestPass123!');
    await page.getByRole('button', { name: /create account/i }).click();

    await page.waitForURL(/\/(provider\/apply|providers\/apply|onboarding|provider\/dashboard)(\?.*)?$/, {
      timeout: 15000,
    });

    if (!/provider\/apply|providers\/apply/.test(page.url())) {
      await page.goto('/provider/apply');
    }

    await expect(page.getByRole('heading', { name: /apply/i })).toBeVisible();
  });

  test('Provider dashboard shows leads and appointments tabs', async ({ page }) => {
    await login(page, 'pro@worki.ai', 'Password123!', '/provider/dashboard');
    await expect(page.getByRole('heading', { name: /provider portal/i })).toBeVisible();
    await expect(page.getByText(/new leads/i)).toBeVisible();
  });
});

test.describe('Auth Pages', () => {
  test('Login page renders with form elements', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /sign up free/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /forgot password/i })).toBeVisible();
  });

  test('Signup page renders with role selector', async ({ page }) => {
    await page.goto('/signup');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    await expect(page.getByRole('radio', { name: /homeowner/i })).toBeVisible();
    await expect(page.getByRole('radio', { name: /service pro/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('Request password reset page renders', async ({ page }) => {
    await page.goto('/request-password-reset');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading', { name: /reset/i })).toBeVisible();
  });

  test('User can navigate between login and signup', async ({ page }) => {
    await page.goto('/login');
    await dismissCookieConsent(page);
    await page.getByRole('link', { name: /sign up free/i }).click();
    await page.waitForURL('/signup');
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();

    await page.getByRole('link', { name: /^log in$/i }).click();
    await page.waitForURL('/login');
    await expect(page.getByRole('heading', { name: /log in/i })).toBeVisible();
  });
});

test.describe('Public Pages', () => {
  test('Landing page renders', async ({ page }) => {
    await page.goto('/');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('How rewards work page renders', async ({ page }) => {
    await page.goto('/how-rewards-work');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('Provider landing page renders', async ({ page }) => {
    await page.goto('/providers');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading')).toBeVisible();
  });

  test('Terms and Privacy pages render', async ({ page }) => {
    await page.goto('/terms');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading')).toBeVisible();

    await page.goto('/privacy');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading')).toBeVisible();
  });
});

test.describe('Consumer Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, 'test@worki.ai', 'Password123!', '/dashboard');
  });

  test('My Requests page renders', async ({ page }) => {
    await page.goto('/my-requests');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading', { name: /my bookings & repairs/i })).toBeVisible();
  });

  test('Referral page renders', async ({ page }) => {
    await page.goto('/referral');
    await dismissCookieConsent(page);
    await expect(page.getByRole('heading', { name: /refer a friend/i })).toBeVisible();
  });
});
