import { HttpError } from 'wasp/server';
export const completeOnboarding = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'Not authenticated');
    }
    const userId = context.user.id;
    const { role, firstName, lastName, phone, postalCode, smsConsent, businessName, serviceAreas, referralCode } = args;
    await context.entities.User.update({
        where: { id: userId },
        data: {
            firstName,
            lastName,
            phone,
            postalCode,
            role,
            smsConsent: smsConsent ?? false,
            smsConsentAt: smsConsent ? new Date() : undefined,
        },
    });
    if (role === 'PROVIDER') {
        await context.entities.Provider.upsert({
            where: { userId },
            update: {
                businessName: businessName ?? '',
                phone,
                serviceAreas: serviceAreas ?? [],
            },
            create: {
                userId,
                businessName: businessName ?? '',
                phone,
                serviceAreas: serviceAreas ?? [],
                email: context.user.email ?? undefined,
            },
        });
    }
    // Ensure a RewardAccount exists for this user
    await context.entities.RewardAccount.upsert({
        where: { consumerId: userId },
        update: {},
        create: { consumerId: userId },
    });
    // Claim pending guest request rewards from submissions made before signup.
    const guestMatchFilters = [
        ...(context.user.email ? [{ email: context.user.email }] : []),
        { phone },
    ];
    const pendingGuestRequests = await context.entities.ServiceRequest.findMany({
        where: {
            consumerId: null,
            OR: guestMatchFilters,
        },
        orderBy: { createdAt: 'asc' },
    });
    for (const request of pendingGuestRequests) {
        const existingRequestReward = await context.entities.RewardTransaction.findFirst({
            where: {
                consumerId: userId,
                serviceRequestId: request.id,
                type: 'SERVICE_REQUEST',
            },
        });
        if (!existingRequestReward) {
            await context.entities.RewardTransaction.create({
                data: {
                    consumerId: userId,
                    serviceRequestId: request.id,
                    type: 'SERVICE_REQUEST',
                    points: 500,
                    status: 'PENDING',
                    reason: 'Request submitted — $5 reward pending verification',
                },
            });
        }
        await context.entities.ServiceRequest.update({
            where: { id: request.id },
            data: { consumerId: userId, rewardStatus: 'PENDING_VERIFICATION' },
        });
    }
    // Grant SIGNUP_BONUS if not already given
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
            data: {
                pointsBalance: { increment: 100 },
                lifetimePoints: { increment: 100 },
            },
        });
    }
    // Apply referral code if provided (consumers only)
    if (referralCode && role === 'CONSUMER') {
        const code = referralCode.trim().toUpperCase();
        const referral = await context.entities.Referral.findUnique({
            where: { referralCode: code },
        });
        if (referral && referral.referrerUserId !== userId && !referral.referredUserId) {
            await context.entities.Referral.update({
                where: { id: referral.id },
                data: { referredUserId: userId, status: 'SIGNED_UP' },
            });
        }
    }
    return { success: true };
};
//# sourceMappingURL=onboardingOperations.js.map