import { prisma } from 'wasp/server'

import { getAdminCategories } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (getAdminCategories as any)(args, {
    ...context,
    entities: {
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
