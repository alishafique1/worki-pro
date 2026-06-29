import { prisma } from 'wasp/server';
import { getProviderAppointments } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return getProviderAppointments(args, {
        ...context,
        entities: {
            Appointment: prisma.appointment,
            Provider: prisma.provider,
            ServiceRequest: prisma.serviceRequest,
            CommunicationLog: prisma.communicationLog,
        },
    });
}
//# sourceMappingURL=getProviderAppointments.js.map