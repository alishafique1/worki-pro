import { prisma } from 'wasp/server';
import { getServiceCategories } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return getServiceCategories(args, {
        ...context,
        entities: {
            ServiceCategory: prisma.serviceCategory,
        },
    });
}
//# sourceMappingURL=getServiceCategories.js.map