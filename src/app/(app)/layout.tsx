import type { Metadata, Viewport } from "next";
//import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React, { ReactNode } from 'react'
import { Brand, Category, Tag } from '@/payload-types'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { useCategoriesStore, useCategoriesTreeStore, useTagsStore, useBrandsStore, useIvaStore, useHomeStore } from '@/store'
import StoreInitializer from '@/store/StoreInitializer'
import "./globals.css";
import { buildCategoryTree } from "utils/consts";
import { getHome, getIva } from "@/actions/globals";
//const inter = Inter({ subsets: ["latin"] });
import PWAInstall from '@/components/PWAInstall'
//import PWARedirector from "@/components/PWARedirector";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300"],
});
export const viewport: Viewport = {
    themeColor: "#0a1946",
}
export const metadata: Metadata = {
  title: "Euro Estetic Shop",
  description: "Tienda online de productos de belleza y cosmética profesional",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Euro Estetic Shop",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Euro Estetic Shop",
    title: {
      default: "Euro Estetic Shop",
      template: "%s - Euro Estetic Shop",
    },
    description: "Tienda online de productos de belleza y cosmética profesional",
  },
  twitter: {
    card: "summary",
    title: {
      default: "Euro Estetic Shop",
      template: "%s - Euro Estetic Shop",
    },
    description: "Tienda online de productos de belleza y cosmética profesional",
  },
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: ReactNode;
}>)=> {
  const payload = await getPayload({ config: configPromise })

  const homeObject = await getHome()
  useHomeStore.setState({
    home: homeObject,
  })

  const iva = await getIva()
  useIvaStore.setState({
    iva
  })
  const categoriesResult = await payload.find({
    collection: 'categories',
    depth: 2,
    pagination: false,
    sort: ['parent', 'id'],
  })
  const categories: Category[] = categoriesResult.docs as Category[]
  const categoriesTree = buildCategoryTree(categories)
  useCategoriesTreeStore.setState({
    categoriesTree: categoriesTree
  })

  useCategoriesStore.setState({
    categories: categories
  })

  const brandsResult = await payload.find({
    collection: 'brands',
    depth: 2,
    pagination: false,
    sort: ['title', 'id'],
  })
  const brands: Brand[] = brandsResult.docs as Brand[]
  useBrandsStore.setState({
    brands
  })

  const tagsResult = await payload.find({
    collection: 'tags',
    pagination: false,
    sort: ['title', 'id'],
  })
  const tags: Tag[] = tagsResult.docs as Tag[]
  useTagsStore.setState({
    tags
  })
  return (
    <html lang="es" translate="no">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1 viewport-fit=cover"/>
      <link rel="icon" href="/logo.png" sizes="192x192" />
      <meta name="google" content="notranslate" />
      
      {/* PWA Meta Tags */}
      <meta name="application-name" content="Euro Estetic Shop" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Euro Estetic Shop" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#0a1946" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#0a1946" />
      <meta name="msapplication-navbutton-color" content="#0a1946"></meta>
      
      {/* Apple Touch Icons */}
      <link rel="apple-touch-icon" href="/logo-white-blue.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/logo-white-blue.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/logo-white-blue.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/logo-white-blue.png" />
      
      {/* Splash Screens */}
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </head>
    <body className={`${poppins.className} text-euroestetic`} style={{letterSpacing: '-0'}}
          suppressHydrationWarning={true}
    >
        <StoreInitializer categories={categories} categoriesTree={categoriesTree} brands={brands} tags={tags} iva={iva} home={homeObject}/>
       {/*  <PWARedirector /> */}
        <Navbar categoriesTree={categoriesTree}/>
            {children}
        <Footer />
        <PWAInstall />
      </body>
    </html>
  );
}
export default RootLayout