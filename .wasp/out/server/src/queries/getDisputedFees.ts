import { prisma } from 'wasp/server'

import { getDisputedFees } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (getDisputedFees as any)(args, {
    ...context,
    entities: {
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
      ServiceRequest: prisma.serviceRequest,
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
