import Link from "next/link";
import { Dispatch } from "react";

interface Props {
    setIsCartOpen: Dispatch<React.SetStateAction<boolean>>;
    isEmpty?: boolean;
}

const EmptyCart = ({setIsCartOpen, isEmpty = true}: Props) => {
  return (
    <div className={`flex flex-col items-center gap-6 py-0 px-4`}>
      <div className="text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`${!isEmpty ? 'h-20 w-20' : 'h-[clamp(4rem,3.125rem+4vw,8rem)] w-[clamp(4rem,3.125rem+4vw,8rem)]'} `}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      {isEmpty && 
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Tu cesta está vacía</h3>
          <p className="text-gray-500 text-sm mb-6">
            Todavía no has añadido ningún producto a tu cesta.
          </p>
          <Link
            href="/list"
            className="bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white px-6 py-2 rounded-full hover:border transition-colors"
            onClick={() => setIsCartOpen(false)}
          >
            Continua comprando
          </Link>
        </div>
     }
    </div>
  );
};

export default EmptyCart;