import { prisma } from 'wasp/server'

import { setProfilePhoto } from '../../../../../src/provider/operations'


export default async function (args, context) {
  return (setProfilePhoto as any)(args, {
    ...context,
    entities: {
      Provider: prisma.provider,
    },
  })
}
