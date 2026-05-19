import { prisma } from 'wasp/server'

import { getProviders } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getProviders as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
