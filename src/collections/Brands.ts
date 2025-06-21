import type {CollectionConfig} from 'payload'
import { slugField } from '@/fields/slug'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: {
    singular: 'Marca',
    plural: 'Marcas',
  },
  admin: {
    useAsTitle: 'title', // Usa el campo "title" como representación en los selects
  },
  access: {
    read: () => true,
    update: ({req}) => req.user?.role === 'admin' || false,
    create: ({req}) => req.user?.role === 'admin' || false, 
    delete: ({req}) => req.user?.role === 'admin' || false
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Nombre',
      maxLength: 100
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Descripción',
    },
    {
      name: 'image', // Campo para cargar imágenes
      type: 'upload',
      relationTo: 'media', // Relación con la colección de medios
      label: 'Imagen',
      required: false, // Hazlo opcional si no todas las categorías tendrán imagen
    },
    ...slugField(),
  ]
}
