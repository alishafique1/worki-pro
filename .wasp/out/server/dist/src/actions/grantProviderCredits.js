import { prisma } from 'wasp/server';
import { grantProviderCredits } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return grantProviderCredits(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
            CreditAccount: prisma.creditAccount,
            CreditTransaction: prisma.creditTransaction,
        },
    });
}
//# sourceMappingURL=grantProviderCredits.js.map