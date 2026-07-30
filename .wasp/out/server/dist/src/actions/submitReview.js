import { prisma } from 'wasp/server';
import { submitReview } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return submitReview(args, {
        ...context,
        entities: {
            Review: prisma.review,
            Provider: prisma.provider,
            ServiceRequest: prisma.serviceRequest,
        },
    });
}
//# sourceMappingURL=submitReview.js.map