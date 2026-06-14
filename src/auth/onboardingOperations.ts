import { HttpError, prisma } from 'wasp/server';
import { type CompleteOnboarding } from 'wasp/server/operations';
import { emailSender } from 'wasp/server/email';
import { REWARD_POINTS } from '../shared/rewardConstants';

type CompleteOnboardingInput = {
  role: 'CONSUMER' | 'PROVIDER';
  firstName: string;
  lastName?: string;
  phone: string;
  postalCode: string;
  smsConsent?: boolean;
  businessName?: string;
  serviceAreas?: string[];
  referralCode?: string;
  interestCategoryIds?: string[];
  serviceCategoryIds?: string[];
};

type CompleteOnboardingOutput = { success: boolean };

export const completeOnboarding: CompleteOnboarding<
  CompleteOnboardingInput,
  CompleteOnboardingOutput
> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Not authenticated');
  }

  const userId = context.user.id;
  const { role, firstName, lastName, phone, postalCode, smsConsent, businessName, serviceAreas, referralCode, interestCategoryIds, serviceCategoryIds } = args;

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

    if (serviceCategoryIds && serviceCategoryIds.length > 0) {
      await context.entities.ProviderCategory.deleteMany({
        where: { provider: { userId } },
      });
      for (const catId of serviceCategoryIds) {
        await context.entities.ProviderCategory.create({
          data: {
            providerId: (await context.entities.Provider.findUnique({ where: { userId } }))!.id,
            serviceCategoryId: catId,
          },
        });
      }
    }
  }

  if (role === 'CONSUMER' && interestCategoryIds && interestCategoryIds.length > 0) {
    await context.entities.ConsumerInterest.deleteMany({
      where: { consumerId: userId },
    });
    for (const catId of interestCategoryIds) {
      await context.entities.ConsumerInterest.create({
        data: { consumerId: userId, serviceCategoryId: catId },
      });
    }
  }

  if (role === 'CONSUMER') {
    await context.entities.RewardAccount.upsert({
      where: { consumerId: userId },
      update: {},
      create: { consumerId: userId },
    });

    // Match any guest requests submitted before the user had an account (email-only — phone is not unique)
    if (context.user.email) {
      const pendingGuestRequests = await context.entities.ServiceRequest.findMany({
        where: { consumerId: null, email: context.user.email },
        orderBy: { createdAt: 'asc' },
      });

      if (pendingGuestRequests.length > 0) {
        const requestIds = pendingGuestRequests.map(r => r.id);

        // Batch-fetch existing reward transactions for all matched requests in one query
        const existingRewards = await context.entities.RewardTransaction.findMany({
          where: { consumerId: userId, serviceRequestId: { in: requestIds }, type: 'SERVICE_REQUEST' },
          select: { serviceRequestId: true },
        });
        const rewardedRequestIds = new Set(existingRewards.map(r => r.serviceRequestId));

        const newRewards = requestIds
          .filter(id => !rewardedRequestIds.has(id))
          .map(id => ({
            consumerId: userId,
            serviceRequestId: id,
            type: 'SERVICE_REQUEST' as const,
            points: REWARD_POINTS.SERVICE_REQUEST,
            status: 'PENDING' as const,
            reason: 'Request submitted — $5 reward pending verification',
          }));

        if (newRewards.length > 0) {
          await context.entities.RewardTransaction.createMany({ data: newRewards, skipDuplicates: true });
        }

        await context.entities.ServiceRequest.updateMany({
          where: { id: { in: requestIds }, consumerId: null },
          data: { consumerId: userId, rewardStatus: 'PENDING_VERIFICATION' },
        });
      }
    }

    // Serializable transaction prevents duplicate SIGNUP_BONUS on concurrent calls (e.g. network retry)
    await prisma.$transaction(async (tx) => {
      const existing = await tx.rewardTransaction.findFirst({
        where: { consumerId: userId, type: 'SIGNUP_BONUS' },
      });
      if (!existing) {
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
    }, { isolationLevel: 'Serializable' });
  }

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

  // ─── Issue 2+7: Email notifications (fire-and-forget) ──────────────────────
  const consumerEmail = context.user.email;
  if (role === 'CONSUMER' && consumerEmail) {
    emailSender.send({
      to: consumerEmail,
      subject: 'Welcome to The Helper!',
      text: `Hi ${firstName},\n\nWelcome to The Helper! Here's how it works:\n\n1. Tell us what you need — describe your problem\n2. We match you with vetted local pros\n3. Compare, choose, and earn rewards on every job\n\nReady to start? Submit your first request:\nhttps://thehelper.ca/get-quotes\n\nThe TheHelper Team`,
      html: `<p>Hi ${firstName},</p><p>Welcome to The Helper! Here's how it works:</p><ol><li>Tell us what you need</li><li>We match you with vetted local pros</li><li>Earn rewards on every job</li></ol><p><a href="https://thehelper.ca/get-quotes" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;border-radius:22px;text-decoration:none;font-weight:bold">Submit your first request →</a></p><p>The TheHelper Team</p>`,
    }).catch(() => {/* non-blocking */});
  }

  if (role === 'PROVIDER') {
    const providerEmail = context.user.email;
    // Provider confirmation email
    if (providerEmail) {
      emailSender.send({
        to: providerEmail,
        subject: 'Application received — The Helper',
        text: `Hi ${firstName},\n\nThanks for applying to join The Helper as a service pro.\n\nYour application is under review. Our team is verifying your information. You can browse leads in the meantime but won't be able to claim them until your account is verified.\n\nWe'll notify you once the review is complete.\n\nGo to your dashboard:\nhttps://thehelper.ca/provider/dashboard\n\nThe TheHelper Team`,
        html: `<p>Hi ${firstName},</p><p>Thanks for applying to join The Helper as a service pro.</p><p>Your application is under review. Our team is verifying your information. You can browse leads in the meantime but won't be able to claim them until your account is verified.</p><p>We'll notify you once the review is complete.</p><p><a href="https://thehelper.ca/provider/dashboard" style="display:inline-block;padding:12px 24px;background:#2563EB;color:#fff;border-radius:22px;text-decoration:none;font-weight:bold">Go to dashboard →</a></p><p>The TheHelper Team</p>`,
      }).catch(() => {/* non-blocking */});
    }

    // Issue 7: Notify admins of new provider onboarding (same pattern as submitProviderApplication)
    const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e: string) => e.trim()).filter(Boolean);
    for (const adminEmail of adminEmails) {
      emailSender.send({
        to: adminEmail,
        subject: `New provider onboarding: ${businessName ?? 'Unknown'}`,
        text: `A new provider completed onboarding.\n\nBusiness: ${businessName ?? 'Unknown'}\nPhone: ${phone}\nEmail: ${consumerEmail ?? 'N/A'}\nAreas: ${(serviceAreas ?? []).join(', ')}\nCategories: ${(serviceCategoryIds ?? []).length} selected\n\nReview: https://thehelper.ca/admin/providers`,
        html: `<p>A new provider completed onboarding.</p><ul><li><strong>Business:</strong> ${businessName ?? 'Unknown'}</li><li><strong>Phone:</strong> ${phone}</li><li><strong>Email:</strong> ${consumerEmail ?? 'N/A'}</li><li><strong>Areas:</strong> ${(serviceAreas ?? []).join(', ')}</li><li><strong>Categories:</strong> ${(serviceCategoryIds ?? []).length} selected</li></ul><p><a href="https://thehelper.ca/admin/providers">Review in admin →</a></p>`,
      }).catch(() => {/* non-blocking */});
    }
  }

  return { success: true };
};
