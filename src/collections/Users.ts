import { User } from '@/payload-types'
import type { Access, CollectionConfig } from 'payload'
import { PROVINCES } from 'utils/consts'
import { welcomeEmailHTML, verificationEmailHTML } from 'utils/emailTemplates'
import { validateCifDniNie, validateCP } from 'utils/validations'


export const adminsAndUser: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'admin') return true

  return {
    id: {
      equals: user.id,
    },
  }
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    verify: {
      generateEmailHTML: ({ token, user }) => {
        user.email = 'campoydaw@gmail.com'
        return verificationEmailHTML({ token, user })
      },
      generateEmailSubject: () => 'Verifica tu cuenta en Euro Estetic', 
    },
    
  },
  labels: {
    singular: 'Usuario',
    plural: 'Usuarios',
  },
  access: {
    read: adminsAndUser,
    create: () => true,
    update: adminsAndUser,
    delete: () => false,
    admin: ({ req }) => req.user?.role === 'admin' || false,
  },
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => {
      if (!user) return true;
      return user.role !== 'admin';
    },
    defaultColumns: ['id'],
  },
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'name',
      saveToJWT: true,
      label: 'Nombre',
      type: 'text',
      required: false,
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      required: false,
    },
    {
      name: 'city',
      label: 'Población',
      type: 'text',
      required: false,
    },
    {
      name: 'cp',
      label: 'C.P.',
      type: 'text',
      required: false,
      validate: (value: any) => {
        if (!value) return true;
        return validateCP(value)
      },
      maxLength: 5,
    },
    {
      name: 'province',
      label: 'Provincia',
      type: 'select',
      required: false,
      options: PROVINCES,
      enumName: 'enum_users_province'
    },
    {
      name: 'mailing_name',
      label: 'Nombre / Empresa de facturación',
      type: 'text',
      required: false,
    },
    {
      name: 'mailing_address',
      label: 'Dirección de facturación',
      type: 'text',
      required: false,
    },
    {
      name: 'mailing_city',
      label: 'Población de facturación',
      type: 'text',
      required: false,
    },
    {
      name: 'mailing_cp',
      label: 'C.P. de facturación',
      type: 'text',
      required: false,
      validate: (value: any) => {
        if (!value) return true;
        return validateCP(value)
      },
      maxLength: 5,
    },
    {
      name: 'mailing_province',
      label: 'Provincia de facturación',
      type: 'select',
      required: false,
      options: PROVINCES,
      enumName: 'enum_users_province'
    },
    {
      name: 'cif_dni_nie',
      label: 'CIF / DNI / NIE',
      type: 'text',
      required: false,
      validate: async (value: any): Promise<string | true> => {
        if (!value) return true;
        return validateCifDniNie(value)
      },
    },
    {
      name: 'role',
      defaultValue: 'user',
      required: true,
      type: 'select',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Pro', value: 'pro' },
      ],
    },
    {
      name: 'activated',
      label: 'Activado',
      defaultValue: true,
      required: true,
      type: 'checkbox',
    },
    {
      name: 'sendProEmail',
      label: 'Mandar correo de activación al guardar',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (data) => data?.role === 'pro' && data?.activated === true,
        description: 'Marcar para enviar email de bienvenida al activar cuenta PRO'
      },
    },
    {
      name: 'certificate',
      label: 'Certificado',
      type: 'upload',
      relationTo: 'certificate',
      required: false,
      admin: {
        condition: (data) => data?.role === 'pro'
      },
    },
    {
      name: 'welcomeEmailSent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true, // Oculto en el admin
      },
    }
  ],
  hooks: {
    afterChange: [
      async ({ req, doc, operation, previousDoc }) => {
        // Solo enviar email de bienvenida cuando el usuario se verifica
        if (operation === 'update' && doc._verified && !doc.welcomeEmailSent) {
          const html = welcomeEmailHTML(doc as User)
          await req.payload.sendEmail({
            to: 'campoydaw@gmail.com',//doc.email,
            subject: 'Bienvenido a Euro Estetic',
            html,
          });
           // Diferir la actualización para evitar bloqueos
          setTimeout(async () => {
            try {
              await req.payload.update({
                collection: 'users',
                id: doc.id,
                data: {
                  welcomeEmailSent: true,
                },
                context: {
                  triggerAfterChange: false,
                },
              });
              console.log('welcomeEmailSent actualizado correctamente');
            } catch (error) {
              console.error('Error actualizando welcomeEmailSent:', error);
            }
          }, 100);
        }
        if (operation === 'update' && 
          doc.role === 'pro' && 
          doc.activated === true && 
          doc.sendProEmail === true &&
          previousDoc?.sendProEmail === false) {
        
        const html = welcomeEmailHTML(doc as User)
        await req.payload.sendEmail({
          to: 'campoydaw@gmail.com',//doc.email,
          subject: 'Bienvenido a Euro Estetic - Cuenta PRO Activada',
          html,
        });
        
        console.log(`Email de activación PRO enviado a: ${doc.email}`);
        
        // Resetear el campo después de enviar para permitir futuros envíos
        setTimeout(async () => {
          try {
            await req.payload.update({
              collection: 'users',
              id: doc.id,
              data: {
                sendProEmail: false,
              },
              context: {
                triggerAfterChange: false,
              },
            });
            console.log('sendProEmail reseteado correctamente');
          } catch (error) {
            console.error('Error reseteando sendProEmail:', error);
          }
        }, 100);
        }
      },
    ],
  },
}
