import { prisma } from 'wasp/server'

import { getBillingStatus } from '../../../../../src/provider/billing'


export default async function (args, context) {
  return (getBillingStatus as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      ProviderFee: prisma.providerFee,
    },
  })
}
