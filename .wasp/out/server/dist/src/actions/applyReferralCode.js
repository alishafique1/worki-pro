import { prisma } from 'wasp/server';
import { applyReferralCode } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return applyReferralCode(args, {
        ...context,
        entities: {
            Referral: prisma.referral,
        },
    });
}
//# sourceMappingURL=applyReferralCode.js.map