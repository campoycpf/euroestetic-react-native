'use client';
import {useRef, useEffect} from "react";
import { useCategoriesStore, useCategoriesTreeStore, useTagsStore, useBrandsStore, useIvaStore, useHomeStore } from '@/store/index'
import { Brand, Category, Home, Tag } from '@/payload-types'
import { useCartStore } from '@/storeCart/cartStoreCookies';

export default function StoreInitializer({categories, categoriesTree, brands, tags, iva, home}:{categories: Category[]; categoriesTree: Category[], brands: Brand[], tags: Tag[], iva: number, home: Home}) {
  const initialized = useRef(false);
  const categoryStore = useCategoriesStore();
  const categoryTreeStore = useCategoriesTreeStore()
  const brandStore = useBrandsStore()
  const tagStore = useTagsStore()
  const ivaStore = useIvaStore()
  const homeStore = useHomeStore()
  const { fetchCart, setJWTUser } = useCartStore();
  useEffect(() => {
    const fetch = async () => { 
      await fetchCart()
      await setJWTUser()
    };
    fetch()
  }, []);
 
  if (!initialized.current) {
    categoryStore.addCategories(categories);
    categoryTreeStore.addCategoriesTree(categoriesTree)
    brandStore.addBrands(brands)
    tagStore.addTags(tags)
    ivaStore.setIva(iva)
    homeStore.addHome(home)
    initialized.current = true;
  }
  return null;
}