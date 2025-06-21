// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres';
import { payloadCloudPlugin } from '@payloadcms/payload-cloud';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Carts } from './collections/Carts';
import { Categories } from '@/collections/Categories';
import { Brands } from '@/collections/Brands';
import { Products } from '@/collections/Products';
import { Tags } from '@/collections/Tags';
import { es } from '@payloadcms/translations/languages/es';
import { Certificate } from './collections/Certificate';
import { Orders } from './collections/Orders';
import { IVA } from './globals/IVA';
import { CompanyInfo } from './globals/CompanyInfo';
import { Home } from './globals/Home';
import { nodemailerAdapter } from '@payloadcms/email-nodemailer';


const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  globals: [
    Home,
    IVA,
    CompanyInfo
  ],
  collections: [
    Users,
    Media,
    Categories,
    Brands,
    Tags,
    Products,
    Certificate,
    Carts,
    Orders
  ],
  upload: {
    limits: {
      fileSize: 2000000, // 2MB
    },
  },
  sharp,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ['@/adminComponents/CustomAdminLogin.tsx'],
      header: ['@/adminComponents/UnactivatedUsers.tsx'],
      providers: ['@/adminComponents/providers/CustomModalProvider'], // Use the wrapped provider
    },
    meta: {
      titleSuffix: 'Euro Estetic',
      icons: [{ url: '/logo.png' }],
    },
    suppressHydrationWarning: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // TODO: PONER EN FALSE PUSH EN PRODUCCION
    push: process.env.NODE_ENV === 'production' ? false : true,
  }),
  plugins: [
    payloadCloudPlugin(),
  ],
  i18n: {
    supportedLanguages: { es },
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_ADDRESS as string,
    defaultFromName: process.env.SMTP_FROM_NAME as string,
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),

});
