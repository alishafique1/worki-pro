import { prisma } from 'wasp/server';
import { getAdminRewards } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return getAdminRewards(args, {
        ...context,
        entities: {
            RewardTransaction: prisma.rewardTransaction,
            Redemption: prisma.redemption,
            ServiceRequest: prisma.serviceRequest,
            User: prisma.user,
        },
    });
}
//# sourceMappingURL=getAdminRewards.js.map