import { prisma } from 'wasp/server'

import { createProviderProfile } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (createProviderProfile as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
