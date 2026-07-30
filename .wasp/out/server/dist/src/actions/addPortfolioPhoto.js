import { prisma } from 'wasp/server';
import { addPortfolioPhoto } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return addPortfolioPhoto(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=addPortfolioPhoto.js.map