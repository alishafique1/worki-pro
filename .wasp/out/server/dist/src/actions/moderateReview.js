import { prisma } from 'wasp/server';
import { moderateReview } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return moderateReview(args, {
        ...context,
        entities: {
            Review: prisma.review,
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=moderateReview.js.map