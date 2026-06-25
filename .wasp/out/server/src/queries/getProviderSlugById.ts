import { prisma } from 'wasp/server'

import { getProviderSlugById } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getProviderSlugById as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
