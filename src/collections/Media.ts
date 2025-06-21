import type { Access, CollectionConfig, User } from 'payload'

// const isAdminOrHasAccessToImages = (): Access => async ({ req }) => {
//   const user = req.user as User | undefined
//
//   if (!user) return false
//   if (user.role === 'admin') return true
//
//   return {
//     user: {
//       equals: user.id,
//     },
//   }
// }

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Archivo',
    plural: 'Archivos',
  },
  access: {
    read: () => true,
    update: ({req}) => req.user?.role === 'admin' || false,
    create: ({req}) => req.user?.role === 'admin' || false, 
    delete: ({req}) => req.user?.role === 'admin' || false
  },
  upload: {
    staticDir: 'public/media',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 80,
        effort: 6,
      }
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
}
