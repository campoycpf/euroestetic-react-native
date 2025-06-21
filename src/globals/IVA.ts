import { GlobalConfig } from 'payload';

export const IVA: GlobalConfig = {
  slug: 'iva',
  label: 'IVA',
  access: {
    read: () => true,
    update: ({req}) => req.user?.role === 'admin' || false
  },
  fields: [
    {
      name: 'value',
      label: 'Porcentaje de IVA',
      type: 'number',
      required: true,
      defaultValue: 21,
      admin: {
        step: 1,
      },
    },
  ],
};