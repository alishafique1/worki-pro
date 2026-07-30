import { prisma } from 'wasp/server';
import { getProviderFees } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return getProviderFees(args, {
        ...context,
        entities: {
            ProviderFee: prisma.providerFee,
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=getProviderFees.js.map