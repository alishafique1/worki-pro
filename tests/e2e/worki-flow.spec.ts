import { test, expect } from '@playwright/test';

test.describe('Worki End-to-End Flow', () => {
  test('Provider Dashboard renders correctly', async ({ page }) => {
    // 1. Navigate to the login page
    await page.goto('/login');
    
    // We are expecting the "Log in to your account" heading
    await expect(page.locator('text=Log in to your account')).toBeVisible();
    
    // Log in as the test user. (Note: Wasp uses standard input types)
    await page.fill('input[type="email"]', 'test@worki.ai');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for the redirect to the dashboard
    await page.waitForURL('/dashboard');
    
    // 2. Navigate to the Provider Portal
    await page.goto('/provider/dashboard');
    
    // 3. Verify the Provider Dashboard is populated
    await expect(page.locator('text=Provider Portal')).toBeVisible();
    
    // We expect the "New Leads" column to exist
    await expect(page.locator('text=New Leads')).toBeVisible();
  });
});
