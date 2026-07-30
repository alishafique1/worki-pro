import { prisma } from 'wasp/server';
import { upsertAdminCategory } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return upsertAdminCategory(args, {
        ...context,
        entities: {
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=upsertAdminCategory.js.map