import { prisma } from 'wasp/server'

import { resolveFeeDispute } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (resolveFeeDispute as any)(args, {
    ...context,
    entities: {
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
      ServiceRequest: prisma.serviceRequest,
    },
  })
}
