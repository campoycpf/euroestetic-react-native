'use client';
import { Product } from "@/payload-types";
import { useState } from "react";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import Image from 'next/image';
import Link from 'next/link';
import AddToCartAnimation from "./AddToCartAnimation";
import { Media, Brand } from "@/payload-types";
import { getPriceProduct } from "utils/consts";

interface Props {
    product: Product
}
const ProductCard = ({ product }: Props) => {
    const [showAnimation, setShowAnimation] = useState(false);
    const { addItem, isLoading } = useCartStore();
    const handleAddToCart = async () => {
      addItem(product.id, product.title, getPriceProduct(product) , 1, product.slug as string, (product.image as Media)?(product.image as Media).filename as string :'logo-default-image.png');
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 2000); // Ocultar después de 2 segundos
    };
    return (
    <div className="w-[48%] max-w-[300px] sm:max-w-md sm:min-w-72 flex flex-col transition-all easy duration-500 min-[1359px]:hover:transform min-[1359px]:hover:scale-105 sm:w-[22%] lg:w-[22%] shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
    <Link href={"/" + product.slug} className="relative w-full h-40 min-[450px]:h-60 sm:h-64 md:h-80">
      <Image
        src={(product.image as Media) ? `/media/${(product.image as Media).filename}`: '/logo-default-image.png'}
        alt={(product.image as Media)?.alt || 'product'}
        fill
        sizes="25vw"
        className="absolute object-cover"
      />
    </Link>
    <div className="p-4 pt-0 text-[clamp(0.75rem,0.624rem+0.403vw,1.125rem)]">
      <Link href={"/" + product.slug}>
        <div className="flex justify-center mt-8 items-start text leading-none min-h-12">
          <span className="font-medium text-center">{product.title}</span>
        </div>
        <div className="flex justify-center items-center text leading-none min-h-6 sm:min-h-12">
          <span className="font-bold text-xl sm:text-2xl">€{getPriceProduct(product).toFixed(2)}</span>
        </div>
      </Link>
      <div className="flex justify-center items-center text leading-none min-h-12">
          {((product.brand as Brand).image as Media) ?
            <div
              className="relative w-full h-12 sm:h-16 cursor-pointer"
            >
              <Link href={`/list?brands=${(product.brand as Brand).slug}`}>
                <Image
                src={((product.brand as Brand).image as Media) ? `/media/${((product.brand as Brand).image as Media).filename}`: '/logo-default-image.png'}
               
                  alt={((product.brand as Brand).image as Media).alt}
                  fill
                  sizes="30vw"
                  className="object-contain sm:object-cover rounded-md sm:max-h-12 sm:max-w-36 mx-auto"
                />
              </Link>

            </div>
            :
            <Link href={`/list?brands=${(product.brand as Brand).slug}`}>{(product.brand as Brand).title}</Link>
          }
        </div>
      <div className={'flex justify-between'}>
        <AddToCartAnimation isVisible={showAnimation} productName={product.title} />
        <button
          className="relative rounded-2xl ring-1 ring-euroestetic text-euroestetic w-max py-1 px-1 sm:py-2 sm:px-4 text-xs hover:bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 hover:text-white"
          onClick={() => handleAddToCart()}
          disabled={isLoading}
          >
          Añadir a la cesta
        </button>
        <div>
        </div>
      </div>
    </div>
    </div>
  );
}
export default ProductCard;