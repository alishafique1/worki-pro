import { prisma } from 'wasp/server';
import { getMessagesForRequest } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return getMessagesForRequest(args, {
        ...context,
        entities: {
            CommunicationLog: prisma.communicationLog,
            ServiceRequest: prisma.serviceRequest,
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=getMessagesForRequest.js.map