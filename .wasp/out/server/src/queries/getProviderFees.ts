import { prisma } from 'wasp/server'

import { getProviderFees } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (getProviderFees as any)(args, {
    ...context,
    entities: {
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
    },
  })
}
