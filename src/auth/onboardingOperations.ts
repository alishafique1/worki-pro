import { HttpError, prisma } from 'wasp/server';
import { type CompleteOnboarding } from 'wasp/server/operations';
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

  return { success: true };
};
