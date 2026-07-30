import { prisma } from 'wasp/server';
import { completeOnboarding } from '../../../../../src/auth/onboardingOperations';
export default async function (args, context) {
    return completeOnboarding(args, {
        ...context,
        entities: {
            User: prisma.user,
            Provider: prisma.provider,
            RewardAccount: prisma.rewardAccount,
            RewardTransaction: prisma.rewardTransaction,
            ServiceRequest: prisma.serviceRequest,
            Referral: prisma.referral,
            ConsumerInterest: prisma.consumerInterest,
            ProviderCategory: prisma.providerCategory,
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=completeOnboarding.js.map