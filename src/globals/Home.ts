import { GlobalConfig } from 'payload'

export const Home: GlobalConfig = {
  slug: 'home',
  label: {
    singular: 'Contenido de página principal',
    plural: 'Contenido de página principal',
  },
  access: {
    read: () => true,
    update: ({req}) => req.user?.role === 'admin' || false,
  },
  fields: [
    {
      name: 'slider',
      type: 'blocks',
      label: 'Slider Principal',
      maxRows: 20,
      blocks: [
        {
          slug: 'slide',
          labels: {
            singular: 'Slide',
            plural: 'Slides',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Título',
              maxLength: 100,
            },
            {
              name: 'subtitle',
              type: 'text',
              required: false,
              label: 'Subtítulo',
              maxLength: 200,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Imagen',
            },
          ],
        },
      ],
    },
    {
        name: 'categories',
        label: 'Categorías destacadas',
        type: 'relationship',
        admin: {
          components: {
            Field: '@/adminComponents/CategoryMultiSelectField',
          }
        },
        hasMany: true,
        relationTo: 'categories',
      },
    {
      name: 'products',
      type: 'group',
      label: 'Productos Destacados',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título de la Sección',
          defaultValue: 'Productos Destacados',
          maxLength: 100,
        },
        {
          name: 'products',
          type: 'relationship',
          label: 'Lista de Productos',
          admin: {
            components: {
              Field: '@/adminComponents/ProductSelectField',
            },
          },
          hasMany: true,
          relationTo: 'products',
        },
      ],
    },
  ],
}