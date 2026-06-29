import { prisma } from 'wasp/server';
import { submitProviderApplication } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return submitProviderApplication(args, {
        ...context,
        entities: {
            User: prisma.user,
            Provider: prisma.provider,
            ProviderCategory: prisma.providerCategory,
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=submitProviderApplication.js.map