import { prisma } from 'wasp/server';
import { acceptServiceRequest } from '../../../../../src/provider/operations';
export default async function (args, context) {
    return acceptServiceRequest(args, {
        ...context,
        entities: {
            ServiceRequest: prisma.serviceRequest,
            Appointment: prisma.appointment,
            ProviderFee: prisma.providerFee,
            Provider: prisma.provider,
            RewardTransaction: prisma.rewardTransaction,
            RewardAccount: prisma.rewardAccount,
        },
    });
}
//# sourceMappingURL=acceptServiceRequest.js.map