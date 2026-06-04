import { defineConfig, devices } from '@playwright/test';

/**
 * TheHelper (helper.ca) E2E test suite.
 *
 * Default: target production via PLAYWRIGHT_BASE_URL env var.
 * The Wasp app does NOT expose a mapped port on this VPS — it runs
 * inside Docker behind Traefik/Cloudflare. Use PLAYWRIGHT_BASE_URL
 * to point at the live site or a staging deployment.
 *
 * Usage:
 *   npx playwright test                            # → thehelper.ca
 *   PLAYWRIGHT_BASE_URL=http://staging:3001 ...    # → staging
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 45000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://thehelper.ca',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
