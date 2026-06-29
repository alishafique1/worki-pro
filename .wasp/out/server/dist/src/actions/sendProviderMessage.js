import { prisma } from 'wasp/server';
import { sendProviderMessage } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return sendProviderMessage(args, {
        ...context,
        entities: {
            ServiceRequest: prisma.serviceRequest,
            CommunicationLog: prisma.communicationLog,
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=sendProviderMessage.js.map