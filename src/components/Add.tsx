"use client";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import { Media } from "@/payload-types";
import AddToCartAnimation from "./AddToCartAnimation";
// import { useCartStore } from "@/hooks/useCartStore";
// import { useWixClient } from "@/hooks/useWixClient";
import { useState } from "react";

const Add = ({
  productId,
  name,
  price,
  stockNumber,
  image,
  slug
}: {
  productId: number;
  name: string;
  price: number;
  stockNumber: number;
  image: Media;
  slug: string;
}) => {
  const [quantity, setQuantity] = useState(1);
  const [showAnimation, setShowAnimation] = useState(false);
  const { addItem, isLoading } = useCartStore();
  // // TEMPORARY
  // const stock = 4;



  // const wixClient = useWixClient();
  //
  const handleQuantity = (type: "i" | "d") => {
    if (type === "d" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
    if (type === "i" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleAddToCart = async () => {
    await addItem(productId, name, price, quantity, slug, image?.filename as string || 'logo-default-image.png' )
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000); // Ocultar después de 2 segundos
  };
  return (
    <div className="flex flex-col gap-4">
      <AddToCartAnimation isVisible={showAnimation} productName={name} />
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-euroestetic opacity-80 text-white py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("d")}
              disabled={quantity===1}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity("i")}
              disabled={quantity===stockNumber}
            >
              +
            </button>
          </div>
          {stockNumber < 1 ? (
            <div className="text-xs">Product is out of stock</div>
          ) : (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} items</span>{" "}
              left!
              <br /> {"Don't"} miss it
            </div>
          )}
        </div>
        <button
          onClick={() => handleAddToCart()}
          disabled={isLoading}
          className="w-44 text-sm rounded-3xl ring-1 ring-euroestetic text-euroestetic py-2 px-4 hover:bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-80 disabled:ring-0  disabled:ring-none"
        >
          Añadir a la cesta
        </button>
      </div>
    </div>
  );
};

export default Add;
