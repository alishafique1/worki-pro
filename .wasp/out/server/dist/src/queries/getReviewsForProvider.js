import { prisma } from 'wasp/server';
import { getReviewsForProvider } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return getReviewsForProvider(args, {
        ...context,
        entities: {
            Review: prisma.review,
        },
    });
}
//# sourceMappingURL=getReviewsForProvider.js.map