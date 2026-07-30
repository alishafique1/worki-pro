import { prisma } from 'wasp/server';
import { getPublicProvider } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return getPublicProvider(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
            Review: prisma.review,
            ProviderCategory: prisma.providerCategory,
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=getPublicProvider.js.map