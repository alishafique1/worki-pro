import type { PrismaClient } from "@prisma/client";
import { createProviderId, sanitizeAndSerializeProviderData } from "wasp/auth/utils";
import { REAL_PROVIDERS } from "../../consumer/providerProfileData";
import { seedVendorCategories } from "./dbSeeds";

const SEED_PASSWORD = "ChangeMe123"; // REVIEW: providers should reset via OTP/password-reset on first login

async function ensureEmailAuthIdentity(prisma: PrismaClient, email: string, password: string) {
  const providerId = createProviderId("email", email);
  const existingIdentity = await prisma.authIdentity.findUnique({
    where: { providerName_providerUserId: providerId },
  });

  if (existingIdentity) return;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`Cannot create auth identity: user ${email} not found`);
  }

  const providerData = await sanitizeAndSerializeProviderData({
    hashedPassword: password,
    isEmailVerified: true,
    emailVerificationSentAt: null,
    passwordResetSentAt: null,
  });

  await prisma.auth.create({
    data: {
      userId: user.id,
      identities: {
        create: {
          providerName: providerId.providerName,
          providerUserId: providerId.providerUserId,
          providerData,
        },
      },
    },
  });
}

export async function seedRealProviders(prisma: PrismaClient) {
  console.log("Seeding real providers...");

  // Ensure the canonical service categories exist (idempotent upsert by slug)
  // so provider→category links below resolve. The providers reference slugs
  // from DEFAULT_VENDOR_CATEGORIES (e.g. shisha-lounge, digital-marketing).
  await seedVendorCategories(prisma);

  for (const p of REAL_PROVIDERS) {
    // ── 1. Find-or-create User ─────────────────────────────────────────────
    let user = await prisma.user.findUnique({ where: { email: p.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: p.email,
          username: p.email,
          firstName: p.firstName,
          lastName: p.lastName,
          phone: p.phone || null,
          postalCode: p.postalCode,
          role: "PROVIDER",
          status: "ACTIVE",
        },
      });
    }

    // ── 2. Ensure email auth identity ──────────────────────────────────────
    await ensureEmailAuthIdentity(prisma, p.email, SEED_PASSWORD);

    // ── 3. Find-or-create Provider profile ────────────────────────────────
    let provider = await prisma.provider.findFirst({ where: { userId: user.id } });
    if (!provider) {
      provider = await prisma.provider.create({
        data: {
          userId: user.id,
          businessName: p.businessName,
          contactName: p.contactName,
          phone: p.phone || "",
          email: p.email,
          website: p.website,
          slug: p.slug,
          bio: p.bio,
          serviceAreas: p.serviceAreas,
          verificationStatus: "VERIFIED",
          active: true,
          ratingInternal: p.ratingInternal ?? null,
          insuranceStatus: true,
          referencesChecked: true,
          onboardingCallDone: true,
        },
      });
    }

    // ── 4. Link ProviderCategory rows by slug (idempotent) ─────────────────
    for (const slug of p.categorySlugs) {
      const cat = await prisma.serviceCategory.findFirst({ where: { slug } });
      if (!cat) {
        console.warn(`  ⚠ category slug "${slug}" not found in DB — skipping for ${p.businessName}`);
        continue;
      }
      const existingLink = await prisma.providerCategory.findFirst({
        where: { providerId: provider.id, serviceCategoryId: cat.id },
      });
      if (!existingLink) {
        await prisma.providerCategory.create({
          data: { providerId: provider.id, serviceCategoryId: cat.id },
        });
      }
    }

    console.log(`  ✓ ${p.businessName} (${p.slug})`);
  }

  console.log(`Seeded ${REAL_PROVIDERS.length} real providers.`);
}
