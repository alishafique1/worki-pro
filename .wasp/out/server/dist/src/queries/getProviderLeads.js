import { prisma } from 'wasp/server';
import { getProviderLeads } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return getProviderLeads(args, {
        ...context,
        entities: {
            ServiceRequest: prisma.serviceRequest,
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=getProviderLeads.js.map