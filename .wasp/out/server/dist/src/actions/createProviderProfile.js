import { prisma } from 'wasp/server';
import { createProviderProfile } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return createProviderProfile(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=createProviderProfile.js.map