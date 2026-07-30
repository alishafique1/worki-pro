import { prisma } from 'wasp/server';
import { redeemPoints } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return redeemPoints(args, {
        ...context,
        entities: {
            RewardAccount: prisma.rewardAccount,
            RewardTransaction: prisma.rewardTransaction,
            Redemption: prisma.redemption,
        },
    });
}
//# sourceMappingURL=redeemPoints.js.map