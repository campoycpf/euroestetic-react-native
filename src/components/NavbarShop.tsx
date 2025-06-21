import React from 'react';
import { Category } from '@/payload-types'
import NavbarCategoryMenu from '@/components/NavbarCategoryMenu'

const NavbarShop: React.FC<{ categories: Category[]; level?: number }> = ({ categories}) => {
  return <NavbarCategoryMenu categories={categories} />
}
export default NavbarShop;
