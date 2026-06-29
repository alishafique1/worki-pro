import { prisma } from 'wasp/server';
import { getMyReferral } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return getMyReferral(args, {
        ...context,
        entities: {
            Referral: prisma.referral,
        },
    });
}
//# sourceMappingURL=getMyReferral.js.map