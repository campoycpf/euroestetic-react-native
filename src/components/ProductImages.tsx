"use client";
import Image from "next/image";
import { useState } from "react";
import { Media } from '@/payload-types'

const ProductImages = ({ items }: { items: Media[] }) => {
  const [index, setIndex] = useState(0);
  return (
    <div className="">
      {items && items.length >0 &&
      <>
        <div className="h-[450px] sm:h-[500px] relative">
          <Image
            src={items[index]? '/media/' + items[index].filename : '/logo-default-image.png'}
            alt={items[index]?.alt as string || 'image'}
            fill
            sizes="50vw"
            className="object-contain rounded-md"
          />
        </div>
        {items.length>1 &&
         <div className="flex justify-center gap-4 mt-0 sm:mt-8">
          {items.map((item:Media, i:number) => (
            <div
              className="w-1/4 h-32 relative gap-4 mt-4 cursor-pointer"
              key={`image_${i}`}
              onClick={() => setIndex(i)}
            >
              
              <Image
                src={item ? '/media/' + item.filename as string : '/logo-default-image.png'}
                alt={item?.alt as string || 'image'}
                fill
                sizes="30vw"
                className={`object-contain rounded-md hover:drop-shadow-[1px_2px_3px_rgba(0,0,0,0.5)] ${index === i ? 'drop-shadow-[1px_2px_3px_rgba(0,0,0,0.5)]' : ''}`}
              />
            </div>
          ))}
        </div>
        }
      </>
      }
    </div>
  );
};

export default ProductImages;
