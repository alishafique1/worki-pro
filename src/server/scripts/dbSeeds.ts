import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import { type User } from "wasp/entities";
import { createProviderId, sanitizeAndSerializeProviderData } from "wasp/auth/utils";

const LEGACY_TEST_PASSWORD = "Password123!";
const QA_TEST_PASSWORD = "WorkiTest123";

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

// ─── Default Service Categories ────────────────────────────────────────────
export const DEFAULT_VENDOR_CATEGORIES = [
  { name: "HVAC", slug: "hvac", description: "Heating, ventilation, and air conditioning" },
  { name: "Plumbing", slug: "plumbing", description: "Pipes, drains, water heaters, and fixtures" },
  { name: "Electrical", slug: "electrical", description: "Wiring, panels, outlets, and lighting" },
  { name: "Handyman", slug: "handyman", description: "General repairs and maintenance" },
  { name: "Appliance Repair", slug: "appliance-repair", description: "Major home appliances" },
  { name: "Smart Home", slug: "smart-home", description: "Smart thermostats, cameras, and automation" },
  { name: "Cleaning", slug: "cleaning", description: "House cleaning and maid services" },
  { name: "Painting", slug: "painting", description: "Interior and exterior painting" },
  { name: "Flooring", slug: "flooring", description: "Hardwood, tile, laminate, and carpet" },
  { name: "Roofing", slug: "roofing", description: "Roof repair and replacement" },
  { name: "Landscaping", slug: "landscaping", description: "Lawn care, gardens, and outdoor spaces" },
  { name: "Pest Control", slug: "pest-control", description: "Rodent and insect removal" },
  { name: "Locksmith", slug: "locksmith", description: "Lock installation and emergency entry" },
];

export async function seedVendorCategories(prisma: PrismaClient) {
  console.log("Seeding vendor service categories...");
  for (const cat of DEFAULT_VENDOR_CATEGORIES) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        active: true,
      },
    });
  }
  console.log(`Seeded ${DEFAULT_VENDOR_CATEGORIES.length} vendor categories.`);
}

export async function seedMockUsers(prisma: PrismaClient) {
  console.log("Seeding Worki Sample Data...");

  // 1. Ensure test consumer exists
  let consumer = await prisma.user.findUnique({ where: { username: "test@worki.ai" } });
  if (!consumer) {
    consumer = await prisma.user.create({
      data: {
        email: "test@worki.ai",
        username: "test@worki.ai",
        firstName: "Test",
        lastName: "Consumer",
        role: "CONSUMER",
        status: "ACTIVE",
      }
    });
  }
  await ensureEmailAuthIdentity(prisma, "test@worki.ai", LEGACY_TEST_PASSWORD);

  // Additional QA account used in docs/manual testing.
  let qaConsumer = await prisma.user.findUnique({ where: { username: "consumer.test@worki.ai" } });
  if (!qaConsumer) {
    qaConsumer = await prisma.user.create({
      data: {
        email: "consumer.test@worki.ai",
        username: "consumer.test@worki.ai",
        firstName: "Consumer",
        lastName: "Tester",
        role: "CONSUMER",
        status: "ACTIVE",
      }
    });
  }
  await ensureEmailAuthIdentity(prisma, "consumer.test@worki.ai", QA_TEST_PASSWORD);

  // Ensure consumer has a reward account
  const rewardAcct = await prisma.rewardAccount.findUnique({ where: { consumerId: consumer.id } });
  if (!rewardAcct) {
    await prisma.rewardAccount.create({
      data: {
        consumerId: consumer.id,
        pointsBalance: 1250,
        level: "SMART_MAINTAINER",
        lifetimePoints: 1250
      }
    });
  }

  // 2. Ensure test provider exists
  let providerUser = await prisma.user.findUnique({ where: { username: "pro.test@worki.ai" } });
  if (!providerUser) {
    providerUser = await prisma.user.create({
      data: {
        email: "pro.test@worki.ai",
        username: "pro.test@worki.ai",
        firstName: "Pro",
        lastName: "Worker",
        role: "PROVIDER",
        status: "ACTIVE",
      }
    });
  }
  await ensureEmailAuthIdentity(prisma, "pro.test@worki.ai", QA_TEST_PASSWORD);

  let provider = await prisma.provider.findFirst({ where: { userId: providerUser.id } });
  if (!provider) {
    provider = await prisma.provider.create({
      data: {
        userId: providerUser.id,
        businessName: "Elite Home Services",
        phone: "555-0199",
        serviceAreas: ["10001", "New York"],
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE"
      }
    });
  }

  // 3. Create Sample Service Requests
  console.log("Creating Sample Requests...");
  
  // A NEW request (waiting to be accepted)
  await prisma.serviceRequest.create({
    data: {
      consumerId: consumer.id,
      name: consumer.firstName || 'Customer',
      phone: "555-1234",
      postalCode: "10001",
      city: "New York",
      description: "Leaking pipe under the kitchen sink, need help ASAP.",
      urgency: "EMERGENCY",
      status: "NEW"
    }
  });

  // An ASSIGNED request (accepted by provider)
  const assignedReq = await prisma.serviceRequest.create({
    data: {
      consumerId: consumer.id,
      name: consumer.firstName || 'Customer',
      phone: "555-5678",
      postalCode: "10001",
      city: "New York",
      description: "Install 2 ceiling fans in bedrooms.",
      urgency: "STANDARD",
      status: "ASSIGNED",
      assignedProviderId: provider.id
    }
  });

  // Create an appointment for the assigned request
  await prisma.appointment.create({
    data: {
      serviceRequestId: assignedReq.id,
      providerId: provider.id,
      consumerId: consumer.id,
      status: "CONFIRMED",
      scheduledAt: new Date(Date.now() + 86400000) // Tomorrow
    }
  });

  console.log("Seeding complete! Check your Consumer and Provider Dashboards.");
}
