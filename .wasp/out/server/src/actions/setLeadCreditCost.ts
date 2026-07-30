import { prisma } from 'wasp/server'

import { setLeadCreditCost } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (setLeadCreditCost as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
    },
  })
}
