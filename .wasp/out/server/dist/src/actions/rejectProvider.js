import { prisma } from 'wasp/server';
import { rejectProvider } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return rejectProvider(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=rejectProvider.js.map