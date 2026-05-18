import { faker } from "@faker-js/faker";
import type { PrismaClient } from "@prisma/client";
import { type User } from "wasp/entities";
import { createProviderId, sanitizeAndSerializeProviderData } from "wasp/auth/utils";

const LEGACY_TEST_PASSWORD = "Password123!";
const QA_TEST_PASSWORD = "WorkiTest123";
const TEST_PASSWORD = "HelperTest123";

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

// ─── Category Hierarchy ────────────────────────────────────────────────────
// Parent categories define the top-level "type of help" sections.
// Each child carries its parent's slug for association.
// imageUrl: Unsplash photo (1280×720, auto format, q=80)

type ParentCat = {
  name: string; slug: string; description: string;
  icon: string; imageUrl: string; sortOrder: number;
  children: ChildCat[];
};

type ChildCat = {
  name: string; slug: string; description: string;
  icon: string; imageUrl: string; sortOrder: number;
};

export const CATEGORY_TREE: ParentCat[] = [
  {
    name: "Repair & Maintenance",
    slug: "repair-maintenance",
    description: "Fix it fast. Keep your home running safely and efficiently.",
    icon: "🔧",
    imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1280&q=80&auto=format",
    sortOrder: 1,
    children: [
      { name: "HVAC", slug: "hvac", description: "Heating, cooling, furnaces, and air quality.", icon: "❄️", imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1280&q=80&auto=format", sortOrder: 1 },
      { name: "Plumbing", slug: "plumbing", description: "Leaks, drains, water heaters, and fixtures.", icon: "🚿", imageUrl: "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1280&q=80&auto=format", sortOrder: 2 },
      { name: "Electrical", slug: "electrical", description: "Outlets, panels, EV chargers, and safety.", icon: "⚡", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1280&q=80&auto=format", sortOrder: 3 },
      { name: "Appliance Repair", slug: "appliance-repair", description: "Fridges, washers, dryers, stoves, dishwashers.", icon: "🔨", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80&auto=format", sortOrder: 4 },
      { name: "Roofing", slug: "roofing", description: "Roof inspections, repairs, and replacements.", icon: "🏠", imageUrl: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?w=1280&q=80&auto=format", sortOrder: 5 },
      { name: "Locksmith", slug: "locksmith", description: "Lock installation, re-keying, and emergency entry.", icon: "🔑", imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1280&q=80&auto=format", sortOrder: 6 },
      { name: "Handyman", slug: "handyman", description: "General repairs, mounting, assembly, and odd jobs.", icon: "🛠️", imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1280&q=80&auto=format", sortOrder: 7 },
    ],
  },
  {
    name: "Cleaning & Upkeep",
    slug: "cleaning-upkeep",
    description: "A clean home, handled. Regular or one-time, inside and out.",
    icon: "✨",
    imageUrl: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=1280&q=80&auto=format",
    sortOrder: 2,
    children: [
      { name: "House Cleaning", slug: "cleaning", description: "Regular, deep clean, move-in/move-out services.", icon: "🧹", imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=1280&q=80&auto=format", sortOrder: 1 },
      { name: "Window Cleaning", slug: "window-cleaning", description: "Interior and exterior window washing.", icon: "🪟", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80&auto=format", sortOrder: 2 },
      { name: "Carpet Cleaning", slug: "carpet-cleaning", description: "Steam cleaning, stain removal, and odour treatment.", icon: "🛋️", imageUrl: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1280&q=80&auto=format", sortOrder: 3 },
      { name: "Pressure Washing", slug: "pressure-washing", description: "Driveways, decks, siding, and fences.", icon: "💦", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80&auto=format", sortOrder: 4 },
    ],
  },
  {
    name: "Outdoor & Landscaping",
    slug: "outdoor-landscaping",
    description: "Curb appeal and outdoor living — all season long.",
    icon: "🌿",
    imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1280&q=80&auto=format",
    sortOrder: 3,
    children: [
      { name: "Lawn Care", slug: "landscaping", description: "Mowing, edging, fertilizing, and seasonal cleanup.", icon: "🌱", imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1280&q=80&auto=format", sortOrder: 1 },
      { name: "Snow Removal", slug: "snow-removal", description: "Driveways, walkways, and salting services.", icon: "❄️", imageUrl: "https://images.unsplash.com/photo-1547754980-3df97fed72a8?w=1280&q=80&auto=format", sortOrder: 2 },
      { name: "Tree Services", slug: "tree-services", description: "Trimming, removal, stump grinding, and emergency.", icon: "🌳", imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1280&q=80&auto=format", sortOrder: 3 },
      { name: "Pest Control", slug: "pest-control", description: "Rodent, insect, and wildlife removal and prevention.", icon: "🐛", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80&auto=format", sortOrder: 4 },
      { name: "Irrigation & Sprinklers", slug: "irrigation", description: "System installation, startup, winterization.", icon: "💧", imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1280&q=80&auto=format", sortOrder: 5 },
    ],
  },
  {
    name: "Renovation & Improvement",
    slug: "renovation-improvement",
    description: "Transform your space. Kitchens, bathrooms, basements, and beyond.",
    icon: "🏗️",
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1280&q=80&auto=format",
    sortOrder: 4,
    children: [
      { name: "Painting", slug: "painting", description: "Interior and exterior painting, colour consultation.", icon: "🎨", imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1280&q=80&auto=format", sortOrder: 1 },
      { name: "Flooring", slug: "flooring", description: "Hardwood, tile, laminate, vinyl, and carpet installation.", icon: "🪵", imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1280&q=80&auto=format", sortOrder: 2 },
      { name: "Kitchen Remodeling", slug: "kitchen-remodeling", description: "Cabinets, countertops, backsplash, and full renos.", icon: "🍳", imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1280&q=80&auto=format", sortOrder: 3 },
      { name: "Bathroom Remodeling", slug: "bathroom-remodeling", description: "Vanities, tiling, fixtures, and full bathroom renos.", icon: "🛁", imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1280&q=80&auto=format", sortOrder: 4 },
      { name: "Basement Finishing", slug: "basement-finishing", description: "Framing, drywall, flooring, and egress windows.", icon: "🏠", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80&auto=format", sortOrder: 5 },
      { name: "Deck & Fence", slug: "deck-fence", description: "New builds, repairs, staining, and waterproofing.", icon: "🪜", imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1280&q=80&auto=format", sortOrder: 6 },
    ],
  },
  {
    name: "Smart Home & Security",
    slug: "smart-home-security",
    description: "Automate, secure, and future-proof your home.",
    icon: "📱",
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1280&q=80&auto=format",
    sortOrder: 5,
    children: [
      { name: "Smart Home Setup", slug: "smart-home", description: "Thermostats, speakers, lighting, and automation.", icon: "🏠", imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1280&q=80&auto=format", sortOrder: 1 },
      { name: "Security Cameras", slug: "security-cameras", description: "Indoor/outdoor cameras, NVR, and monitoring setup.", icon: "📹", imageUrl: "https://images.unsplash.com/photo-1557597774-9d475d5a53d5?w=1280&q=80&auto=format", sortOrder: 2 },
      { name: "EV Charger Installation", slug: "ev-charger", description: "Level 2 home charger installation and permits.", icon: "⚡", imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=1280&q=80&auto=format", sortOrder: 3 },
      { name: "Home Theatre", slug: "home-theatre", description: "TV mounting, surround sound, and media room setup.", icon: "📺", imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1280&q=80&auto=format", sortOrder: 4 },
    ],
  },
  {
    name: "Moving & Storage",
    slug: "moving-storage",
    description: "Moving day, made easier. Local moves, junk removal, and packing.",
    icon: "📦",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80&auto=format",
    sortOrder: 6,
    children: [
      { name: "Local Moving", slug: "local-moving", description: "Full-service local moves with truck and crew.", icon: "🚛", imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1280&q=80&auto=format", sortOrder: 1 },
      { name: "Junk Removal", slug: "junk-removal", description: "Furniture, appliances, yard waste, and full cleanouts.", icon: "🗑️", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1280&q=80&auto=format", sortOrder: 2 },
      { name: "Furniture Assembly", slug: "furniture-assembly", description: "IKEA, flatpack, and any home furniture.", icon: "🪑", imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1280&q=80&auto=format", sortOrder: 3 },
    ],
  },
  {
    name: "Events & Celebrations",
    slug: "events-celebrations",
    description: "Make any occasion unforgettable. Decorators, caterers, entertainment, and event vendors across the GTA.",
    icon: "🎉",
    imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=1280&q=80&auto=format",
    sortOrder: 7,
    children: [
      { name: "Event Decorating", slug: "event-decorating", description: "Balloons, florals, backdrops, and full venue styling.", icon: "🎊", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1280&q=80&auto=format", sortOrder: 1 },
      { name: "Catering & Food Stalls", slug: "catering", description: "Full catering, food trucks, dessert tables, and bar service.", icon: "🍽️", imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1280&q=80&auto=format", sortOrder: 2 },
      { name: "Photography & Video", slug: "photography", description: "Event photographers, videographers, and photo booths.", icon: "📸", imageUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1280&q=80&auto=format", sortOrder: 3 },
      { name: "DJ & Entertainment", slug: "entertainment-dj", description: "DJs, live bands, MCs, kids entertainers, and performers.", icon: "🎵", imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1280&q=80&auto=format", sortOrder: 4 },
      { name: "Party Rentals", slug: "party-rentals", description: "Tents, tables, chairs, linens, bounce houses, and more.", icon: "⛺", imageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1280&q=80&auto=format", sortOrder: 5 },
      { name: "Floral Arrangements", slug: "floral", description: "Wedding flowers, centrepieces, bouquets, and fresh arrangements.", icon: "💐", imageUrl: "https://images.unsplash.com/photo-1487530811015-780df8fddc50?w=1280&q=80&auto=format", sortOrder: 6 },
      { name: "Venue Booking", slug: "venue-booking", description: "Halls, banquet spaces, gardens, and unique event venues.", icon: "🏛️", imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1280&q=80&auto=format", sortOrder: 7 },
    ],
  },
];

// Flat list derived from tree (legacy compat + quick lookup)
export const DEFAULT_VENDOR_CATEGORIES = CATEGORY_TREE.flatMap(p =>
  p.children.map(c => ({ name: c.name, slug: c.slug, description: c.description }))
);

export async function seedVendorCategories(prisma: PrismaClient) {
  console.log("Seeding vendor service categories (hierarchical)...");
  let total = 0;

  for (const parent of CATEGORY_TREE) {
    // Upsert parent
    const parentRecord = await prisma.serviceCategory.upsert({
      where: { slug: parent.slug },
      update: { name: parent.name, description: parent.description, icon: parent.icon, imageUrl: parent.imageUrl, sortOrder: parent.sortOrder, active: true },
      create: { name: parent.name, slug: parent.slug, description: parent.description, icon: parent.icon, imageUrl: parent.imageUrl, sortOrder: parent.sortOrder, active: true },
    });
    total++;

    // Upsert children linked to parent
    for (const child of parent.children) {
      await prisma.serviceCategory.upsert({
        where: { slug: child.slug },
        update: { name: child.name, description: child.description, icon: child.icon, imageUrl: child.imageUrl, sortOrder: child.sortOrder, parentCategoryId: parentRecord.id, active: true },
        create: { name: child.name, slug: child.slug, description: child.description, icon: child.icon, imageUrl: child.imageUrl, sortOrder: child.sortOrder, parentCategoryId: parentRecord.id, active: true },
      });
      total++;
    }
  }

  console.log(`Seeded ${total} categories (${CATEGORY_TREE.length} parents, ${total - CATEGORY_TREE.length} sub-categories).`);
}

export async function seedMockUsers(prisma: PrismaClient) {
  console.log("Seeding The Helper Sample Data...");

  // ─── GTA Service Areas ─────────────────────────────────────────────────────
  const GTA_SERVICE_AREAS = ["L9T", "L6J", "L7R", "Milton", "Oakville", "Burlington"];

  // ─── 1. Admin account ──────────────────────────────────────────────────────
  let adminUser = await prisma.user.findUnique({ where: { email: "admin@thehelper.ca" } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: "admin@thehelper.ca",
        username: "admin@thehelper.ca",
        firstName: "Admin",
        lastName: "TheHelper",
        role: "ADMIN",
        isAdmin: true,
        status: "ACTIVE",
      },
    });
  }
  await ensureEmailAuthIdentity(prisma, "admin@thehelper.ca", TEST_PASSWORD);

  // ─── 2. Consumer: Sarah Chen ───────────────────────────────────────────────
  let sarahUser = await prisma.user.findUnique({ where: { email: "consumer@thehelper.ca" } });
  if (!sarahUser) {
    sarahUser = await prisma.user.create({
      data: {
        email: "consumer@thehelper.ca",
        username: "consumer@thehelper.ca",
        firstName: "Sarah",
        lastName: "Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        role: "CONSUMER",
        status: "ACTIVE",
        smsConsent: true,
        emailConsent: true,
      },
    });
  }
  await ensureEmailAuthIdentity(prisma, "consumer@thehelper.ca", TEST_PASSWORD);

  // ─── 3. Consumer 2: James Kowalski ─────────────────────────────────────────
  let jamesUser = await prisma.user.findUnique({ where: { email: "consumer2@thehelper.ca" } });
  if (!jamesUser) {
    jamesUser = await prisma.user.create({
      data: {
        email: "consumer2@thehelper.ca",
        username: "consumer2@thehelper.ca",
        firstName: "James",
        lastName: "Kowalski",
        phone: "905-338-7712",
        postalCode: "L6J 2X8",
        role: "CONSUMER",
        status: "ACTIVE",
        smsConsent: true,
        emailConsent: true,
      },
    });
  }
  await ensureEmailAuthIdentity(prisma, "consumer2@thehelper.ca", TEST_PASSWORD);

  // ─── 4. Provider: Mike Torres — Comfort Zone HVAC ──────────────────────────
  let mikeProviderUser = await prisma.user.findUnique({ where: { email: "hvac@thehelper.ca" } });
  if (!mikeProviderUser) {
    mikeProviderUser = await prisma.user.create({
      data: {
        email: "hvac@thehelper.ca",
        username: "hvac@thehelper.ca",
        firstName: "Mike",
        lastName: "Torres",
        phone: "905-878-1155",
        postalCode: "L9T 0A1",
        role: "PROVIDER",
        status: "ACTIVE",
      },
    });
  }
  await ensureEmailAuthIdentity(prisma, "hvac@thehelper.ca", TEST_PASSWORD);

  let mikeProvider = await prisma.provider.findFirst({ where: { userId: mikeProviderUser.id } });
  if (!mikeProvider) {
    mikeProvider = await prisma.provider.create({
      data: {
        userId: mikeProviderUser.id,
        businessName: "Comfort Zone HVAC",
        contactName: "Mike Torres",
        phone: "905-878-1155",
        email: "hvac@thehelper.ca",
        slug: "comfort-zone-hvac",
        bio: "Family-owned HVAC company serving Milton, Oakville, and Burlington since 2009. We specialize in central air conditioning, furnace repair and replacement, heat pumps, and seasonal tune-ups. All technicians are TSSA-certified and carry $2M liability insurance. Same-day service available for emergencies.",
        serviceAreas: GTA_SERVICE_AREAS,
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE",
        ratingInternal: 4.9,
        responseTimeMins: 30,
        insuranceStatus: true,
        tssaVerified: true,
        referencesChecked: true,
        onboardingCallDone: true,
      },
    });
  }

  // Link Mike to HVAC category
  const hvacCategory = await prisma.serviceCategory.findFirst({ where: { slug: "hvac" } });
  if (hvacCategory) {
    const existingHvacLink = await prisma.providerCategory.findFirst({
      where: { providerId: mikeProvider.id, serviceCategoryId: hvacCategory.id },
    });
    if (!existingHvacLink) {
      await prisma.providerCategory.create({
        data: { providerId: mikeProvider.id, serviceCategoryId: hvacCategory.id },
      });
    }
  }

  // Mike's qualified lead fee
  const mikeFee = await prisma.providerFee.findFirst({
    where: { providerId: mikeProvider.id, feeType: "QUALIFIED_LEAD" },
  });
  if (!mikeFee) {
    await prisma.providerFee.create({
      data: {
        providerId: mikeProvider.id,
        feeType: "QUALIFIED_LEAD",
        amount: 5.00,
        status: "PAID",
      },
    });
  }

  // ─── 5. Provider: Dave Singh — Singh Plumbing Co. ──────────────────────────
  let davePlumberUser = await prisma.user.findUnique({ where: { email: "plumber@thehelper.ca" } });
  if (!davePlumberUser) {
    davePlumberUser = await prisma.user.create({
      data: {
        email: "plumber@thehelper.ca",
        username: "plumber@thehelper.ca",
        firstName: "Dave",
        lastName: "Singh",
        phone: "905-338-4490",
        postalCode: "L6J 0B3",
        role: "PROVIDER",
        status: "ACTIVE",
      },
    });
  }
  await ensureEmailAuthIdentity(prisma, "plumber@thehelper.ca", TEST_PASSWORD);

  let daveProvider = await prisma.provider.findFirst({ where: { userId: davePlumberUser.id } });
  if (!daveProvider) {
    daveProvider = await prisma.provider.create({
      data: {
        userId: davePlumberUser.id,
        businessName: "Singh Plumbing Co.",
        contactName: "Dave Singh",
        phone: "905-338-4490",
        email: "plumber@thehelper.ca",
        slug: "singh-plumbing-co",
        bio: "Licensed master plumber with 15+ years serving the Halton Region. We handle everything from emergency leak repairs and drain clearing to full bathroom renovations and water heater installations. Upfront pricing, no hidden fees. Available 7 days a week.",
        serviceAreas: GTA_SERVICE_AREAS,
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE",
        ratingInternal: 4.8,
        responseTimeMins: 45,
        insuranceStatus: true,
        referencesChecked: true,
        onboardingCallDone: true,
      },
    });
  }

  // Link Dave to Plumbing category
  const plumbingCategory = await prisma.serviceCategory.findFirst({ where: { slug: "plumbing" } });
  if (plumbingCategory) {
    const existingPlumbingLink = await prisma.providerCategory.findFirst({
      where: { providerId: daveProvider.id, serviceCategoryId: plumbingCategory.id },
    });
    if (!existingPlumbingLink) {
      await prisma.providerCategory.create({
        data: { providerId: daveProvider.id, serviceCategoryId: plumbingCategory.id },
      });
    }
  }

  // Dave's qualified lead fee
  const daveFee = await prisma.providerFee.findFirst({
    where: { providerId: daveProvider.id, feeType: "QUALIFIED_LEAD" },
  });
  if (!daveFee) {
    await prisma.providerFee.create({
      data: {
        providerId: daveProvider.id,
        feeType: "QUALIFIED_LEAD",
        amount: 5.00,
        status: "PAID",
      },
    });
  }

  // ─── 6. Reward Account for Sarah Chen ──────────────────────────────────────
  const sarahRewardAcct = await prisma.rewardAccount.findUnique({ where: { consumerId: sarahUser.id } });
  if (!sarahRewardAcct) {
    await prisma.rewardAccount.create({
      data: {
        consumerId: sarahUser.id,
        pointsBalance: 1250,
        level: "SMART_MAINTAINER",
        lifetimePoints: 3750,
      },
    });
  }

  // ─── 7. Service Requests for Sarah Chen ────────────────────────────────────

  // 7a. COMPLETED HVAC request
  let hvacReq = await prisma.serviceRequest.findFirst({
    where: { consumerId: sarahUser.id, status: "COMPLETED" },
  });
  if (!hvacReq) {
    hvacReq = await prisma.serviceRequest.create({
      data: {
        consumerId: sarahUser.id,
        name: "Sarah Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        city: "Milton",
        description: "AC not cooling — unit is 8 years old, stops after 20 min",
        urgency: "STANDARD",
        status: "COMPLETED",
        assignedProviderId: mikeProvider.id,
        completedAt: new Date(Date.now() - 7 * 86400000),
      },
    });
  }

  // 7b. NEW Plumbing request
  let plumbingReq = await prisma.serviceRequest.findFirst({
    where: { consumerId: sarahUser.id, status: "NEW" },
  });
  if (!plumbingReq) {
    plumbingReq = await prisma.serviceRequest.create({
      data: {
        consumerId: sarahUser.id,
        name: "Sarah Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        city: "Milton",
        description: "Leaky kitchen faucet, dripping constantly for 2 days",
        urgency: "STANDARD",
        status: "NEW",
      },
    });
  }

  // 7c. ASSIGNED Electrical request
  let electricalReq = await prisma.serviceRequest.findFirst({
    where: { consumerId: sarahUser.id, status: "ASSIGNED" },
  });
  if (!electricalReq) {
    electricalReq = await prisma.serviceRequest.create({
      data: {
        consumerId: sarahUser.id,
        name: "Sarah Chen",
        phone: "905-876-4421",
        postalCode: "L9T 3L2",
        city: "Milton",
        description: "Install 3 pot lights in living room, existing wiring available",
        urgency: "PLANNED",
        status: "ASSIGNED",
        assignedProviderId: mikeProvider.id,
      },
    });
  }

  // ─── 8. Reward Transactions for Sarah ──────────────────────────────────────
  const existingTxCount = await prisma.rewardTransaction.count({ where: { consumerId: sarahUser.id } });
  if (existingTxCount === 0) {
    await prisma.rewardTransaction.createMany({
      data: [
        {
          consumerId: sarahUser.id,
          serviceRequestId: hvacReq.id,
          type: "SERVICE_REQUEST",
          points: 500,
          status: "APPROVED",
          reason: "Submitted HVAC request",
        },
        {
          consumerId: sarahUser.id,
          serviceRequestId: hvacReq.id,
          type: "COMPLETED_SERVICE",
          points: 5000,
          status: "APPROVED",
          reason: "AC repair job completed",
        },
        {
          consumerId: sarahUser.id,
          serviceRequestId: plumbingReq.id,
          type: "SERVICE_REQUEST",
          points: 500,
          status: "APPROVED",
          reason: "Submitted plumbing request",
        },
      ],
    });
  }

  // ─── 9. Appointment for the completed HVAC request ─────────────────────────
  const existingAppt = await prisma.appointment.findFirst({
    where: { serviceRequestId: hvacReq.id, providerId: mikeProvider.id },
  });
  if (!existingAppt) {
    await prisma.appointment.create({
      data: {
        serviceRequestId: hvacReq.id,
        providerId: mikeProvider.id,
        consumerId: sarahUser.id,
        status: "COMPLETED",
        scheduledAt: new Date(Date.now() - 7 * 86400000),
        completedAt: new Date(Date.now() - 7 * 86400000),
      },
    });
  }

  // ─── 10. Review for the completed HVAC request ─────────────────────────────
  const existingReview = await prisma.review.findFirst({
    where: { providerId: mikeProvider.id, consumerId: sarahUser.id, serviceRequestId: hvacReq.id },
  });
  if (!existingReview) {
    await prisma.review.create({
      data: {
        providerId: mikeProvider.id,
        consumerId: sarahUser.id,
        serviceRequestId: hvacReq.id,
        rating: 5,
        body: "Mike diagnosed the issue within 10 minutes and had the AC running the same day. Very professional, explained everything clearly.",
        status: "PUBLISHED",
      },
    });
    // Update provider rating after review creation
    await prisma.provider.update({
      where: { id: mikeProvider.id },
      data: { ratingInternal: 4.9 },
    });
  }

  // ─── 11. Communication Logs on the electrical (assigned) request ────────────
  const existingLogs = await prisma.communicationLog.count({
    where: { serviceRequestId: electricalReq.id },
  });
  if (existingLogs === 0) {
    await prisma.communicationLog.createMany({
      data: [
        {
          userId: sarahUser.id,
          serviceRequestId: electricalReq.id,
          channel: "INTERNAL_NOTE",
          direction: "OUTBOUND",
          from: sarahUser.email ?? "consumer@thehelper.ca",
          to: mikeProviderUser.email ?? "hvac@thehelper.ca",
          body: "Hi, when can you come by for the pot lights?",
        },
        {
          userId: mikeProviderUser.id,
          serviceRequestId: electricalReq.id,
          providerId: mikeProvider.id,
          channel: "INTERNAL_NOTE",
          direction: "OUTBOUND",
          from: mikeProviderUser.email ?? "hvac@thehelper.ca",
          to: sarahUser.email ?? "consumer@thehelper.ca",
          body: "I can do Thursday afternoon between 2–4pm. Does that work?",
        },
      ],
    });
  }

  console.log("✓ GTA test accounts and sample data seeded successfully.");
  console.log("  consumer@thehelper.ca  / HelperTest123  (Sarah Chen, Milton)");
  console.log("  consumer2@thehelper.ca / HelperTest123  (James Kowalski, Oakville)");
  console.log("  hvac@thehelper.ca      / HelperTest123  (Mike Torres, Comfort Zone HVAC)");
  console.log("  plumber@thehelper.ca   / HelperTest123  (Dave Singh, Singh Plumbing Co.)");
  console.log("  admin@thehelper.ca     / HelperTest123  (Admin)");

  // ─── Legacy / QA accounts (kept for backwards-compat with existing E2E tests) ──

  // Legacy consumer
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
      },
    });
  }
  await ensureEmailAuthIdentity(prisma, "test@worki.ai", LEGACY_TEST_PASSWORD);

  // QA consumer
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
      },
    });
  }
  await ensureEmailAuthIdentity(prisma, "consumer.test@worki.ai", QA_TEST_PASSWORD);

  // Legacy reward account for test@worki.ai
  const rewardAcct = await prisma.rewardAccount.findUnique({ where: { consumerId: consumer.id } });
  if (!rewardAcct) {
    await prisma.rewardAccount.create({
      data: {
        consumerId: consumer.id,
        pointsBalance: 1250,
        level: "SMART_MAINTAINER",
        lifetimePoints: 1250,
      },
    });
  }

  // QA provider
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
      },
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
        serviceAreas: ["L9T", "L6J", "L7R", "Milton", "Oakville", "Burlington"],
        verificationStatus: "VERIFIED",
        plan: "EXCLUSIVE",
      },
    });
  }

  console.log("Seeding complete! Check your Consumer and Provider Dashboards.");
}
