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
    {
        name: "Handyman",
        slug: "handyman",
        description: "General repairs, mounting, assembly, painting, and home maintenance",
        icon: "Hammer",
        imageUrl: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=800&h=600&fit=crop",
    },
    {
        name: "Plumbing",
        slug: "plumbing",
        description: "Pipes, drains, water heaters, toilets, and fixture repairs",
        icon: "ShowerHead",
        imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&h=600&fit=crop",
    },
    {
        name: "Smart Home",
        slug: "smart-home",
        description: "Smart thermostats, cameras, locks, sensors, and home automation",
        icon: "Wifi",
        imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=600&fit=crop",
    },
    {
        name: "Events",
        slug: "events",
        description: "Event planning, setup, coordination, and day-of management for any occasion",
        icon: "CalendarCheck",
        imageUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=800&h=600&fit=crop",
    },
    {
        name: "Food Catering",
        slug: "food-catering",
        description: "Full catering, food trucks, private dining, and custom menus for events",
        icon: "UtensilsCrossed",
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    },
    {
        name: "Shisha Lounge",
        slug: "shisha-lounge",
        description: "Shisha setup and rental for events, private gatherings, and lounges",
        icon: "Flame",
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop",
    },
    {
        name: "AI Services",
        slug: "ai-services",
        description: "AI automation, chatbots, workflow tools, and digital assistants for your business",
        icon: "Bot",
        imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=600&fit=crop",
    },
    {
        name: "Website Design",
        slug: "website-design",
        description: "Custom websites, landing pages, e-commerce stores, and brand design",
        icon: "Globe",
        imageUrl: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
    },
    {
        name: "Digital Marketing",
        slug: "digital-marketing",
        description: "SEO, paid ads, social media management, and growth marketing for local businesses",
        icon: "Megaphone",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    },
    {
        name: "Software Development",
        slug: "software-development",
        description: "Custom software, web apps, integrations, and automation built for your business",
        icon: "Code",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
    },
    {
        name: "Video Editing",
        slug: "video-editing",
        description: "Short-form video, reels, promos, and professional video editing and production",
        icon: "Clapperboard",
        imageUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop",
    },
    {
        name: "Driving School",
        slug: "driving-school",
        description: "Licensed driving instruction, in-car lessons, and MTO-approved beginner courses",
        icon: "Car",
        imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop",
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
    // ─── 4. Provider: Mike Torres — Comfort Zone Handyman ─────────────────────
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
                businessName: "Comfort Zone Handyman",
                contactName: "Mike Torres",
                phone: "905-878-1155",
                email: "hvac@thehelper.ca",
                slug: "comfort-zone-handyman",
                bio: "Family-run handyman service covering Milton, Oakville, and Burlington since 2009. We handle everything from drywall and door repairs to furniture assembly, TV mounting, caulking, and general maintenance. Fully insured, upfront pricing, same-day service available.",
                serviceAreas: GTA_SERVICE_AREAS,
                verificationStatus: "VERIFIED",
                plan: "EXCLUSIVE",
                ratingInternal: 4.9,
                responseTimeMins: 30,
                insuranceStatus: true,
                referencesChecked: true,
                onboardingCallDone: true,
            },
        });
    }
    // Link Mike to Handyman category
    const handymanCategory = await prisma.serviceCategory.findFirst({ where: { slug: "handyman" } });
    if (handymanCategory) {
        const existingHandymanLink = await prisma.providerCategory.findFirst({
            where: { providerId: mikeProvider.id, serviceCategoryId: handymanCategory.id },
        });
        if (!existingHandymanLink) {
            await prisma.providerCategory.create({
                data: { providerId: mikeProvider.id, serviceCategoryId: handymanCategory.id },
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
    // 7a. COMPLETED Handyman request
    let handymanReq = await prisma.serviceRequest.findFirst({
        where: { consumerId: sarahUser.id, status: "COMPLETED" },
    });
    if (!handymanReq) {
        handymanReq = await prisma.serviceRequest.create({
            data: {
                consumerId: sarahUser.id,
                name: "Sarah Chen",
                phone: "905-876-4421",
                postalCode: "L9T 3L2",
                city: "Milton",
                description: "TV mounting and shelving — 65 inch TV, need 3 floating shelves in living room",
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
    // 7c. ASSIGNED Smart Home request
    let smartHomeReq = await prisma.serviceRequest.findFirst({
        where: { consumerId: sarahUser.id, status: "ASSIGNED" },
    });
    if (!smartHomeReq) {
        smartHomeReq = await prisma.serviceRequest.create({
            data: {
                consumerId: sarahUser.id,
                name: "Sarah Chen",
                phone: "905-876-4421",
                postalCode: "L9T 3L2",
                city: "Milton",
                description: "Install 3 smart cameras and a video doorbell, existing Wi-Fi available",
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
                    serviceRequestId: handymanReq.id,
                    type: "SERVICE_REQUEST",
                    points: 500,
                    status: "APPROVED",
                    reason: "Submitted handyman request",
                },
                {
                    consumerId: sarahUser.id,
                    serviceRequestId: handymanReq.id,
                    type: "COMPLETED_SERVICE",
                    points: 5000,
                    status: "APPROVED",
                    reason: "TV mounting and shelving job completed",
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
    // ─── 9. Appointment for the completed Handyman request ─────────────────────
    const existingAppt = await prisma.appointment.findFirst({
        where: { serviceRequestId: handymanReq.id, providerId: mikeProvider.id },
    });
    if (!existingAppt) {
        await prisma.appointment.create({
            data: {
                serviceRequestId: handymanReq.id,
                providerId: mikeProvider.id,
                consumerId: sarahUser.id,
                status: "COMPLETED",
                scheduledAt: new Date(Date.now() - 7 * 86400000),
                completedAt: new Date(Date.now() - 7 * 86400000),
            },
        });
    }
    // ─── 10. Review for the completed Handyman request ─────────────────────────
    const existingReview = await prisma.review.findFirst({
        where: { providerId: mikeProvider.id, consumerId: sarahUser.id, serviceRequestId: handymanReq.id },
    });
    if (!existingReview) {
        await prisma.review.create({
            data: {
                providerId: mikeProvider.id,
                consumerId: sarahUser.id,
                serviceRequestId: handymanReq.id,
                rating: 5,
                body: "Mike mounted the TV perfectly and built the shelves exactly how I wanted. Showed up on time, cleaned up after, very professional.",
                status: "PUBLISHED",
            },
        });
        // Update provider rating after review creation
        await prisma.provider.update({
            where: { id: mikeProvider.id },
            data: { ratingInternal: 4.9 },
        });
    }
    // ─── 11. Communication Logs on the smart home (assigned) request ────────────
    const existingLogs = await prisma.communicationLog.count({
        where: { serviceRequestId: smartHomeReq.id },
    });
    if (existingLogs === 0) {
        await prisma.communicationLog.createMany({
            data: [
                {
                    userId: sarahUser.id,
                    serviceRequestId: smartHomeReq.id,
                    channel: "INTERNAL_NOTE",
                    direction: "OUTBOUND",
                    from: sarahUser.email ?? "consumer@thehelper.ca",
                    to: mikeProviderUser.email ?? "hvac@thehelper.ca",
                    body: "Hi, when can you come by to install the cameras and doorbell?",
                },
                {
                    userId: mikeProviderUser.id,
                    serviceRequestId: smartHomeReq.id,
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
    console.log("  hvac@thehelper.ca      / HelperTest123  (Mike Torres, Comfort Zone Handyman)");
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