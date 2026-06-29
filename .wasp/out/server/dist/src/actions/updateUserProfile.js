import { prisma } from 'wasp/server';
import { updateUserProfile } from '../../../../../src/user/operations';
export default async function (args, context) {
    return updateUserProfile(args, {
        ...context,
        entities: {
            User: prisma.user,
        },
    });
}
//# sourceMappingURL=updateUserProfile.js.map