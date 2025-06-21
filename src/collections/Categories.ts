import type {CollectionConfig} from 'payload'
import { slugField } from '@/fields/slug'

//@ts-ignore
// const buildCategoryTree = (categories, parentId = null, level = 0) => {
//   return categories
//     .filter((category) => category.parent === parentId)
//     .flatMap((category) => [
//       {
//         id: category.id,
//         title: `${'—'.repeat(level)} ${category.title}`, // Añade indentación según el nivel
//       },
//       ...buildCategoryTree(categories, category.id, level + 1),
//     ]);
// };
export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Categoría',
    plural: 'Categorías',
  },
  access: {
    read: () => true,
    update: ({req}) => req.user?.role === 'admin' || false,
    create: ({req}) => req.user?.role === 'admin' || false, 
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
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categoría padre',
      required: false,
      admin: {
        position: 'sidebar',
        isSortable: true,
        components: {
          Field: '@/adminComponents/CategoryTreeField',
        }
      },
    },
    {
      name: 'subcategories',
      type: 'relationship',
      relationTo: 'categories',
      label: 'SubCategorías',
      required: false,
      hasMany: true,
      admin:{
        hidden: true
      }
    },
  ]
}
