import { prisma } from 'wasp/server'

import { getPublicProvider } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (getPublicProvider as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      Review: prisma.review,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
