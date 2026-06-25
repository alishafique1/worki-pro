import { prisma } from 'wasp/server'

import { deleteAdminCategory } from '../../../../../src/admin/operations'


export default async function (args, context) {
  return (deleteAdminCategory as any)(args, {
    ...context,
    entities: {
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
