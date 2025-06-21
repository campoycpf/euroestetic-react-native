"use client";
import Image from "next/image";
import { Dispatch, useState } from "react";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import { useEffect, useRef } from "react";
import EmptyCart from "./EmptyCart";
import Link from "next/link";
import AddCart from "./AddCart";
import { useIvaStore } from "@/store";


interface Props {
  isCartOpen: boolean;
  setIsCartOpen: Dispatch<React.SetStateAction<boolean>>;
}

const CartModal = ({setIsCartOpen, isCartOpen}:Props) => {
  
  const { iva } = useIvaStore();
  const { items, isLoading, removeItem, removeCart } = useCartStore();
  const countItems = items.length;
  const isEmptyCart = countItems === 0;
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsCartOpen]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleCheckoutClick = () => {
    setShowLoginModal(true);
  };
console.log(items)
  return (
    <>
      <div className={`w-full sm:w-[600px] top-0 h-[calc(100vh)] fixed right-0  overflow-auto p-12 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white flex flex-col justify-${isEmptyCart ? 'center' : 'start'} gap-6 z-[1000] transition-transform duration-300 ease-in-out scrollbar-hide ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        ref={modalRef}
      >
        <button
          onClick={() => setIsCartOpen(false)}
          className="absolute top-4 right-4 text-euroestetic hover:text-gray-800 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
     
       <EmptyCart setIsCartOpen={setIsCartOpen} isEmpty={isEmptyCart}/>
      { !isEmptyCart &&
        <>
          {/* LIST */}
          <div className="flex flex-col gap-8">
            {/* ITEM */}
            {items.map((item) => (
              <div className="flex gap-4" key={item.productId}>
                {item.image && (
                  <Image
                  src={(item.image as string) ? `/media/${item.image as string}`: '/logo-default-image.png'}
                  alt={item.image as string || 'product'}
                    width={72}
                    height={96}
                    className="object-cover rounded-md"
                  />
                )}
                <div className="flex flex-col justify-center w-full">
                  <div className="">
                    <div className="flex items-center justify-between gap-8">
                      <Link href={`/${item.slug}`} className="font-semibold text-sm max-w-96">
                        {item.name}
                      </Link>
                      
                      <button
                      className="text-red-500 flex items-center gap-1 hover:text-red-700 transition-colors"
                      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
                      onClick={() => removeItem(item.productId)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    </button>
                    </div>
        
                  </div>
                  <div className="flex justify-between text-sm pt-2">
                    <AddCart
                      productId={item.productId}
                      name={item.name}
                      price={item.price}
                      stockNumber={20} // Aquí deberías pasar el stockNumber real del producto
                      image={item.image}
                      slug={item.slug}
                      currentQuantity={item.quantity}
                    />{item.quantity && item.quantity > 0 && (
                          <div className="text-xs text-gray-500">
                            {item.quantity} x{" "} €{item.price.toFixed(2)}
                          </div>
                        )}
                    
                  </div>
                  <div className=" bg-gray-50 rounded-sm flex items-center justify-end gap-2">
                        €{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="">
            <hr className="mx-8 mt-8 h-8" />
            <div className="flex items-center justify-between font-semibold">
              <span className="">Total cesta</span>
              <span className="text-gray-500 text-sm">
                {iva}% de I.V.A. incluido
              </span>
              <span className="text-2xl">€{totalPrice.toFixed(2)}</span>
            </div>
          
            <hr className="mx-8 mt-8 h-8" />
            <div className="flex justify-between text-sm">
              <button
                className="py-3 px-4 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-lg hover:opacity-90 transition-opacity disabled:cursor-not-allowed disabled:opacity-75"
                disabled={isLoading}
                onClick={handleCheckoutClick}
              >
                Comprar
              </button>
              <button
                className="rounded-md py-3 px-4 bg-white text-eurostatic disabled:cursor-not-allowed border disabled:opacity-75"
                disabled={isLoading}
                onClick={() => removeCart()}
              >
                Vaciar cesta
              </button>
            </div>
          </div>
        </>
      
     } 
    </div>
  


      {/* Modal de Login Mejorado */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[1001] p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-in-out scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Iniciar Sesión</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Cerrar modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-gray-600 mb-6 text-center">
              Para continuar con la compra, por favor, inicia sesión.
            </p>
            
            <div className="flex flex-col items-center gap-4 mb-8">
              <Link
                onClick={() => setShowLoginModal(false)}
                href="/login"
                className="w-full text-center px-6 py-3 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-lg hover:opacity-90 transition-opacity text-lg font-medium"
              >
                Ir a Login
              </Link>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="text-center mb-6">
              <p className="text-gray-600 mb-2">¿Todavía no estás registrado?</p>
              <Link
                onClick={() => setShowLoginModal(false)}
                href="/login?register=user" // Asegúrate que esta ruta sea la correcta para el registro de usuarios normales
                className="w-full block text-center px-6 py-3 bg-gray-100 text-euroestetic font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                Registro
              </Link>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-2">¿Eres Profesional?</p>
              <Link
                onClick={() => setShowLoginModal(false)}
                href="/login?register=pro" // Asegúrate que esta ruta sea la correcta para el registro de profesionales
                className="w-full block text-center px-6 py-3 bg-blue-50 text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition-colors"
              >
                Regístrate como profesional
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default CartModal;
