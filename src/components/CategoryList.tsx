'use client'
import Image from "next/image";
import Link from "next/link";
import { Category, Media } from '@/payload-types'
import { Swiper, SwiperSlide } from 'swiper/react';
import {Autoplay, Navigation} from "swiper/modules";
import 'swiper/css/autoplay'
import 'swiper/css'
import 'swiper/css/navigation';
import useMediaQuery from '@/media-query'
import { useHomeStore } from "@/store";



const CategoryList = () => {
  const {home} = useHomeStore()
  const categories = home?.categories as Category[] || []

  const isPortatil = useMediaQuery(1300, typeof window !== "undefined" ? window : null)
  const isTablet = useMediaQuery(700, typeof window !== "undefined" ? window : null)
  const isMobile = useMediaQuery(550, typeof window !== "undefined" ? window : null)
  if (categories.length === 0) {
    return null
  }
  let slideItems =4
  if(isPortatil) {
    slideItems = 3
  }
  if(isTablet) {
    slideItems = 2
  }
  if (isMobile) {
    slideItems = 1
  }
  if (slideItems > categories.length) {
    slideItems = categories.length
  }
  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        <Swiper
          navigation={true}
          modules={[Autoplay, Navigation]}
          spaceBetween={8}
          autoplay={true}
          slidesPerView={slideItems}
          onSwiper={(swiper) => console.log(swiper)}
        >
        {categories.map((item) => (
          <SwiperSlide key={item.id}>
          <Link
            href={`/list?category=${item.slug}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 p-8 text-euroestetic transition-all"

          >
            <div className="relative bg-slate-100 w-full h-96 overflow-hidden">
              <Image
                src={(item.image as Media) ? `/media/${(item?.image as Media)?.filename}`: '/logo-default-image.png'}
                alt={(item.image as Media)?.alt || 'category'}
                fill
                sizes="20vw"
                className="object-cover brightness-100 hover:brightness-75 transition-all hover:transform hover:scale-110"
              />
            </div>
            <h4 className="mt-8 font-light text-xl absolute px-4 py-1.5 bg-black text-white bg-opacity-30 rounded-3xl top-2 left-8">
              {item.title}
            </h4>
          </Link>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
    </div>
  );
};

export default CategoryList;
