import { prisma } from 'wasp/server';
import { rejectRewardTransaction } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return rejectRewardTransaction(args, {
        ...context,
        entities: {
            RewardTransaction: prisma.rewardTransaction,
        },
    });
}
//# sourceMappingURL=rejectRewardTransaction.js.map