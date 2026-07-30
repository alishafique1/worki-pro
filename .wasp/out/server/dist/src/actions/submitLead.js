import { prisma } from 'wasp/server';
import { submitLead } from '../../../../../src/consumer/operations';
export default async function (args, context) {
    return submitLead(args, {
        ...context,
        entities: {
            Lead: prisma.lead,
        },
    });
}
//# sourceMappingURL=submitLead.js.map