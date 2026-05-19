import { prisma } from 'wasp/server'

import { updateProviderServices } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (updateProviderServices as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
