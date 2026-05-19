import { prisma } from 'wasp/server'

import { submitLead } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (submitLead as any)(args, {
    ...context,
    entities: {
      Lead: prisma.lead,
    },
  })
}
