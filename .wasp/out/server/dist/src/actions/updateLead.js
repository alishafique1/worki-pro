import { prisma } from 'wasp/server';
import { updateLead } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return updateLead(args, {
        ...context,
        entities: {
            Lead: prisma.lead,
        },
    });
}
//# sourceMappingURL=updateLead.js.map