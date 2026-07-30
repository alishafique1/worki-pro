import { prisma } from 'wasp/server';
import { approveProvider } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return approveProvider(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=approveProvider.js.map