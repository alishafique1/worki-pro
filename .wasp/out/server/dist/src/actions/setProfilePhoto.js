import { prisma } from 'wasp/server';
import { setProfilePhoto } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return setProfilePhoto(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=setProfilePhoto.js.map