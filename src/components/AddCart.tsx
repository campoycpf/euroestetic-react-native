"use client";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import AddToCartAnimation from "./AddToCartAnimation";
import { useState } from "react";

const AddCart = ({
  productId,
  name,
  price,
  stockNumber,
  image,
  slug,
  currentQuantity
}: {
  productId: number;
  name: string;
  price: number;
  stockNumber: number;
  image: string;
  slug: string;
  currentQuantity: number;
}) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const { addItem, isLoading } = useCartStore();

  const handleQuantity = async (type: "i" | "d") => {
    if (type === "d" && currentQuantity > 1) {
        await addItem(productId, name, price, -1, slug, image)
    }
    if (type === "i" && currentQuantity < stockNumber) {
        await addItem(productId, name, price, 1, slug, image)
    }
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <AddToCartAnimation isVisible={showAnimation} productName={name} />
      <div className="border opacity-80 text-eurostetic py-0 px-4 rounded-3xl flex items-center justify-between w-24 text-sm">
        <button
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-20"
          onClick={() => handleQuantity("d")}
          disabled={currentQuantity === 1}
        >
          -
        </button>
        {currentQuantity}
        <button
          className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-20"
          onClick={() => handleQuantity("i")}
          disabled={currentQuantity === stockNumber}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default AddCart;