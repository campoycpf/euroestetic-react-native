import type { CollectionConfig} from 'payload'
import { slugField } from '@/fields/slug'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },
  access: {
    read: () => true,
    create: ({req}) => req.user?.role === 'admin' || false,
    update: ({req}) => req.user?.role === 'admin' || false,
    delete: ({req}) => req.user?.role === 'admin' || false
  },
  admin: {
    useAsTitle: 'title', // Usa el campo "title" como representación en los selects
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nombre',
      maxLength: 100
    },
    ...slugField(),
  ]
}
