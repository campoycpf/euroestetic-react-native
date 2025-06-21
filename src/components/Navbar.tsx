'use client'
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import NavIcons from "./NavIcons";
import NavbarShop from '@/components/NavbarShop'
import React, { useEffect, useState } from 'react'
import { Category } from '@/payload-types'
import { useSearchParams } from 'next/navigation'
import { usePWA } from "@/hooks/usePWA";
import Tabs from "./dashboard/Tabs";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import { JWTUser } from "@/app/actions/cart";


const Navbar:React.FC<{ categoriesTree:Category[]}> = ({ categoriesTree}) => {
  const { items, jwtUser } = useCartStore();
  const currentUser = jwtUser
  const isLoggedIn = !!currentUser && (currentUser as JWTUser).role !== 'admin'; // Deriva isLoggedIn del estado de currentUser
  const counter = items.map((item) => item.quantity).reduce((acc, curr) => acc + curr, 0);
  const isPwa = usePWA()
  const [showShopMenu, setShowShopMenu] = useState(false)
  const searchParams = useSearchParams()
  const ShoppLink = ({isMobile}:{isMobile:boolean}) => {
    const wh = isMobile? 42: 64
    return (
      <div className="flex gap-4">
      
      <div className="cursor-pointer text-red flex items-center" // Añadido items-center para alinear verticalmente
      onClick={()=>setShowShopMenu(!showShopMenu)}
      >
        <Image
          src="/shop-icon.svg" // Ruta al nuevo icono
          alt="Tienda"
          width={wh} // Ajusta el tamaño según sea necesario
          height={wh} // Ajusta el tamaño según sea necesario
          className="mr-1" // Margen a la derecha del icono
        />
        <Image
          src="/arrow-euroestetic.svg"
          alt=""
          width={12}
          height={12}
          className={`${showShopMenu ? 'rotate-180' : 'rotate-0'}`}
          style={{transition: 'all .5s'}}
        />
      </div>
      {/*<Link href="/">Deals</Link>*/}
      {/*<Link href="/">About</Link>*/}
      {/*<Link href="/">Contact</Link>*/}
    </div>
    )
  }
  useEffect(() => {
    setShowShopMenu(false)
  }, [searchParams])
  return (
    <>
      <div className="h-16 z-30 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] sticky top-0 bg-white">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image src="/logo.png" alt="" width={24} height={24} />
          </Link>
          <ShoppLink isMobile={true} />
        </div>
        <SearchBar />
        <NavIcons isLoggedIn={isLoggedIn} counter={counter} jwtUser={currentUser} />
      {/*   <Menu /> */}
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full relative">
        {/* LEFT */}
        <div className="w-1/3 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={36} height={36} />
            <div className="text-lg ">Euro Estetic</div>
          </Link>
          <ShoppLink isMobile={false} />
        </div>
        {/* RIGHT */}
        <div className="w-2/3 flex items-center justify-between gap-8">
          <SearchBar />
          <NavIcons isLoggedIn={isLoggedIn} counter={counter} jwtUser={currentUser} />
        </div>
      </div>
      {showShopMenu &&
          <NavbarShop categories={categoriesTree} />
      }
    </div>
    {isPwa && isLoggedIn && <Tabs/>}
    </>
  );
};

export default Navbar;
