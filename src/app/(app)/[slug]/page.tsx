import Add from "@/components/Add";
import ProductImages from "@/components/ProductImages";
//import Reviews from "@/components/Reviews";
//import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Brand, Category, Media, Product, Tag } from '@/payload-types'
import Image from 'next/image'
import Link from 'next/link'
import Skeleton from '@/components/Skeleton'
import { notFound } from "next/navigation";
import { getPriceProduct } from "utils/consts";
import { headers } from "next/headers";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
})  {
  const newParams = await params
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({
    headers: headersList
  })
  const productResult = await payload.find({
    collection: 'products',
    depth:2,
    where: {
      slug: {
        equals: newParams.slug
      }
    },
    user,
    overrideAccess: false,
  })
 
  const product: Product = productResult.docs[0]
  if (!product) {
    notFound()
  }
  const secondImages: Media [] = product?.images?.map(image=> image.img as Media) ?? []
  const images = [product?.image as Media, ...secondImages]
  const price = getPriceProduct(product)
  return (
    <div className="mt-4 px-4 md:px-8 lg:px-16 2xl:max-w-[1700px] mx-auto relative flex flex-col lg:flex-row gap-16">
      {/* IMG */}
      {product &&
      <>
        <div className="w-full lg:w-1/2 lg:sticky top-20 h-max">
          <Suspense fallback={<Skeleton />}>
            <ProductImages items={images} />
          </Suspense>
        </div>
        {/* TEXTS */}
        <Suspense fallback={<Skeleton />}>
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <h1 className="text-3xl font-medium">{product.title}</h1>
            <div>
              {((product.brand as Brand).image as Media) ?
                <div
                  className="relative w-1/2 h-16 gap-4 cursor-pointer"
                >
                  <Link href={`/list?brands=${(product.brand as Brand).slug}`}>
                    <Image
                      src={((product.brand as Brand).image as Media).url as string}
                      alt={((product.brand as Brand).image as Media).alt}
                      fill
                      sizes="30vw"
                      className="object-cover rounded-md"
                    />
                  </Link>

                </div>
                :
                <Link href={`/list?brands=${(product.brand as Brand).slug}`}>{(product.brand as Brand).title}</Link>
              }
            </div>
            <p className="text-gray-500">{product.description}</p>
            <div className="h-[2px] bg-gray-100" />
            <h2 className="font-medium text-2xl">€{price}</h2>
            <div className="h-[2px] bg-gray-100" />
            <Add
              productId={product.id}
              price={price}
              stockNumber={product.stock}
              name={product.title}
              image={product.image as Media}
              slug={product.slug as string}
            />
            {/*)}*/}
            <div className="h-[2px] bg-gray-100" />
            <div className="flex">
              {(product.categories as Category[]).map((section: Category, index: number) => (
                <Link href={`/list?category=${section.slug}`} className="text-sm" key={section.slug}>
                  {index === product.categories.length - 1 ?
                    <span className="font-medium mb-4">{section.title}</span>
                    :
                    <span className="font-medium mb-4">{section.title}&nbsp;&nbsp;|&nbsp;&nbsp;</span>

                  }
                </Link>
              ))}
            </div>
            <div className="h-[2px] bg-gray-100" />
            <div className="flex">
              {(product.tags as Tag[]).map((tag: Category, index: number) => (
                <Link href={`/list?tags=${tag.slug}`} className="text-sm" key={tag.slug}>
                  {index === (product.tags as Tag[]).length - 1 ?
                    <span className="font-medium mb-4">{tag.title}</span>
                    :
                    <span className="font-medium mb-4">{tag.title}&nbsp;&nbsp;|&nbsp;&nbsp;</span>

                  }
                </Link>
              ))}
            </div>
            {/*<div className="h-[2px] bg-gray-100" />*/}
            {/* REVIEWS */}
            {/*<h1 className="text-2xl">User Reviews</h1>*/}
            {/*<Suspense fallback="Loading...">*/}
            {/*  /!*<Reviews productId={product._id!} />*!/*/}
            {/*</Suspense>*/}
          </div>
        </Suspense>
      </>
      }
    </div>
  );
};

