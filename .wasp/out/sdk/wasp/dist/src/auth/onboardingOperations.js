import { HttpError, prisma } from 'wasp/server';
import { emailSender } from 'wasp/server/email';
import { REWARD_POINTS } from '../shared/rewardConstants';
import { validateOnboarding } from './onboarding/validation';
import { syncContactToGHL } from '../server/services/ghl';
export const completeOnboarding = async (args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'Not authenticated');
    }
    const userId = context.user.id;
    const userEmail = context.user.email;
    const { role, firstName, lastName, phone, postalCode, smsConsent, businessName, serviceAreas, referralCode, interestCategoryIds, serviceCategoryIds } = args;
    // ─── Server-side validation ────────────────────────────────────────────────
    // The browser form validates too, but the action is the trust boundary: a
    // direct API call bypasses the UI entirely. Same rules, one source of truth.
    const validationError = validateOnboarding({ role, firstName, phone, postalCode, businessName, serviceCategoryIds }, { requireProviderServices: true });
    if (validationError) {
        throw new HttpError(400, validationError);
    }
    // ─── All writes in ONE transaction ──────────────────────────────────────────
    // Previously the user update, provider upsert, category writes, guest-request
    // matching, and signup bonus were separate writes. A failure partway through
    // left an inconsistent account (e.g. role=PROVIDER with no business/categories,
    // or guest requests claimed but no reward row). Serializable isolation also
    // makes the SIGNUP_BONUS existence-check actually safe against a concurrent
    // retry (a network double-submit can't mint two welcome bonuses).
    await prisma.$transaction(async (tx) => {
        await tx.user.update({
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
            const provider = await tx.provider.upsert({
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
                    email: userEmail ?? undefined,
                },
            });
            if (serviceCategoryIds && serviceCategoryIds.length > 0) {
                await tx.providerCategory.deleteMany({ where: { providerId: provider.id } });
                await tx.providerCategory.createMany({
                    data: serviceCategoryIds.map((serviceCategoryId) => ({
                        providerId: provider.id,
                        serviceCategoryId,
                    })),
                    skipDuplicates: true,
                });
            }
        }
        if (role === 'CONSUMER') {
            if (interestCategoryIds && interestCategoryIds.length > 0) {
                await tx.consumerInterest.deleteMany({ where: { consumerId: userId } });
                await tx.consumerInterest.createMany({
                    data: interestCategoryIds.map((serviceCategoryId) => ({
                        consumerId: userId,
                        serviceCategoryId,
                    })),
                    skipDuplicates: true,
                });
            }
            await tx.rewardAccount.upsert({
                where: { consumerId: userId },
                update: {},
                create: { consumerId: userId },
            });
            // Match any guest requests submitted before the user had an account
            // (email-only — phone is not unique).
            if (userEmail) {
                const pendingGuestRequests = await tx.serviceRequest.findMany({
                    where: { consumerId: null, email: userEmail },
                    orderBy: { createdAt: 'asc' },
                    select: { id: true },
                });
                if (pendingGuestRequests.length > 0) {
                    const requestIds = pendingGuestRequests.map((r) => r.id);
                    const existingRewards = await tx.rewardTransaction.findMany({
                        where: { consumerId: userId, serviceRequestId: { in: requestIds }, type: 'SERVICE_REQUEST' },
                        select: { serviceRequestId: true },
                    });
                    const rewardedRequestIds = new Set(existingRewards.map((r) => r.serviceRequestId));
                    const newRewards = requestIds
                        .filter((id) => !rewardedRequestIds.has(id))
                        .map((id) => ({
                        consumerId: userId,
                        serviceRequestId: id,
                        type: 'SERVICE_REQUEST',
                        points: REWARD_POINTS.SERVICE_REQUEST,
                        status: 'PENDING',
                        reason: 'Request submitted — $5 reward pending verification',
                    }));
                    if (newRewards.length > 0) {
                        await tx.rewardTransaction.createMany({ data: newRewards, skipDuplicates: true });
                    }
                    await tx.serviceRequest.updateMany({
                        where: { id: { in: requestIds }, consumerId: null },
                        data: { consumerId: userId, rewardStatus: 'PENDING_VERIFICATION' },
                    });
                }
            }
            // Signup bonus (deduped — see transaction note above).
            const existingBonus = await tx.rewardTransaction.findFirst({
                where: { consumerId: userId, type: 'SIGNUP_BONUS' },
            });
            if (!existingBonus) {
                await tx.rewardTransaction.create({
                    data: {
                        consumerId: userId,
                        type: 'SIGNUP_BONUS',
                        points: REWARD_POINTS.SIGNUP_BONUS,
                        status: 'APPROVED',
                        reason: 'Welcome bonus',
                    },
                });
                await tx.rewardAccount.update({
                    where: { consumerId: userId },
                    data: {
                        pointsBalance: { increment: REWARD_POINTS.SIGNUP_BONUS },
                        lifetimePoints: { increment: REWARD_POINTS.SIGNUP_BONUS },
                    },
                });
            }
            // Referral linkage
            if (referralCode) {
                const code = referralCode.trim().toUpperCase();
                const referral = await tx.referral.findUnique({ where: { referralCode: code } });
                if (referral && referral.referrerUserId !== userId && !referral.referredUserId) {
                    await tx.referral.update({
                        where: { id: referral.id },
                        data: { referredUserId: userId, status: 'SIGNED_UP' },
                    });
                }
            }
        }
    }, { isolationLevel: 'Serializable' });
    // ─── Sync the new contact (incl. phone) to GoHighLevel ──────────────────────
    // The phone is captured here at onboarding; previously it only reached GHL if
    // the user later filed a service request. Fire-and-forget, after commit.
    syncContactToGHL({
        firstName,
        lastName,
        phone,
        email: userEmail ?? undefined,
        postalCode,
        role,
        businessName,
    }, prisma).catch(() => { });
    // ─── Email notifications (fire-and-forget, AFTER commit) ────────────────────
    // Sending only after the transaction commits means we never email a user
    // about an account state that was rolled back.
    if (role === 'CONSUMER' && userEmail) {
        emailSender.send({
            to: userEmail,
            subject: 'Welcome to The Helper!',
            text: `Hi ${firstName},\n\nWelcome to The Helper! Here's how it works:\n\n1. Tell us what you need — describe your problem\n2. We match you with vetted local pros\n3. Compare, choose, and earn rewards on every job\n\nReady to start? Submit your first request:\nhttps://thehelper.ca/get-quotes\n\nThe TheHelper Team`,
            html: `<p>Hi ${firstName},</p><p>Welcome to The Helper! Here's how it works:</p><ol><li>Tell us what you need</li><li>We match you with vetted local pros</li><li>Earn rewards on every job</li></ol><p><a href="https://thehelper.ca/get-quotes" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;border-radius:22px;text-decoration:none;font-weight:bold">Submit your first request →</a></p><p>The TheHelper Team</p>`,
        }).catch(() => { });
    }
    if (role === 'PROVIDER') {
        // Provider confirmation email
        if (userEmail) {
            emailSender.send({
                to: userEmail,
                subject: 'Application received — The Helper',
                text: `Hi ${firstName},\n\nThanks for applying to join The Helper as a service pro.\n\nYour application is under review. Our team is verifying your information. You can browse leads in the meantime but won't be able to claim them until your account is verified.\n\nWe'll notify you once the review is complete.\n\nGo to your dashboard:\nhttps://thehelper.ca/provider/dashboard\n\nThe TheHelper Team`,
                html: `<p>Hi ${firstName},</p><p>Thanks for applying to join The Helper as a service pro.</p><p>Your application is under review. Our team is verifying your information. You can browse leads in the meantime but won't be able to claim them until your account is verified.</p><p>We'll notify you once the review is complete.</p><p><a href="https://thehelper.ca/provider/dashboard" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;border-radius:22px;text-decoration:none;font-weight:bold">Go to dashboard →</a></p><p>The TheHelper Team</p>`,
            }).catch(() => { });
        }
        // Notify admins of new provider onboarding
        const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean);
        for (const adminEmail of adminEmails) {
            emailSender.send({
                to: adminEmail,
                subject: `New provider onboarding: ${businessName ?? 'Unknown'}`,
                text: `A new provider completed onboarding.\n\nBusiness: ${businessName ?? 'Unknown'}\nPhone: ${phone}\nEmail: ${userEmail ?? 'N/A'}\nAreas: ${(serviceAreas ?? []).join(', ')}\nCategories: ${(serviceCategoryIds ?? []).length} selected\n\nReview: https://thehelper.ca/admin/providers`,
                html: `<p>A new provider completed onboarding.</p><ul><li><strong>Business:</strong> ${businessName ?? 'Unknown'}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${userEmail ?? 'N/A'}</li><li><strong>Areas:</strong> ${(serviceAreas ?? []).join(', ')}</li><li><strong>Categories:</strong> ${(serviceCategoryIds ?? []).length} selected</li></ul><p><a href="https://thehelper.ca/admin/providers">Review in admin →</a></p>`,
            }).catch(() => { });
        }
    }
    return { success: true };
};
//# sourceMappingURL=onboardingOperations.js.map