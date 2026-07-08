import { prisma } from 'wasp/server'

import { disputeLeadFee } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (disputeLeadFee as any)(args, {
    ...context,
    entities: {
      ProviderFee: prisma.providerFee,
      Provider: prisma.provider,
    },
  })
}
