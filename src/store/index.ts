import { create } from 'zustand';
import { Brand, Category, Home, Tag } from '@/payload-types'

interface CategoryStore {
  categories: Category[];
  addCategories: (categories: Category[]) => void;
}
interface CategoryStoreTree {
  categoriesTree: Category[];
  addCategoriesTree: (categories: Category[]) => void;
}
interface BrandStore {
  brands: Brand[];
  addBrands: (brands: Brand[]) => void;
}
interface TagStore {
  tags: Tag[];
  addTags: (tags: Tag[]) => void;
}
interface IvaStore {
  iva: number;
  setIva: (iva: number) => void;
}
interface HomeStore {
  home: Home | null;
  addHome: (home: Home) => void;
}
export const useHomeStore = create<HomeStore>((set) => ({
  home: null,
  addHome: (home) => set(() => ({
    home: home
  })),
}));
export const useCategoriesTreeStore = create<CategoryStoreTree>((set) => ({
  categoriesTree: [],
  addCategoriesTree: (categories) => set(() => ({
    categoriesTree: [...categories]
  })),
}));
export const useCategoriesStore = create<CategoryStore>((set) => ({
  categories: [],
  addCategories: (categories) => set(() => ({
    categories: [...categories]
  })),
}));
export const useBrandsStore = create<BrandStore>((set) => ({
  brands: [],
  addBrands: (brands) => set(() => ({
    brands: [...brands]
  })),
}));
export const useTagsStore = create<TagStore>((set) => ({
  tags: [],
  addTags: (tags) => set(() => ({
    tags: [...tags]
  })),
}));
export const useIvaStore = create<IvaStore>((set) => ({
  iva: 0,
  setIva: (iva) => set(() => ({
    iva
  })),
}));