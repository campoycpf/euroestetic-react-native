'use client'
import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import MainSlider from "@/components/Slider";
import { Suspense } from 'react'
//import { getPayload } from 'payload'
//import configPromise from '@payload-config'
import { Product } from '@/payload-types'
import { useHomeStore } from "@/store";
//import { headers } from "next/headers";

const HomePage = () => {

      /* const payload = await getPayload({ config: configPromise })
      const headersList = await headers()
      const { user } = await payload.auth({
        headers: headersList
      })
      const newProductsResult = await payload.find({
        collection: 'products',
        sort: 'id',
        depth:2,
        pagination: false,
        select: {
          description: false,
          slugLock: false,
        },
        user,
        overrideAccess: false,
      })
      const newProducts: Product[] = newProductsResult.docs */
      const {home} = useHomeStore()
      const newProducts = home?.products.products as Product[] || []
      const productsTitle = home?.products.title || ''
      
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <MainSlider />
      <div className="mt-24">
      
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </div>
      <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        {newProducts.length > 0 && <h1 className="text-3xl text-center">{productsTitle}</h1>}
        <Suspense fallback={<Skeleton />}>
          <ProductList products={newProducts}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;


