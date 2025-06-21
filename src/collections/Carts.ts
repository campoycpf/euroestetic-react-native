import type { Access, CollectionConfig } from 'payload'

const isAdminOrOwnCart: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  
  // For user/pro, only allow access to their own carts
  return {
    user: {
      equals: user.id,
    },
  };
};

const canCreateCart: Access = ({ req: { user } }) => {
  if (!user) return false;
  return ['user', 'pro'].includes(user.role);
};

const canModifyOwnCart: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (!['user', 'pro'].includes(user.role)) return false;

  return {
    user: {
      equals: user.id,
    },
  };
};

export const Carts: CollectionConfig = {
  slug: 'carts',
  labels: {
    singular: 'Carrito',
    plural: 'Carritos',
  },
  access: {
    read: isAdminOrOwnCart,
    create: canCreateCart,
    update: canModifyOwnCart,
    delete: canModifyOwnCart,
  },
  admin: {
    defaultColumns: [ 'product', 'quantity', 'user'],
  },
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      hasMany: false,
      admin: {
        disabled: true,
      },
    },
    {
      name: 'quantity',
      type: 'number',
      required: true,
      defaultValue: 1,
      min: 1,
      admin: {
        disabled: true,
      },
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      admin: {
        disabled: true, 
      }
    }
  ],
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        if (req?.user?.id) {
          return {
            ...data,
            user: req.user.id
          }
        }
        return data
      }
    ]
  }
}