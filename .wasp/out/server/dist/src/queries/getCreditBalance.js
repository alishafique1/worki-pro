import { prisma } from 'wasp/server';
import { getCreditBalance } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return getCreditBalance(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
            CreditAccount: prisma.creditAccount,
            CreditTransaction: prisma.creditTransaction,
        },
    });
}
//# sourceMappingURL=getCreditBalance.js.map