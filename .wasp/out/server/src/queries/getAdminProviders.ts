import { prisma } from 'wasp/server'

import { getAdminProviders } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (getAdminProviders as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
      User: prisma.user,
    },
  })
}
