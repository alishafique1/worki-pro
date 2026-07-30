import { prisma } from 'wasp/server';
import { getAdminLeads } from '../../../../../src/admin/operations';
export default async function (args, context) {
    return getAdminLeads(args, {
        ...context,
        entities: {
            Lead: prisma.lead,
        },
    });
}
//# sourceMappingURL=getAdminLeads.js.map