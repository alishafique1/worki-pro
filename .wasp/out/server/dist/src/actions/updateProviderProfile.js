import { prisma } from 'wasp/server';
import { updateProviderProfile } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return updateProviderProfile(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=updateProviderProfile.js.map