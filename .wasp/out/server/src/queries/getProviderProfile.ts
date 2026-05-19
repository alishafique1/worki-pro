import { prisma } from 'wasp/server'

import { getProviderProfile } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (getProviderProfile as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
