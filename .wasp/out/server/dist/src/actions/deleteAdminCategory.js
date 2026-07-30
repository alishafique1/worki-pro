import { prisma } from 'wasp/server';
import { deleteAdminCategory } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return deleteAdminCategory(args, {
        ...context,
        entities: {
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=deleteAdminCategory.js.map