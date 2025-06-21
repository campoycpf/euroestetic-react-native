"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useHomeStore } from "@/store";
import { Home, Media } from "@/payload-types";
import { usePWA } from "@/hooks/usePWA";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import { JWTUser } from "@/app/actions/cart";

const MainSlider = () => {
  const { jwtUser } = useCartStore();
  const currentUser = jwtUser
  const isPwa = usePWA()
  const [current, setCurrent] = useState(0);
  const { home } = useHomeStore();
  const isLoggedIn = !!currentUser && (currentUser as JWTUser).role !== 'admin';

  
  const slider = (home as Home)?.slider || [];
  const hasSlider = slider?.length > 0;
  useEffect(() => {
    const interval = setInterval(() => {
      const next = current >= slider.length - 1 ? 0 : current + 1;
      setCurrent(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [slider, current]);

  if (!hasSlider) {
    return null
  }

  return (

      <div className="h-[calc(100vh-64px)] overflow-hidden">
        <div
          className="w-max h-full flex transition-all ease-in-out duration-1000"
          style={{ transform: `translateX(-${current * 100}vw)` }}
        >
          {slider.map((slide) => (
            <div
              className={`bg-gradient-to-r from-blue-100 to-blue-20 ${isPwa && isLoggedIn ? 'h-[calc(100%-64px)]' : 'h-full'} w-screen   flex flex-col gap-16 xl:flex-row`}
              key={slide.id}
            >
              {/* TEXT CONTAINER */}
              <div className="h-1/2 xl:w-1/2 xl:h-full flex flex-col items-center justify-center gap-8 2xl:gap-12 text-center">
                <h2 className="text-xl lg:text-2xl 2xl:text-4xl max-w-[250px] lg:max-w-[500px] 2xl:max-w-[750px] ">
                  {slide.subtitle}
                </h2>
                <h1 className="text-3xl lg:text-4xl 2xl:text-6xl font-semibold">
                  {slide.title}
                </h1>
                <Link href={'/list'}>
                  <button className="rounded-md bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white py-3 px-4 ">
                    VER LA TIENDA
                  </button>
                </Link>
              </div>
              {/* IMAGE CONTAINER */}
              <div className="h-1/2 xl:w-1/2 xl:h-full relative">
                <Image
                  src={(slide.image as Media)?.filename ? `/media/${(slide.image as Media).filename}` : "/logo-default-image.png"}
                  alt=""
                  fill
                  sizes="100%"
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="absolute m-auto w-full flex bottom-8 justify-center gap-4">
          {slider.map((slide, index) => (
            <div
              className={`w-3 h-3  rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
                current === index ? "scale-150" : ""
              }`}
              key={slide.id}
              onClick={() => setCurrent(index)}
            >
              {current === index && (
                <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default MainSlider;
