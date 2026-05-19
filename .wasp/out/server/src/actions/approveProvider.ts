import { prisma } from 'wasp/server'

import { approveProvider } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (approveProvider as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
