import { prisma } from 'wasp/server'

import { getServiceCategories } from '../../../../../src/consumer/operations'


export default async function (args, context) {
  return (getServiceCategories as any)(args, {
    ...context,
    entities: {
      ServiceCategory: prisma.serviceCategory,
    },
  })
}
