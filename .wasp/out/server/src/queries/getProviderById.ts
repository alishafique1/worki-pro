import { prisma } from 'wasp/server'

import { getProviderById } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getProviderById as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      ProviderCategory: prisma.providerCategory,
      ServiceCategory: prisma.serviceCategory,
      Review: prisma.review,
    },
  })
}
