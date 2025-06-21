import type { CollectionConfig } from 'payload'
const isAdmin = ({ req: { user } }: any) => {
  return user?.role === 'admin'
}

export const Certificate: CollectionConfig = {
  slug: 'certificate',
  labels: {
    singular: 'Certificado',
    plural: 'Certificados',
  },
  access: {
    read: isAdmin,
    create: () => true,
    update: isAdmin,
    delete: isAdmin,
  },
  upload: {
    staticDir: 'certificates',
    mimeTypes: ['application/pdf'],
    adminThumbnail: undefined,
  },
  fields: [],
}