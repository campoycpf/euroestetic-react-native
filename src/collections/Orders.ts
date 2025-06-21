import type { Access, BasePayload, CollectionConfig } from 'payload';
import { ORDER_STATUSES } from 'utils/consts';
import { PROVINCES } from 'utils/consts';
import { validateCifDniNie, validateCP } from 'utils/validations';
import { orderConfirmationEmailHTML } from 'utils/emailTemplates';

const generateInvoiceNumber = async (payload: BasePayload): Promise<string> => {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const lastOrder = await payload.find({
    collection: 'orders',
    sort: '-invoice_number',
    limit: 1,
  });

  let sequence = 1;
  if (lastOrder.docs.length > 0) {
    const lastNumber = lastOrder.docs[0].invoice_number;
    const lastYear = lastNumber?.slice(1, 3) || currentYear;
    if (lastYear === currentYear) {
      sequence = parseInt(lastNumber?.slice(3) || '0') + 1;
    }
  }
  // Return the formatted invoice number with the current year and sequenc
  return `D${currentYear}${sequence.toString().padStart(8, '0')}`;
};

const isUserProOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.role === 'user' || user.role === 'pro';
};

const isAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  return user.role === 'admin';
};

export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: {
    singular: 'Factura',
    plural: 'Facturas',
  },
  hooks: {
    beforeChange: [
      async ({ operation, data, req }) => {
        if (operation === 'create') {
          if (data) {
            data.invoice_number = await generateInvoiceNumber(req.payload);
          }
        }
        return data;
      }
    ],
    afterChange: [
      async ({ req, doc, operation, previousDoc }) => {
        // Solo enviar email cuando se crea un pedido desde la tienda (no desde admin)
        console.log('operation', operation);
        console.log('req.user', req.user);
        if (operation === 'create' && req.user && (req.user.role === 'user' || req.user.role === 'pro')) {
          try {
            const html = orderConfirmationEmailHTML(doc, req.user);
            await req.payload.sendEmail({
              to: 'campoydaw@gmail.com', // req.user.email,
              subject: `Confirmación de Pedido #${doc.invoice_number} - Euro Estetic`,
              html,
            });
            
            console.log(`Email de confirmación de pedido enviado a: ${req.user.email} para pedido #${doc.invoice_number}`);
          } catch (error) {
            console.error('Error enviando email de confirmación de pedido:', error);
          }
        }
        
        // Enviar email cuando se actualiza el estado a T o E y se marca el checkbox
        if (operation === 'update' && 
            (doc.status === 'T' || doc.status === 'E') && 
            doc.sendStatusEmail === true &&
            previousDoc?.sendStatusEmail === false) {
          try {
            const user = doc.user_id ? await req.payload.findByID({
              collection: 'users',
              id: doc.user_id
            }) : null;
            
            const html = orderConfirmationEmailHTML(doc, user);
            await req.payload.sendEmail({
              to: 'campoydaw@gmail.com', // user?.email || doc.email,
              subject: `Actualización de Pedido #${doc.invoice_number} - Euro Estetic`,
              html,
            });
            
            console.log(`Email de actualización de estado enviado para pedido #${doc.invoice_number}`);
            
            // Resetear el campo después de enviar para permitir futuros envíos
            setTimeout(async () => {
              try {
                await req.payload.update({
                  collection: 'orders',
                  id: doc.id,
                  data: {
                    sendStatusEmail: false,
                  },
                  context: {
                    triggerAfterChange: false,
                  },
                });
                console.log('sendStatusEmail reseteado correctamente');
              } catch (error) {
                console.error('Error reseteando sendStatusEmail:', error);
              }
            }, 100);
          } catch (error) {
            console.error('Error enviando email de actualización de estado:', error);
          }
        }
      },
    ],
  },
  access: {
    read: isUserProOrAdmin,
    create: isUserProOrAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'invoice_number',
    defaultColumns: [
       'invoice_number',
       'invoice_date',
       'customer',
       'status',
       'pdfDownload'
    ],
    listSearchableFields: ['invoice_number', 'cif_dni_nie'],
  },
  fields: [
    {
      name: 'pdfDownload',
      label: 'Factura PDF',
      type: 'ui',
      admin: {
        condition: ({ operation }) => operation !== 'create',
        components: {
          Cell: '@/adminComponents/DownloadInvoiceButton',
          Field: '@/adminComponents/DownloadInvoiceButton',
        }
      }
    },
    {
      type: 'row',
      fields: [
        { name: 'invoice_date',
            label: 'Fecha factura',
            type: 'date',
            admin: {
              readOnly: true,
              width: '150px',
              style: {
                fontWeight: 'bold',
              },
              date: {
                displayFormat: 'dd/MM/yyyy'
              }
            },
            defaultValue: () => new Date(),
          },
          {
            name: 'invoice_number',
            label: 'Número de Factura',
            type: 'text',
            admin: {
              readOnly: true,
              width: '150px',
              style: {
                fontWeight: 'bold',
              }
            }
          },
          {
            name: 'order_ref',
            label: 'Referencia de Pedido',
            type: 'text',
            admin: {
              readOnly: true,
              width: '150px',
              style: {
                fontWeight: 'bold',
              }
            },
            defaultValue: "000000000000"
          },
          {
            name: 'user_id',
            label: 'ID Usuario',
            type: 'text',
            admin: {
              components: {
                Field: '@/adminComponents/UserSearchField',
              },
              readOnly: true,
              width: '20%',
            }
          },
          {
            name: 'cif_dni_nie',
            label: 'CIF / DNI / NIE',
            type: 'text',
            required: true,
            validate: (value: any) => {
              return validateCifDniNie(value);
          },
            admin: {
              width: '150px',
            }
          },
      ]  
    },
    {
      type: 'row',
      fields: [
        {
          name: 'customer',
          label: 'Cliente',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          }
        },
        {
            name: 'mailing_address',
            label: 'Dirección',
            type: 'text',
            required: true,
            admin: {
              width: '50%',
            }
          },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'mailing_city',
          label: 'Población',
          type: 'text',
          required: true,
          admin: {
            width: '40%',
          }
        },
        {
          name: 'mailing_cp',
          label: 'C.P.',
          type: 'text',
          required: true,
          admin: {
            width: '20%',
          },
          validate: (value: any) => {
           return validateCP(value);
          },
          maxLength: 5,
        },
        {
          name: 'mailing_province',
          label: 'Provincia',
          type: 'select', 
          required: true,
          options: PROVINCES,
          admin: {
            width: '40%',
          }
        },
      ]
    },
    {
      type: 'row',
      fields: [
        {
          name: 'name',
          label: 'Nombre (Envío)',
          type: 'text',
          required: false,
        },
        {
          name: 'address',
          label: 'Dirección (Envío)',
          type: 'text',
          required: false,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          label: 'Población (Envío)',
          type: 'text',
          required: false,
        },
        {
          name: 'cp',
          label: 'C.P. (Envío)',
          type: 'text',
          required: false,
          validate: (value: any) => {
            if (!value) return true;
            return validateCP(value);
           },
          maxLength: 5,
        },
        {
          name: 'province',
          label: 'Provincia (Envío)',
          type: 'select',
          required: false,
          options: PROVINCES
        },
      ],
    },
    {
        name: 'status',
        label: 'Estado del pedido',
        type: 'radio',
        defaultValue: 'R',
        options: ORDER_STATUSES,
        admin: {
          layout: 'horizontal',
          style: {
            marginTop: '15px',
            marginBottom: '15px',
          }
        }
      },
      {
        name: 'sendStatusEmail',
        label: 'Enviar email de actualización al guardar',
        type: 'checkbox',
        defaultValue: false,
        admin: {
          condition: (data) => data?.status === 'T' || data?.status === 'E',
          description: 'Marcar para enviar email de actualización de estado al cliente'
        },
      },
    {
      name: 'order_items',
      label: 'Productos',
      type: 'array',
      required: true,
      admin: {
        components: {
          Field: '@/adminComponents/OrderItemsTable', // 👈 Este es tu componente personalizado
        }
      },
      fields: [
        {
          name: 'product_id',
          label: 'ID Producto',
          type: 'text',
          admin: {
            width: '100%',
            readOnly: true,
          },
        },
        {
          name: 'product_name',
          label: 'Descripción',
          type: 'text',
          required: true,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'quantity',
          label: 'Cantidad',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          //@ts-ignore
          validate: (val) => {
            if (val < 1) return 'La cantidad debe ser al menos 1';
            return true;
          },
          admin: {
            width: '25%',
            step: 1,
          },
        },
        {
          name: 'price',
          label: 'Precio',
          type: 'number',
          required: true,
          min: 0,
          defaultValue: 0,
          //@ts-ignore
          validate: (val) => {
            if (val < 0) return 'El precio no puede ser negativo';
            return true;
          },
          admin: {
            width: '25%',
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'iva',
      label: 'IVA',
      type: 'number',
      required: true,
      hooks: {
        beforeChange: [
          async ({ value, req }) => {
            if (!value) {
              const globalIVA = await req.payload.findGlobal({
                slug: 'iva',
              });
              return globalIVA.value;
            }
            return value;
          }
        ]
      },
      defaultValue:  async ({ req }) => {
        const globalIVA = await req.payload.findGlobal({
          slug: 'iva',
        });
        return globalIVA.value;
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'total_iva',
      label: 'Total IVA',
      type: 'number',
      admin: {
        hidden: true,
      },
      hooks: { // Añadimos hooks aquí
        beforeChange: [
          ({ value }) => {
            
            if (typeof value === 'number') {
              return parseFloat(value.toFixed(2));
            }
            return value;
          },
        ],
      },
      defaultValue: 0,
    },
    {
      name: 'total',
      label: 'Total',
      type: 'number',
      admin: {
        hidden: true,
      },
      hooks: { // Añadimos hooks aquí
        beforeChange: [
          ({ value }) => {
            if (typeof value === 'number') {
              return parseFloat(value.toFixed(2));
            }
            return value;
          },
        ],
      },
      defaultValue: 0,
    }
  ],
};