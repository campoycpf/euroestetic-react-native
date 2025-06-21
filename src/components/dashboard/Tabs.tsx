'use client'
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { homeTabs } from "utils/tabs"
import { useCartStore } from "@/storeCart/cartStoreCookies"
import { logout } from "@/actions/auth"
import { getHome } from "@/actions/globals"
import { useHomeStore } from "@/store"
import { useEffect } from "react"
import { LogoutIcon } from "../icons/LogoutIcon"

const Tabs = () => {
    const router = useRouter()
    const cartStore = useCartStore()
    const homeStore = useHomeStore()
    const totalItems = cartStore.items.reduce((total, item) => total + item.quantity, 0)

    const pathname = usePathname()
    useEffect(() => {
        const fetchCart = async () => {
         await cartStore.fetchCart()
        } 
        fetchCart()
       }, [])
       const handleLogout = async () => {
        await logout()
        const home = await getHome()
        homeStore.addHome(home)
        router.push('/')
        router.refresh()
        await cartStore.removeCartLogout()
      }
    return(
    <div className="flex justify-center border-t-[1px] xl:border-0 bg-white z-[10000] xl:z-0 w-full xl:w-auto mx-auto left-0 items-center bottom-0 xl:top-0 fixed xl:relative">
          <div className="flex">
            {homeTabs.map((tab) => {
              const isActive = pathname === tab.path
              return (
                <Link
                  key={tab.path}
                  href={tab.path}
                  className={`
                    flex items-center sm:space-x-2 px-4 sm:px-6 py-4 text-lg font-medium border-b-2 relative
                    ${isActive 
                      ? 'border-euroestetic text-euroestetic' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <span className="text-2xl relative">
                    <Image src={tab.icon} alt="" width={40} height={40} className="max-sm:min-w-6" />
                    {tab.path === '/dashboard/cart' && totalItems > 0 && (
                      <span className="absolute -top-2 -right-2 bg-euroestetic text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {totalItems}
                      </span>
                    )}
                  </span>
                  <span className="hidden xl:block">{tab.label}</span>
                </Link>
              )
            })}
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center sm:space-x-2 px-4 sm:px-6 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-900"
          >
            <span>
              <LogoutIcon />
            </span>
          </button>
        </div>
    )
}
export default Tabs