import { prisma } from 'wasp/server';
import { updateProviderAppointment } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return updateProviderAppointment(args, {
        ...context,
        entities: {
            Appointment: prisma.appointment,
            ServiceRequest: prisma.serviceRequest,
            Provider: prisma.provider,
        },
    });
}
//# sourceMappingURL=updateProviderAppointment.js.map