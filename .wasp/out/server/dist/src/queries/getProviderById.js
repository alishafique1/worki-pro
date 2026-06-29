import { prisma } from 'wasp/server';
import { getProviderById } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return getProviderById(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
            ProviderCategory: prisma.providerCategory,
            ServiceCategory: prisma.serviceCategory,
            Review: prisma.review,
        },
    });
}
//# sourceMappingURL=getProviderById.js.map