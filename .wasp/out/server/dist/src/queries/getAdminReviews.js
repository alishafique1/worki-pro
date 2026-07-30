import { prisma } from 'wasp/server';
import { getAdminReviews } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return getAdminReviews(args, {
        ...context,
        entities: {
            Review: prisma.review,
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=getAdminReviews.js.map