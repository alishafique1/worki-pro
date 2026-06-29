import { prisma } from 'wasp/server';
import { getAdminProviders } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return getAdminProviders(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
            User: prisma.user,
        },
    });
}
//# sourceMappingURL=getAdminProviders.js.map