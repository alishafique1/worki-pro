import { prisma } from 'wasp/server';
import { setLeadCreditCost } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return setLeadCreditCost(args, {
        ...context,
        entities: {
            ServiceRequest: prisma.serviceRequest,
        },
    });
}
//# sourceMappingURL=setLeadCreditCost.js.map