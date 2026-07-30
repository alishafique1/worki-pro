import { prisma } from 'wasp/server';
import { getPublicLeadFeed } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return getPublicLeadFeed(args, {
        ...context,
        entities: {
            ServiceRequest: prisma.serviceRequest,
            Provider: prisma.provider,
            ProviderCategory: prisma.providerCategory,
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=getPublicLeadFeed.js.map