import { createProviderId, sanitizeAndSerializeProviderData } from "wasp/auth/utils";
const LEGACY_TEST_PASSWORD = "Password123!";
const QA_TEST_PASSWORD = "HelperQA123";
const TEST_PASSWORD = "HelperTest123";
async function ensureEmailAuthIdentity(prisma, email, password) {
    const providerId = createProviderId("email", email);
    const existingIdentity = await prisma.authIdentity.findUnique({
        where: { providerName_providerUserId: providerId },
    });
    if (existingIdentity)
        return;
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
    // Live on marketplace
    {
        name: "HVAC",
        slug: "hvac",
        description: "Heating, ventilation, and air conditioning repairs, tune-ups, and installs",
        icon: "AirVent",
        imageUrl: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&h=600&fit=crop",
    },
    {
        name: "Plumbing",
        slug: "plumbing",
        description: "Pipes, drains, water heaters, toilets, and fixture repairs",
        icon: "ShowerHead",
        imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=600&fit=crop",
    },
    {
        name: "Electrical",
        slug: "electrical",
        description: "Wiring, panels, outlets, lighting, and safety inspections",
        icon: "PlugZap",
        imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&h=600&fit=crop",
    },
    {
        name: "Handyman",
        slug: "handyman",
        description: "General home repairs, mounting, assembly, and maintenance",
        icon: "Hammer",
        imageUrl: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=600&fit=crop",
    },
    {
        name: "Appliance Repair",
        slug: "appliance-repair",
        description: "Washer, dryer, fridge, stove, dishwasher — diagnosis and repair",
        icon: "WashingMachine",
        imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&h=600&fit=crop",
    },
    {
        name: "Smart Home",
        slug: "smart-home",
        description: "Smart thermostats, cameras, locks, sensors, and home automation",
        icon: "Wifi",
        imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
    },
    // Coming soon — accepting provider applications
    {
        name: "Cleaning",
        slug: "cleaning",
        description: "Regular, deep clean, move-in/out, post-construction, and Airbnb cleans",
        icon: "Sparkles",
        imageUrl: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop",
    },
    {
        name: "Painting",
        slug: "painting",
        description: "Interior and exterior painting, drywall prep, colour consultation",
        icon: "Brush",
        imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop",
    },
    {
        name: "Flooring",
        slug: "flooring",
        description: "Hardwood, tile, laminate, vinyl plank, carpet — supply and install",
        icon: "Layers",
        imageUrl: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=800&h=600&fit=crop",
    },
    {
        name: "Roofing",
        slug: "roofing",
        description: "Shingle repair, full replacement, flat roofs, eavestroughs, and inspections",
        icon: "Home",
        imageUrl: "https://images.unsplash.com/photo-1632759145351-1d592919f522?w=800&h=600&fit=crop",
    },
    {
        name: "Landscaping",
        slug: "landscaping",
        description: "Lawn care, garden beds, interlocking, irrigation, and seasonal cleanup",
        icon: "Leaf",
        imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=600&fit=crop",
    },
    {
        name: "Snow Removal",
        slug: "snow-removal",
        description: "Driveway and walkway clearing, salting, and seasonal contracts",
        icon: "Wind",
        imageUrl: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&h=600&fit=crop",
    },
    {
        name: "Tree Services",
        slug: "tree-services",
        description: "Trimming, removal, stump grinding, and emergency tree work",
        icon: "TreePine",
        imageUrl: "https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=800&h=600&fit=crop",
    },
    {
        name: "Pest Control",
        slug: "pest-control",
        description: "Rodent, insect, and wildlife removal — inspection and treatment",
        icon: "Bug",
        imageUrl: "https://images.unsplash.com/photo-1611786081316-dde64e33ca43?w=800&h=600&fit=crop",
    },
    {
        name: "Locksmith",
        slug: "locksmith",
        description: "Lock changes, emergency entry, rekeying, and deadbolt installation",
        icon: "KeyRound",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    },
    {
        name: "Window Cleaning",
        slug: "window-cleaning",
        description: "Interior and exterior window washing, screens, sills, and tracks",
        icon: "Droplets",
        imageUrl: "https://images.unsplash.com/photo-1596394723269-b2cbca4e6313?w=800&h=600&fit=crop",
    },
    {
        name: "Moving",
        slug: "moving",
        description: "Local moves, packing, furniture assembly, piano moving, and junk removal",
        icon: "MoveRight",
        imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&h=600&fit=crop",
    },
    {
        name: "Garage Door",
        slug: "garage-door",
        description: "Spring repair, opener install, panel replacement, and seasonal tune-up",
        icon: "Package",
        imageUrl: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&fit=crop",
    },
    {
        name: "Junk Removal",
        slug: "junk-removal",
        description: "Furniture, appliances, renovation debris, and estate cleanouts",
        icon: "Trash2",
        imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=600&fit=crop",
    },
    {
        name: "Waterproofing",
        slug: "waterproofing",
        description: "Basement waterproofing, sump pump install, foundation crack repair",
        icon: "ShieldCheck",
        imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop",
    },
    {
        name: "Renovation",
        slug: "renovation",
        description: "Kitchen, bathroom, basement, and general home renovation",
        icon: "Hammer",
        imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop",
    },
    {
        name: "Home Inspection",
        slug: "home-inspection",
        description: "Pre-purchase and annual home inspection with detailed report",
        icon: "ClipboardList",
        imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
    },
    {
        name: "Fence & Gate",
        slug: "fence-gate",
        description: "Wood, vinyl, chain-link, and aluminum fence install and repair",
        icon: "Fence",
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    },
    {
        name: "Pool & Spa",
        slug: "pool-spa",
        description: "Opening, closing, cleaning, equipment repair, and winterization",
        icon: "Waves",
        imageUrl: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop",
    },
    {
        name: "Events",
        slug: "events",
        description: "Event setup, furniture rentals, tents, AV, and cleanup services",
        icon: "PartyPopper",
        imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=600&fit=crop",
    },
];
export async function seedVendorCategories(prisma) {
    console.log("Seeding vendor service categories...");
    for (const cat of DEFAULT_VENDOR_CATEGORIES) {
        await prisma.serviceCategory.upsert({
            where: { slug: cat.slug },
            update: {
                icon: cat.icon,
                imageUrl: cat.imageUrl,
            },
            create: {
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                icon: cat.icon,
                imageUrl: cat.imageUrl,
                active: true,
            },
        });
    }
    console.log(`Seeded ${DEFAULT_VENDOR_CATEGORIES.length} vendor categories.`);
}
export async function seedMockUsers(prisma) {
    console.log("Seeding The Helper Sample Data...");
    // Ensure categories exist first (required by provider setup below)
    await seedVendorCategories(prisma);
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
    // Legacy reward account for legacy test user
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
//# sourceMappingURL=dbSeeds.js.map