import { test, expect } from "@playwright/test";

// ─── Helper: generate a unique email per run ──────────────────────────────────
function uniqueEmail(prefix = "playwright") {
  const ts = Date.now();
  return `${prefix}+${ts}@worki.test`;
}

// ─── Scenario 1: Consumer – Signup → Dashboard → Request Service ───────────────
test.describe("Couple (Consumer) Happy Path", () => {
  test("Signup → redirected to dashboard", async ({ page }) => {
    const email = uniqueEmail("consumer");

    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();

    // Select homeowner role
    await page.getByRole("radio", { name: /homeowner/i }).check();

    // Fill form
    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', "TestPass123!");

    // Submit
    await page.getByRole("button", { name: /create account/i }).click();

    // Should land on dashboard (Wasp post-auth redirect or home)
    // Allow either "/" or "/dashboard" depending on Wasp config
    await page.waitForURL(/\/(|dashboard)/, { timeout: 10_000 });
  });

  test("Dashboard shows rewards widget and active jobs section", async ({ page }) => {
    // Seeded test user is pre-authenticated in CI via environment
    // For local dev, log in first
    await page.goto("/login");
    await page.fill('input[id="email"]', "test@worki.ai");
    await page.fill('input[id="password"]', "Password123!");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL("/dashboard", { timeout: 10_000 });

    // Dashboard headings
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /active jobs/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /your wallet/i })).toBeVisible();

    // Request service CTA
    await expect(page.getByRole("link", { name: /request new service/i })).toBeVisible();
  });

  test("Request service multi-step form renders all steps", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[id="email"]', "test@worki.ai");
    await page.fill('input[id="password"]', "Password123!");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL("/dashboard", { timeout: 10_000 });

    await page.goto("/request-service");
    await expect(page.getByRole("heading", { name: /request service/i })).toBeVisible();

    // Step 1 – contact info
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/phone/i)).toBeVisible();
    await expect(page.getByLabel(/postal code/i)).toBeVisible();

    // Advance to step 2
    await page.getByRole("button", { name: /next/i }).click();
    await expect(page.getByLabel(/description/i)).toBeVisible();

    // Advance to step 3
    await page.getByRole("button", { name: /next/i }).click();
    await expect(page.getByRole("button", { name: /submit request/i }).or(page.getByRole("button", { name: /send request/i }))).toBeVisible();
  });

  test("Rewards page renders account balance", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[id="email"]', "test@worki.ai");
    await page.fill('input[id="password"]', "Password123!");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL("/dashboard", { timeout: 10_000 });

    await page.goto("/rewards");
    await expect(page.getByRole("heading", { name: /rewards/i })).toBeVisible();
    await expect(page.getByText(/available points/i)).toBeVisible();
  });
});

// ─── Scenario 2: Vendor – Signup → Provider Apply → Dashboard ─────────────────
test.describe("Vendor Happy Path", () => {
  test("Provider signup and apply page renders", async ({ page }) => {
    const email = uniqueEmail("vendor");

    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();

    // Select Service Pro role
    await page.getByRole("radio", { name: /service pro/i }).check();

    await page.fill('input[id="email"]', email);
    await page.fill('input[id="password"]', "TestPass123!");
    await page.getByRole("button", { name: /create account/i }).click();

    // Should redirect to provider apply page (Wasp auth redirect based on role)
    await page.waitForURL(/\/(provider\/apply|providers\/apply)/, { timeout: 10_000 });
    await expect(page.getByRole("heading", { name: /apply/i, exact: false })).toBeVisible();
  });

  test("Provider dashboard shows leads and appointments tabs", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[id="email"]', "pro@worki.ai");
    await page.fill('input[id="password"]', "Password123!");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL("/provider/dashboard", { timeout: 10_000 });

    await expect(page.getByRole("heading", { name: /provider portal/i })).toBeVisible();
    await expect(page.getByText(/new leads/i)).toBeVisible();
  });
});

// ─── Scenario 3: Auth Pages ───────────────────────────────────────────────────
test.describe("Auth Pages", () => {
  test("Login page renders with form elements", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /go to signup/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /reset it/i })).toBeVisible();
  });

  test("Signup page renders with role selector", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /homeowner/i })).toBeVisible();
    await expect(page.getByRole("radio", { name: /service pro/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /create account/i })).toBeVisible();
  });

  test("Request password reset page renders", async ({ page }) => {
    await page.goto("/request-password-reset");
    await expect(page.getByRole("heading", { name: /reset/i, exact: false })).toBeVisible();
  });

  test("User can navigate between login and signup", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /go to signup/i }).click();
    await page.waitForURL("/signup");
    await expect(page.getByRole("heading", { name: /create your account/i })).toBeVisible();

    await page.getByRole("link", { name: /sign in/i }).click();
    await page.waitForURL("/login");
    await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible();
  });
});

// ─── Scenario 4: Public Pages ─────────────────────────────────────────────────
test.describe("Public Pages", () => {
  test("Landing page renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("How rewards work page renders", async ({ page }) => {
    await page.goto("/how-rewards-work");
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("Provider landing page renders", async ({ page }) => {
    await page.goto("/providers");
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("Terms and Privacy pages render", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading")).toBeVisible();

    await page.goto("/privacy");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});

// ─── Scenario 5: Consumer Navigation ─────────────────────────────────────────
test.describe("Consumer Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[id="email"]', "test@worki.ai");
    await page.fill('input[id="password"]', "Password123!");
    await page.getByRole("button", { name: /log in/i }).click();
    await page.waitForURL("/dashboard", { timeout: 10_000 });
  });

  test("My Requests page renders", async ({ page }) => {
    await page.goto("/my-requests");
    await expect(page.getByRole("heading")).toBeVisible();
  });

  test("Referral page renders", async ({ page }) => {
    await page.goto("/referral");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
