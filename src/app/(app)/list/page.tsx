"use client"
import Filter from "@/components/Filter";
import Skeleton from "@/components/Skeleton";
import Image from "next/image";
import React, { useEffect, useState } from 'react'
import { useCategoriesStore, useCategoriesTreeStore, useBrandsStore, useTagsStore } from '@/store'
import { Brand, Category, Media, Product, Tag } from '@/payload-types'
import Link from 'next/link'
import ProductList from '@/components/ProductList'
import { getCategoryAndSubcategoryIds } from '../../../../utils/consts'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import SkeletonNoResults from '@/components/SkeletonNoResults'
import { useInView } from 'react-intersection-observer'


export const dynamic = "force-dynamic";
const ListPage = () => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [products, setProducts] = useState<Product[] | null>(null)
  const [totalProduct, setTotalProducts] = useState(0)
  const [page, setPage] = useState(1)
  const [hasMoreData, setHasMoreData] = useState(true);
  const searchParams = useSearchParams()
  const currentCategorySlug = searchParams.get('category')
  const brandsUrl = searchParams.get('brands')
  const tagsUrl = searchParams.get('tags')
  const sortSlug = searchParams.get('sort')
  const categories = useCategoriesStore.getState().categories
  const category = categories.find(category => category.slug === currentCategorySlug)
  const [scrollTrigger, isInView] = useInView();

  type BreadCrumb = {
    title: string;
    slug: string;
  }
  const breadCrums: BreadCrumb[] = []
  if (category) {
    const getBreadCrumbs = (cat: Category) => {
      const bread:BreadCrumb = {
        title: cat.title,
        slug: cat.slug as string
      }
      breadCrums.unshift(bread)
      if (cat.parent as Category) {
        getBreadCrumbs(cat.parent as Category)
      }
    }

    getBreadCrumbs(category)
  }
  const bread:BreadCrumb = {
    title: 'Todos los productos',
    slug: ''
  }
  breadCrums.unshift(bread)
  let categoriesTree: Category[] = []
  if (category) {
    categoriesTree = useCategoriesTreeStore.getState().categoriesTree
  }
  const categoryIds = category ? getCategoryAndSubcategoryIds(category.slug as string, categoriesTree) : []
  const brandSlugs = (brandsUrl?.split('-') ?? []) as string[]
  const tagSlugs = (tagsUrl?.split('-') ?? []) as string[]
  let brands: Brand[] = []
  if (brandSlugs.length >0) {
    brands = useBrandsStore.getState().brands
  }
  let brandsBreadCrumb: BreadCrumb[] = brands.map((brand)=>{
    return {
      slug: brand.slug,
      title: brand.title
    } as BreadCrumb
  })
  brandsBreadCrumb = brandsBreadCrumb.filter(brand=>brandSlugs.includes(brand.slug))

  let tags: Tag[] = []
  if (tagSlugs.length >0) {
    tags = useTagsStore.getState().tags
  }
  let tagsBreadCrumb: BreadCrumb[] = tags.map((tag)=>{
    return {
      slug: tag.slug,
      title: tag.title
    } as BreadCrumb
  })
  tagsBreadCrumb = tagsBreadCrumb.filter(tag=>tagSlugs.includes(tag.slug))

  const getProducts = async (scroll: boolean = false) => {
    try {
      const response = await fetch(
        pathname.split('/')[0] + '/api/app/products/',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            categoryIds,
            brandSlugs,
            tagSlugs,
            sortSlug,
            page: scroll ? page : 1
          })
        }
      );
      const productsResult = (await response.json());
      const products = productsResult.docs
      const {hasNextPage, totalDocs} = productsResult
      const currentPage = productsResult.page
      setHasMoreData(hasNextPage)
      setTotalProducts(totalDocs)
      if (!scroll) {
        setProducts(products)
        setPage(currentPage + 1)
      }
      if (hasMoreData) {
        setProducts((prevProducts) => prevProducts && JSON.stringify(prevProducts) !== JSON.stringify(products) ? [...prevProducts as Product[] , ...products] : products)
        setPage(currentPage + 1)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, [])
  useEffect(() => {
    setPage(1)
    getProducts().then()
  }, [searchParams])
  useEffect(() => {
    if (isInView && hasMoreData) {
      getProducts(true).then();
    }
  }, [isInView, hasMoreData]);


  const BreadCrumbsComponents = () =>{
    return (
      <div>
        {breadCrums.map((br,index) =>(
          <span key={br.slug} className="text-sm">
            {breadCrums.length === index + 1 ?
              <span className="opacity-40">{br.title}</span>
              :
              <Link href={`${br.slug === '' ? '/list' : '/list?category=' + br.slug}`}>{br.title + ' > '} </Link>
            }

          </span>
        ))}
      </div>
    )
  }
  const TagsAndBrandsComponent = () => {
    const tsAndBs = [...brandsBreadCrumb, ...tagsBreadCrumb]
    return (
      <>
        {tsAndBs.map((item,index) =>(
          <div key={`tag_brand_${index}`}
            className="py-1 px-4 h-6 min-w-20 m-1 max-w-fit rounded-2xl text-xs font-medium border border-solid flex justify-between items-center"
          >
            {item.title}
            <span
              className={`ml-4 cursor-pointer`}
              onClick={()=>{
                deleteBrandOrTag(item.slug)
              }}
            >
                X
              </span>
          </div>
        ))}
      </>
    )
  }
  const params = new URLSearchParams(searchParams);
  const deleteBrandOrTag = (
    slug: string
  ) => {
    const brandItems = searchParams.get('brands')?.split("-") ?? []
    let tagItems: string[] = []
    if (!brandItems || !brandItems.includes(slug)) {
      tagItems = searchParams.get('tags')?.split("-") ?? []
    }
    if (tagItems.length === 0 && brandItems.length ===0) return
    let items: string[] = []
    let collection = ''
    if (brandItems.length > 0) {
      items = brandItems
      collection = 'brands'
    }
    if (tagItems.length > 0) {
      items = tagItems
      collection = 'tags'
    }
    if (items?.length === 1 && items[0] === slug) {
      params.delete(collection)
    } else {
      items = items?.filter(item => item !== slug)
      if (items) {
        let queryString = ''
        items.forEach((item)=>{
          queryString += item + '-'

        })
        queryString = queryString.substring(0, queryString.length - 1)
        params.set(collection, queryString)
      } else {
        params.delete(collection)
      }
    }
    // if (value === '' && !params.get(name)) params.delete(name)
    // else {
    //   const items = params.get(name)
    //   params.set(name, items ? items + '_' + value : value)
    // }
    replace(`${pathname}?${params.toString()}`,{ scroll: false });
  };
  return (
    <>
      <div className="px-2 mt-4 lg:px-6 xl:px-12 2xl:px-32 min-[1850px]:px-64">
        {/* CAMPAIGN */}
        <div className="hidden sm:flex justify-between h-64 relative">
          <div className={`w-1/3 flex flex-col items-center justify-center gap-8 ${(category?.image as Media) ? 'bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70' : 'bg-euroestetic'} text-white`}>
            <h1 className="text-4xl text-center font-semibold leading-[48px]">
              {category?.title ?? 'Productos'}
            </h1>
            {/*<button className="rounded-3xl bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white w-max py-3 px-5 text-sm">*/}
            {/*  Buy Now*/}
            {/*</button>*/}
          </div>
          <div className="relative w-2/3">
            <Image src={(category?.image as Media) ? `/media/${(category?.image as Media)?.filename}`: '/logo-default-image.png'}
                   alt={(category?.image as Media)?.alt || 'category'}
                   fill
                   className="object-cover"
            />
            {(category?.image as Media) &&
              <>
               <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white pointer-events-none" />
               <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-euroestetic/70 pointer-events-none" />
              </>
            }
          </div>
        </div>
        <div className="mt-4 text-xl font-semibold flex min-h-8">
          <div className="flex flex-wrap">
            <BreadCrumbsComponents />
          </div>
        </div>
        <div className="text-xl font-semibold flex min-h-8">
          <div className="flex flex-wrap">
            <TagsAndBrandsComponent />
          </div>
        </div>
        {/* FILTER */}
        <Filter tagSlugs={tagSlugs} brandSlugs={brandSlugs} productsCount={products?.length ?? 0 } />
        {/* PRODUCTS */}
        <div className={`${totalProduct === 0 ? 'invisible' : ''} text-lg sm:text-xl text-center text-euroestetic`}>Resultados: {totalProduct} {totalProduct > 1 ? 'productos' : 'producto'}</div>


        {products ?
          products.length > 0 ?
            <ProductList
              products={products}
            />
            :
            <SkeletonNoResults />
          :
          <Skeleton />
        }

        {hasMoreData ?
          <div ref={scrollTrigger}>
            <Skeleton />
          </div>
          :
          <div>
          </div>
        }
      </div>
    </>
  );
};

export default ListPage;
