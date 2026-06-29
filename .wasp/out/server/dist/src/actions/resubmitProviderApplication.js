import { prisma } from 'wasp/server';
import { resubmitProviderApplication } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return resubmitProviderApplication(args, {
        ...context,
        entities: {
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=resubmitProviderApplication.js.map