"use client";
import { Media, Product } from "@/payload-types";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, Fragment, useEffect, useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }
  useEffect(()=>{
    handleSearch();
  }, [searchTerm]);

  const handleSearch = async() => {
    if (searchTerm.trim() === '') {
      setProducts([]);
      return;
    }
    try {
      const response = await fetch(`/api/products?where[or][0][title][contains]=${searchTerm}`);
      const data = await response.json();
      setProducts(data.docs);
    } catch (error) {
      console.error('Error buscando productos:', error);
    }
    
  };
  return (
    <>
      <form
        className="hidden sm:max-w-[370px] md:max-w-[none] md:flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1 md:relative"
      >
        <input
          type="text"
          name="name"
          placeholder="Buscar..."
          value={searchTerm}
          className="flex-1 bg-transparent outline-none"
          onChange={handleChange}
        />
        {
          searchTerm !== ''  ?
          <span className="cursor-pointer" onClick={()=>{setProducts([]); setSearchTerm('')}}>x</span>
          :
          <Image src="/search.png" alt="" width={24} height={24} />
        }
      
        {products.length > 0 && 
          (
            <div className="absolute top-[65px] md:top-[53px] left-0 w-full p-4 max-h-[50vh] overflow-auto bg-white rounded-md shadow-md z-50">
              <div className="flex flex-col gap-8">
                {products.map((item) => (
                  <div className="flex gap-4" key={item.id}>
                    <Image
                    src={(item.image as Media)?.filename ? `/media/${(item.image as Media).filename}`: '/logo-default-image.png'}
                    alt={item.title}
                      width={72}
                      height={96}
                      className="object-cover rounded-md"
                    />
                    
                    <div className="flex flex-col justify-center w-full">
                      <div className="">
                        <div className="flex items-center justify-between gap-8">
                          <Link href={`/${item.slug}`} onClick={()=>{setProducts([]); setSearchTerm('')}} className="font-semibold text-sm max-w-96">
                            {item.title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                          
                ))}
              </div>
            </div>
          
        )}
      </form>
      <div 
        className="md:hidden"
        onClick={()=>{setShowSearch(true)}}
      >
        <Image 
        src="/search.png" alt="buscar" 
        width={24} 
        height={24}
        className="absolute left-[114px] top-[18px] cursor-pointer"
        />
        
        {showSearch &&
                <form
                className="absolute w-full z-50 top-0 h-16 left-0 flex items-center justify-between gap-4 bg-white p-4 rounded-md flex-1 md:relative"
              >
              <input
                type="text"
                name="name"
                placeholder="Buscar..."
                value={searchTerm}
                className="flex-1 bg-transparent outline-none"
                onChange={handleChange}
                autoFocus
              /> 
              <span className="cursor-pointer" onClick={(e)=>{e.stopPropagation();setShowSearch(false);setProducts([]); setSearchTerm('')}}>x</span>
              {products.length > 0 && 
                (
                  <div className="absolute top-[65px] md:top-[53px] left-0 w-full p-4 max-h-[calc(100vh-64px)] overflow-auto bg-white rounded-md shadow-md z-50">
                    <div className="flex flex-col gap-8">
                      {products.map((item) => (
                        <div className="flex gap-4" key={item.id}>
                          <Image
                          src={(item.image as Media).filename ? `/media/${(item.image as Media).filename}`: '/logo-default-image.png'}
                          alt={item.title}
                            width={72}
                            height={96}
                            className="object-cover rounded-md"
                          />
                          
                          <div className="flex flex-col justify-center w-full">
                            <div className="">
                              <div className="flex items-center justify-between gap-8">
                                <Link href={`/${item.slug}`} onClick={(e)=>{e.stopPropagation();setShowSearch(false);setProducts([]); setSearchTerm('')}} className="font-semibold text-sm max-w-96">
                                  {item.title}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                                
                      ))}
                    </div>
                  </div>
                
              )}
              </form>
        }

      </div>
    </>
  );
};

export default SearchBar;
