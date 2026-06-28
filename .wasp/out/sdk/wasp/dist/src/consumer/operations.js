import { HttpError, prisma } from "wasp/server";
import { emailSender } from "wasp/server/email";
import { sendLeadToGHL } from "../server/services/ghl";
import crypto from "node:crypto";
export const getServiceCategories = async (args, context) => {
    return context.entities.ServiceCategory.findMany({
        where: { active: true },
        orderBy: { name: "asc" },
        include: {
            children: {
                where: { active: true },
                orderBy: { name: "asc" },
            },
        },
    });
};
export const getMyRequests = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    return context.entities.ServiceRequest.findMany({
        where: { consumerId: context.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            assignedProvider: true,
            serviceCategory: true,
            appointments: {
                orderBy: { createdAt: "desc" },
                include: { provider: true },
            },
            communicationLogs: {
                orderBy: { createdAt: "asc" },
            },
        },
    });
};
export const getMyRewardAccount = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    const account = await context.entities.RewardAccount.findUnique({
        where: { consumerId: context.user.id },
    });
    const transactions = await context.entities.RewardTransaction.findMany({
        where: { consumerId: context.user.id },
        orderBy: { createdAt: "desc" },
    });
    const redemptions = await context.entities.Redemption.findMany({
        where: { consumerId: context.user.id },
        orderBy: { createdAt: "desc" },
    });
    return { account, transactions, redemptions };
};
export const redeemPoints = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    const { points, giftCardEmail } = args;
    if (points < 500 || points % 500 !== 0) {
        throw new HttpError(400, "Minimum redemption is 500 points in multiples of 500.");
    }
    const cashValue = points / 100;
    const userId = context.user.id;
    // Wrap in a transaction to prevent concurrent over-redemption race conditions
    const redemption = await prisma.$transaction(async (tx) => {
        const account = await tx.rewardAccount.findUnique({
            where: { consumerId: userId },
        });
        if (!account || account.pointsBalance < points) {
            throw new HttpError(400, "Insufficient points balance.");
        }
        const newRedemption = await tx.redemption.create({
            data: {
                consumerId: userId,
                pointsUsed: points,
                cashValue,
                giftCardEmail,
                status: "REQUESTED",
            },
        });
        await tx.rewardTransaction.create({
            data: {
                consumerId: userId,
                type: "REDEMPTION",
                points: -points,
                status: "REDEEMED",
                reason: "Gift card redemption",
            },
        });
        await tx.rewardAccount.update({
            where: { consumerId: userId },
            data: { pointsBalance: { decrement: points } },
        });
        return newRedemption;
    });
    return redemption;
};
// Points constants — single source of truth
export const POINTS = {
    SERVICE_REQUEST: 500, // $5 — awarded when request is submitted
    APPOINTMENT_BOOKED: 500, // $5 — awarded when appointment is confirmed
    JOB_COMPLETED: 5000, // $50 — awarded when job is marked complete
    REFERRAL: 500, // $5 — both referrer and referred
};
export const submitServiceRequest = async (args, context) => {
    let serviceCategoryId = undefined;
    if (args.serviceType) {
        const cat = await context.entities.ServiceCategory.findUnique({
            where: { slug: args.serviceType },
        });
        serviceCategoryId = cat?.id;
    }
    const preferredProviderId = args.preferredProviderId
        ? (await context.entities.Provider.findUnique({
            where: { id: args.preferredProviderId },
        }))?.id
        : undefined;
    const newRequest = await context.entities.ServiceRequest.create({
        data: {
            consumerId: context.user?.id || undefined,
            name: args.name,
            email: args.email,
            phone: args.phone || '',
            postalCode: args.postalCode,
            description: args.description,
            urgency: args.urgency,
            estimatedSchedule: args.estimatedSchedule,
            preferredTime: args.preferredTime,
            smsConsentGiven: args.smsConsentGiven ?? false,
            smsConsentFormVersion: args.smsConsentFormVersion || undefined,
            source: "WEBSITE",
            status: preferredProviderId ? "ASSIGNED" : "NEW",
            rewardStatus: "PENDING_VERIFICATION",
            serviceCategoryId: serviceCategoryId || undefined,
            assignedProviderId: preferredProviderId || undefined,
        },
    });
    // Award 500 pts ($5) immediately for authenticated users.
    // For guests, this request stays reward-eligible and is claimed after signup/onboarding.
    if (context.user?.id) {
        await context.entities.RewardTransaction.create({
            data: {
                consumerId: context.user.id,
                serviceRequestId: newRequest.id,
                type: "SERVICE_REQUEST",
                points: POINTS.SERVICE_REQUEST,
                status: "PENDING",
                reason: "Request submitted — $5 reward pending verification",
            },
        });
        await context.entities.RewardAccount.upsert({
            where: { consumerId: context.user.id },
            create: {
                consumerId: context.user.id,
                pointsBalance: 0,
                lifetimePoints: 0,
            },
            update: {},
        });
    }
    // ── Fire outbound webhook to GoHighLevel (fire-and-forget, logs to WebhookLog) ──
    sendLeadToGHL({
        serviceRequestId: newRequest.id,
        name: args.name,
        phone: args.phone || '',
        email: args.email || undefined,
        postalCode: args.postalCode,
        serviceType: args.serviceType,
        description: args.description,
        urgency: args.urgency,
        source: "WEBSITE",
    }, context.entities).catch(() => {
        /* already logged inside sendLeadToGHL */
    });
    return newRequest;
};
export const getProviders = async ({ categorySlug, search, areaSlug }, context) => {
    const where = {
        active: true,
        verificationStatus: "VERIFIED",
    };
    if (categorySlug) {
        where.categories = {
            some: {
                serviceCategory: { slug: categorySlug },
            },
        };
    }
    // Server-side area filter using PostgreSQL array contains
    if (areaSlug) {
        where.serviceAreas = {
            has: areaSlug.toLowerCase(),
        };
    }
    let providers = await context.entities.Provider.findMany({
        where,
        include: {
            categories: {
                include: { serviceCategory: true },
            },
            appointments: {
                where: { status: "COMPLETED" },
                select: { id: true },
            },
            reviews: {
                where: { status: "PUBLISHED" },
                select: { id: true },
            },
        },
        orderBy: { ratingInternal: "desc" },
    });
    if (search) {
        const q = search.toLowerCase();
        providers = providers.filter((provider) => provider.businessName.toLowerCase().includes(q) ||
            provider.categories.some((category) => category.serviceCategory.name.toLowerCase().includes(q)));
    }
    // Map to include counts
    return providers.map((provider) => ({
        id: provider.id,
        slug: provider.slug,
        businessName: provider.businessName,
        contactName: provider.contactName,
        ratingInternal: provider.ratingInternal,
        verificationStatus: provider.verificationStatus,
        serviceAreas: provider.serviceAreas,
        servicesJson: provider.servicesJson,
        bio: provider.bio,
        profilePhotoUrl: provider.profilePhotoUrl,
        categories: provider.categories,
        completedJobsCount: provider.appointments?.length ?? 0,
        reviewCount: provider.reviews?.length ?? 0,
    }));
};
export const sendCustomerMessage = async ({ requestId, body }, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    const trimmedBody = body.trim();
    if (trimmedBody.length < 1) {
        throw new HttpError(400, "Message cannot be empty.");
    }
    if (trimmedBody.length > 1000) {
        throw new HttpError(400, "Message must be 1,000 characters or fewer.");
    }
    const serviceRequest = await context.entities.ServiceRequest.findFirst({
        where: {
            id: requestId,
            consumerId: context.user.id,
        },
        include: { assignedProvider: true },
    });
    if (!serviceRequest) {
        throw new HttpError(404, "Service request not found.");
    }
    const log = await context.entities.CommunicationLog.create({
        data: {
            userId: context.user.id,
            serviceRequestId: serviceRequest.id,
            providerId: serviceRequest.assignedProviderId || undefined,
            channel: "INTERNAL_NOTE",
            direction: "INBOUND",
            from: context.user.email ||
                serviceRequest.email ||
                serviceRequest.name ||
                "Customer",
            to: serviceRequest.assignedProvider?.businessName || "The Helper coordination",
            body: trimmedBody,
            status: "SENT",
        },
    });
    // Notify provider by email (fire-and-forget)
    if (serviceRequest.assignedProvider?.email) {
        const customerName = serviceRequest.name || context.user.email || "A customer";
        emailSender.send({
            to: serviceRequest.assignedProvider.email,
            subject: `New message from ${customerName}`,
            text: `Hi,\n\n${customerName} sent you a message on TheHelper:\n\n"${trimmedBody}"\n\nView the thread:\nhttps://thehelper.ca/provider/requests/${serviceRequest.id}/messages\n\nThe TheHelper Team`,
            html: `<p>Hi,</p><p><strong>${customerName}</strong> sent you a message on TheHelper:</p><blockquote>${trimmedBody}</blockquote><p><a href="https://thehelper.ca/provider/requests/${serviceRequest.id}/messages">View the thread</a></p>`,
        }).catch((err) => {
            console.warn("[sendCustomerMessage] email notification failed:", err.message);
        });
    }
    return log;
};
export const getProviderById = async ({ providerId }, context) => {
    const provider = await context.entities.Provider.findUnique({
        where: { id: providerId, active: true },
        include: {
            categories: { include: { serviceCategory: true } },
            reviews: {
                where: { status: "PUBLISHED" },
                orderBy: { createdAt: "desc" },
                take: 20,
            },
        },
    });
    if (!provider)
        return null;
    const services = provider.servicesJson ? JSON.parse(provider.servicesJson) : [];
    return { ...provider, services };
};
export const getConsumerStats = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401);
    }
    const requests = await context.entities.ServiceRequest.findMany({
        where: { consumerId: context.user.id },
        include: { serviceCategory: true },
    });
    const account = await context.entities.RewardAccount.findUnique({
        where: { consumerId: context.user.id },
    });
    const transactions = await context.entities.RewardTransaction.findMany({
        where: { consumerId: context.user.id },
        orderBy: { createdAt: "desc" },
    });
    const totalRequests = requests.length;
    const completedRequests = requests.filter((r) => ['COMPLETED', 'REWARD_APPROVED', 'CLOSED'].includes(r.status)).length;
    const pendingRequests = totalRequests - completedRequests;
    const totalPointsEarned = transactions
        .filter((t) => t.points > 0)
        .reduce((sum, t) => sum + t.points, 0);
    const totalPointsRedeemed = Math.abs(transactions.filter((t) => t.points < 0).reduce((sum, t) => sum + t.points, 0));
    const requestsByStatus = {};
    for (const r of requests) {
        requestsByStatus[r.status] = (requestsByStatus[r.status] || 0) + 1;
    }
    const requestsByCategory = {};
    for (const r of requests) {
        const cat = r.serviceCategory?.name ?? 'Unknown';
        requestsByCategory[cat] = (requestsByCategory[cat] || 0) + 1;
    }
    // Monthly points for last 6 months
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyPoints = [];
    for (let i = 0; i < 6; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = d.toLocaleString('default', { month: 'short', year: '2-digit' });
        const earned = transactions
            .filter((t) => {
            const td = new Date(t.createdAt);
            return td >= d && td < new Date(d.getFullYear(), d.getMonth() + 1, 1) && t.points > 0;
        })
            .reduce((s, t) => s + t.points, 0);
        const redeemed = Math.abs(transactions
            .filter((t) => {
            const td = new Date(t.createdAt);
            return td >= d && td < new Date(d.getFullYear(), d.getMonth() + 1, 1) && t.points < 0;
        })
            .reduce((s, t) => s + t.points, 0));
        monthlyPoints.push({ month: monthKey, earned, redeemed });
    }
    monthlyPoints.reverse();
    return {
        totalRequests,
        completedRequests,
        pendingRequests,
        totalPointsEarned,
        totalPointsRedeemed,
        currentBalance: account?.pointsBalance ?? 0,
        lifetimePoints: account?.lifetimePoints ?? 0,
        requestsByStatus,
        requestsByCategory,
        monthlyPoints,
    };
};
// ─── Lead / Contact Flow ─────────────────────────────────────────────────────
export const submitLead = async ({ name, email, phone, postalCode, serviceType, message, source }, context) => {
    const lead = await context.entities.Lead.create({
        data: {
            name,
            email,
            phone: phone || null,
            postalCode: postalCode || null,
            serviceType: serviceType || null,
            message: message || null,
            source: source || 'WEBSITE',
            status: 'NEW',
        },
    });
    sendLeadToGHL({
        serviceRequestId: lead.id,
        name,
        phone: phone || '',
        email,
        postalCode: postalCode || '',
        serviceType: serviceType || '',
        description: message || '',
        urgency: 'STANDARD',
        source: source || 'WEBSITE',
    }, context.entities).catch(() => { });
    return lead;
};
// ─── OTP Verification ────────────────────────────────────────────────────────
const OTP_TTL_MINUTES = 10;
const MAX_OTP_ATTEMPTS = 5;
function hashOtp(code) {
    return crypto.createHash("sha256").update(code).digest("hex");
}
export const sendOtp = async ({ phone }, context) => {
    const normalized = phone.replace(/\s+/g, "").trim();
    if (!normalized)
        throw new HttpError(400, "Phone number required.");
    // Rate-limit: max 3 OTPs in last 5 minutes
    const recentCount = await context.entities.OtpVerification.count({
        where: {
            phone: normalized,
            createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) },
        },
    });
    if (recentCount >= 3) {
        throw new HttpError(429, "Too many OTP requests. Please wait a few minutes.");
    }
    // crypto.randomInt is cryptographically secure; Math.random is predictable.
    const code = crypto.randomInt(100000, 1000000).toString();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);
    await context.entities.OtpVerification.create({
        data: {
            phone: normalized,
            codeHash: hashOtp(code),
            expiresAt,
        },
    });
    const ghlOtpWebhook = process.env.GHL_OTP_WEBHOOK_URL;
    const isProd = process.env.NODE_ENV === "production";
    if (ghlOtpWebhook) {
        // Fail loud: if the webhook is down we must NOT report success, or the
        // user waits forever for a code that was never sent.
        try {
            const resp = await fetch(ghlOtpWebhook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: normalized, code, ttlMinutes: OTP_TTL_MINUTES }),
            });
            if (!resp.ok)
                throw new Error(`GHL webhook returned ${resp.status}`);
        }
        catch (err) {
            console.error("[GHL OTP] Webhook failed:", err);
            throw new HttpError(502, "Could not send your code right now. Please try again.");
        }
    }
    else if (isProd) {
        // No delivery channel configured in production = broken login. Surface it
        // instead of silently logging the code to the server console.
        console.error("[OTP] GHL_OTP_WEBHOOK_URL is not set in production.");
        throw new HttpError(500, "SMS delivery is not configured. Please contact support.");
    }
    else {
        // Dev only: log to console so local testing works without GHL.
        console.info(`[OTP dev] Code for ${normalized}: ${code}`);
    }
    return { sent: true };
};
export const verifyOtp = async ({ phone, code }, context) => {
    const normalized = phone.replace(/\s+/g, "").trim();
    const now = new Date();
    const record = await context.entities.OtpVerification.findFirst({
        where: {
            phone: normalized,
            verifiedAt: null,
            expiresAt: { gte: now },
            attempts: { lt: MAX_OTP_ATTEMPTS },
        },
        orderBy: { createdAt: "desc" },
    });
    if (!record)
        throw new HttpError(400, "No valid OTP found. Please request a new code.");
    await context.entities.OtpVerification.update({
        where: { id: record.id },
        data: { attempts: { increment: 1 } },
    });
    if (record.codeHash !== hashOtp(code)) {
        throw new HttpError(400, "Incorrect verification code.");
    }
    await context.entities.OtpVerification.update({
        where: { id: record.id },
        data: { verifiedAt: now },
    });
    return { verified: true };
};
// ─── Reviews ──────────────────────────────────────────────────────────────────
export const submitReview = async ({ providerId, serviceRequestId, rating, title, body }, context) => {
    if (!context.user)
        throw new HttpError(401);
    if (rating < 1 || rating > 5)
        throw new HttpError(400, "Rating must be 1–5.");
    if (!body.trim())
        throw new HttpError(400, "Review body is required.");
    // Each consumer can review a provider once per service request
    if (serviceRequestId) {
        const existing = await context.entities.Review.findFirst({
            where: {
                consumerId: context.user.id,
                serviceRequestId,
            },
        });
        if (existing)
            throw new HttpError(409, "You have already reviewed this service request.");
    }
    const review = await context.entities.Review.create({
        data: {
            providerId,
            consumerId: context.user.id,
            serviceRequestId: serviceRequestId || undefined,
            rating,
            title: title?.trim() || undefined,
            body: body.trim(),
            status: "PENDING", // enters admin moderation queue before publishing
        },
    });
    // Recompute average rating only from published reviews
    const agg = await context.entities.Review.aggregate({
        where: { providerId, status: "PUBLISHED" },
        _avg: { rating: true },
    });
    await context.entities.Provider.update({
        where: { id: providerId },
        data: { ratingInternal: agg._avg.rating ?? undefined },
    });
    return review;
};
export const getReviewsForProvider = async ({ providerId }, context) => {
    return context.entities.Review.findMany({
        where: { providerId, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
};
// ─── Messages per ServiceRequest ─────────────────────────────────────────────
export const getMessagesForRequest = async ({ requestId }, context) => {
    if (!context.user)
        throw new HttpError(401);
    const request = await context.entities.ServiceRequest.findFirst({
        where: {
            id: requestId,
            OR: [
                { consumerId: context.user.id },
                { assignedProvider: { userId: context.user.id } },
            ],
        },
        select: {
            id: true,
            name: true,
            status: true,
            assignedProvider: {
                select: { id: true, businessName: true, slug: true },
            },
        },
    });
    if (!request)
        throw new HttpError(404, "Request not found.");
    const messages = await context.entities.CommunicationLog.findMany({
        where: {
            serviceRequestId: requestId,
            channel: "INTERNAL_NOTE",
        },
        orderBy: { createdAt: "asc" },
    });
    return { messages, request };
};
// ─── Referral ──────────────────────────────────────────────────────────────
export const getMyReferral = async (_args, context) => {
    if (!context.user)
        throw new HttpError(401);
    const userId = context.user.id;
    const existing = await context.entities.Referral.findFirst({
        where: { referrerUserId: userId },
    });
    if (existing)
        return existing;
    const code = `REF-${userId.slice(-6).toUpperCase()}`;
    return context.entities.Referral.create({
        data: {
            referrerUserId: userId,
            referralCode: code,
            status: "CREATED",
        },
    });
};
export const applyReferralCode = async ({ code }, context) => {
    if (!context.user)
        throw new HttpError(401);
    const userId = context.user.id;
    const referral = await context.entities.Referral.findUnique({
        where: { referralCode: code.trim().toUpperCase() },
    });
    if (!referral)
        return { success: false, message: "Invalid referral code." };
    if (referral.referrerUserId === userId)
        return { success: false, message: "You cannot use your own referral code." };
    if (referral.referredUserId)
        return { success: false, message: "This referral code has already been used." };
    await context.entities.Referral.update({
        where: { id: referral.id },
        data: { referredUserId: userId, status: "SIGNED_UP" },
    });
    return { success: true, message: "Referral applied! You'll both earn rewards after your first service." };
};
export const saveGuestRequest = async (args, context) => {
    if (!context.user)
        throw new HttpError(401, 'Not authenticated');
    const userId = context.user.id;
    await context.entities.User.update({
        where: { id: userId },
        data: {
            firstName: args.firstName,
            phone: args.phone,
            postalCode: args.postalCode,
            role: 'CONSUMER',
            smsConsent: args.smsConsent,
            smsConsentAt: args.smsConsent ? new Date() : undefined,
        },
    });
    const request = await context.entities.ServiceRequest.create({
        data: {
            consumerId: userId,
            name: args.firstName,
            phone: args.phone,
            postalCode: args.postalCode,
            email: context.user.email ?? undefined,
            smsConsentGiven: args.smsConsent,
            serviceCategoryId: args.serviceCategoryId ?? null,
            description: args.description,
            qualifierAnswers: args.qualifierAnswers ?? {},
            source: 'WEBSITE',
        },
    });
    await context.entities.RewardAccount.upsert({
        where: { consumerId: userId },
        update: {},
        create: { consumerId: userId },
    });
    const existing = await context.entities.RewardTransaction.findFirst({
        where: { consumerId: userId, type: 'SIGNUP_BONUS' },
    });
    if (!existing) {
        await context.entities.RewardTransaction.create({
            data: {
                consumerId: userId,
                type: 'SIGNUP_BONUS',
                points: 100,
                status: 'APPROVED',
                reason: 'Welcome bonus',
            },
        });
        await context.entities.RewardAccount.update({
            where: { consumerId: userId },
            data: { pointsBalance: { increment: 100 }, lifetimePoints: { increment: 100 } },
        });
    }
    if (args.referralCode) {
        const code = args.referralCode.trim().toUpperCase();
        const referral = await context.entities.Referral.findUnique({ where: { referralCode: code } });
        if (referral && referral.referrerUserId !== userId && !referral.referredUserId) {
            await context.entities.Referral.update({
                where: { id: referral.id },
                data: { referredUserId: userId, status: 'SIGNED_UP' },
            });
        }
    }
    return { requestId: request.id };
};
export const getProviderSlugById = async ({ id }, context) => {
    const provider = await context.entities.Provider.findUnique({
        where: { id },
        select: { slug: true },
    });
    return { slug: provider?.slug ?? null };
};
//# sourceMappingURL=operations.js.map