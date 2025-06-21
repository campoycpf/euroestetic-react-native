import type { Access, Block, CollectionConfig } from 'payload'
import { slugField } from '@/fields/slug'

const ImagesBlock: Block = {
  slug: 'image', // required
  interfaceName: 'ImageBlock',
  labels: {
    singular: 'imagen',
    plural: 'imágenes'
  },
  fields: [
    // required
    {
      name: 'img', // Campo para cargar imágenes
      type: 'upload',
      relationTo: 'media', // Relación con la colección de medios
      label: 'Imagen',
      required: false, // Hazlo opcional si no todas las categorías tendrán imagen
    },
  ],
}
export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Producto',
    plural: 'Productos',
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
      maxLength: 200
    },
    {
      name: 'description',
      type: 'textarea',
      required: false,
      label: 'Descripción',
    },
    {
      name: 'price',
      label: 'Precio',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'price_wholesale',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Precio Mayorista',
      access: {
        read: ({req}) => {
          return req.user?.role === 'admin' || req.user?.role === 'pro'
        },
      },
    },
    {
      name: 'stock',
      type: 'number',
      required: true,
      defaultValue: 0,
      //@ts-ignore
      validate: (value: number) => Number.isInteger(value) || 'Debes introducir un entero',
      label: 'Stock',
    },
    {
      name: 'image', // Campo para cargar imágenes
      type: 'upload',
      relationTo: 'media', // Relación con la colección de medios
      label: 'Imagen Principal',
      required: false, // Hazlo opcional si no todas las categorías tendrán imagen
    },
    {
      name: 'images', // required
      label: 'Imagenes Secundarias: (máximo 3)',
      type: 'blocks', // required
      minRows: 0,
      maxRows: 3,
      blocks: [
        // required
        ImagesBlock,
      ],
    },
    ...slugField(),
    {
      name: 'brand',
      label: 'Marca',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: false,
      relationTo: 'brands',
      required: true
    },
    {
      name: 'tags',
      label: 'Tags',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'tags',
      required: false
    },
    {
      name: 'categories',
      label: 'Categorías',
      type: 'relationship',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/adminComponents/CategoryMultiSelectField',
        }
      },
      hasMany: true,
      relationTo: 'categories',
      required: true
    },
  ]
}

