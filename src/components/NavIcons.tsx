"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartModal from "./CartModal";
import { JWTUser } from "@/app/actions/cart";

interface NavIconsProps {
  jwtUser: JWTUser | null;
  isLoggedIn: boolean;
  counter: number;
}
const NavIcons = ({jwtUser, isLoggedIn, counter}: NavIconsProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const currentUser = jwtUser;
  const router = useRouter();
  const handleProfile = () => {
    if (isLoggedIn) {
      router.push("/dashboard"); // Si está logueado, va al dashboard
    } else {
      router.push("/login");
    }
  };

  const getInitials = (name: string | undefined): string => {
    if (!name || name.trim() === "") return "?";
    const words = name.split(' ').filter(Boolean); // Divide por espacios y elimina vacíos
    if (words.length === 0) return "?";
    if (words.length === 1) {
      // Si es una sola palabra, toma las primeras 1 o 2 letras
      return words[0].substring(0, Math.min(2, words[0].length)).toUpperCase();
    }
    // Si son múltiples palabras, toma la primera letra de la primera y la segunda palabra
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2 xl:gap-6 relative">
      {isLoggedIn && currentUser && ((currentUser as JWTUser)?.name) ? (
        <div className="flex justify-center items-center gap-1 cursor-pointer"
          onClick={handleProfile}
        >
          <div
          className="w-8 h-8 rounded-full bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white flex items-center justify-center text-xs font-semibold cursor-pointer"
          
          title={(currentUser as JWTUser).name} // Muestra el nombre completo en el hover
          >
           {getInitials((currentUser as JWTUser).name)}
          </div>
          <div className="flex-col hidden xl:flex"> {/* Contenedor para los párrafos para aplicar max-width si es necesario */}
            <p className="text-[12px] font-semibold text-gray-500 max-w-[100px] xs:max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={(currentUser as JWTUser).name}>
              {(currentUser as JWTUser).name}
            </p>
            <p className="text-[8px] font-semibold text-gray-500 max-w-[100px] xs:max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap" title={(currentUser as JWTUser).email}>
              {(currentUser as JWTUser).email}
            </p>
          </div>
        </div>
        
      ) : (
        <Image
          src="/profile.png"
          alt="Perfil de usuario"
          width={32}
          height={32}
          className="cursor-pointer"
          onClick={handleProfile}
        />
      )}
      <div
        className="relative cursor-pointer"
        onClick={() => {
          if (isLoggedIn) {
            setIsCartOpen(false); // Cierra el modal si estuviera abierto
            router.push("/dashboard/cart"); // Va a la página del carrito en el dashboard
            return;
          }
          setIsCartOpen((prev) => !prev); // Si no está logueado, abre/cierra el modal del carrito
        }}
      >
        <Image src="/cart.png" alt="Carrito de compras" width={32} height={32} />
        {counter > 0 && ( // Solo muestra el contador si hay items
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 rounded-full text-white text-xs flex items-center justify-center">
            {counter}
          </div>
        )}
      </div>
      <CartModal isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </div>
  );
};

export default NavIcons;
