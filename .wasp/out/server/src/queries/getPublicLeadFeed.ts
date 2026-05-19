import { prisma } from 'wasp/server'

import { getPublicLeadFeed } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (getPublicLeadFeed as any)(args, {
    ...context,
    entities: {
      ServiceRequest: prisma.serviceRequest,
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
