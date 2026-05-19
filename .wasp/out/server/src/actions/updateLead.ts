import { prisma } from 'wasp/server'

import { updateLead } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (updateLead as any)(args, {
    ...context,
    entities: {
      Lead: prisma.lead,
    },
  })
}
