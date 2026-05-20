import { prisma } from 'wasp/server';
import { getConsumerStats } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return getConsumerStats(args, {
        ...context,
        entities: {
            ServiceRequest: prisma.serviceRequest,
            RewardAccount: prisma.rewardAccount,
            RewardTransaction: prisma.rewardTransaction,
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=getConsumerStats.js.map