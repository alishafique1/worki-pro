import { prisma } from 'wasp/server'

import { getAdminLeads } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (getAdminLeads as any)(args, {
    ...context,
    entities: {
      Lead: prisma.lead,
    },
  })
}
