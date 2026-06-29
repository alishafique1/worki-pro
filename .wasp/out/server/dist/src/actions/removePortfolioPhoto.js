import { prisma } from 'wasp/server';
import { removePortfolioPhoto } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return removePortfolioPhoto(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=removePortfolioPhoto.js.map