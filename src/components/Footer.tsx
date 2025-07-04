'use client'
import Link from "next/link";
import Image from "next/image";
import { usePWA } from '@/hooks/usePWA';
import { JWTUser } from "@/app/actions/cart";
import { useCartStore } from "@/storeCart/cartStoreCookies";


const Footer = () => {
  const isPWA = usePWA()
  const { jwtUser } = useCartStore();
  const currentUser = jwtUser
  const isLoggedIn = !!currentUser && (currentUser as JWTUser).role !== 'admin';
  return (
    <>
    {!isPWA &&
    <div className={`${isLoggedIn ? 'pb-24 ' : 'pb-8'} pt-8 xl:py-8 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 opacity-90 text-white text-sm mt-24`}>
      <div className="text-center flex justify-center items-center gap-2">

            <Link href="/">
              <Image src="/logo-white.png" alt="logo" width={24} height={24} />
            </Link>
            <p>
                © 2025 Euro Estetic. Todos los derechos reservados.<br/>
                <a href="#">Política de Privacidad</a> | 
                <a href="#">Términos y Condiciones</a> | 
                <a href="#">Contacto</a>
            </p>
        </div>
      {/* TOP */}
{/*       <div className="flex flex-col md:flex-row justify-between gap-24">
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <Link href="/">
            <div className="text-2xl">Euro Estetic</div>
          </Link>
          <p>
            3252 Winding Way, Central Plaza, Willowbrook, CA 90210, United
            States
          </p>
          <span className="font-semibold">hello@lama.dev</span>
          <span className="font-semibold">+1 234 567 890</span>
          <div className="flex gap-6">
            <Image src="/facebook.png" alt="" width={16} height={16} />
            <Image src="/instagram.png" alt="" width={16} height={16} />
            <Image src="/youtube.png" alt="" width={16} height={16} />
            <Image src="/pinterest.png" alt="" width={16} height={16} />
            <Image src="/x.png" alt="" width={16} height={16} />
          </div>
        </div>
        <div className="hidden lg:flex justify-between w-1/2">
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">COMPANY</h1>
            <div className="flex flex-col gap-6">
              <Link href="">About Us</Link>
              <Link href="">Careers</Link>
              <Link href="">Affiliates</Link>
              <Link href="">Blog</Link>
              <Link href="">Contact Us</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">SHOP</h1>
            <div className="flex flex-col gap-6">
              <Link href="">New Arrivals</Link>
              <Link href="">Accessories</Link>
              <Link href="">Men</Link>
              <Link href="">Women</Link>
              <Link href="">All Products</Link>
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <h1 className="font-medium text-lg">HELP</h1>
            <div className="flex flex-col gap-6">
              <Link href="">Customer Service</Link>
              <Link href="">My Account</Link>
              <Link href="">Find a Store</Link>
              <Link href="">Legal & Privacy</Link>
              <Link href="">Gift Card</Link>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/4 flex flex-col gap-8">
          <h1 className="font-medium text-lg">SUBSCRIBE</h1>
          <p>
            Be the first to get the latest news about trends, promotions, and
            much more!
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="Email address"
              className="p-4 w-3/4"
            />
            <button className="w-1/4 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white">JOIN</button>
          </div>
          <span className="font-semibold">Secure Payments</span>
          <div className="flex justify-between">
            <Image src="/discover.png" alt="" width={40} height={20} />
            <Image src="/skrill.png" alt="" width={40} height={20} />
            <Image src="/paypal.png" alt="" width={40} height={20} />
            <Image src="/mastercard.png" alt="" width={40} height={20} />
            <Image src="/visa.png" alt="" width={40} height={20} />
          </div>
        </div>
      </div> */}
      {/* BOTTOM */}
      {/* <div className="flex flex-col md:flex-row items-center justify-between gap-8 mt-16">
        <div className="">© 2025 Euro Estetic</div>
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="">
            <span className="text-gray-500 mr-4">Language</span>
            <span className="font-medium">United States | English</span>
          </div>
          <div className="">
            <span className="text-gray-500 mr-4">Moneda</span>
            <span className="font-medium">€ EUR</span>
          </div>
        </div>
      </div> */}
    </div>
    }
    {isPWA &&
     <div className={`${isLoggedIn ? 'pt-24' : 'pt-8'}`}></div>
    }
</>
  );
};
export default Footer