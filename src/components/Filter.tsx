"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useBrandsStore, useCategoriesTreeStore, useTagsStore } from '@/store'
import SelectCategoryMenu from '@/components/SelectCategoryMenu'
import Image from 'next/image'

interface Props {
  tagSlugs: string[]
  brandSlugs: string[]
  productsCount: number
}

const Filter = ({tagSlugs, brandSlugs, productsCount}: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const currentCategory = searchParams.get('category') ?? ''
  const [showBrandsFilter, setShowBrandsFilter] = useState(false)
  const [showTagsFilter, setShowTagsFilter] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const filterPanelRef = useRef<HTMLDivElement>(null);

  const checkBoxFilterChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if(e.target.checked) {
      if (!params.get(name)) {
        params.set(name, value);
      } else {
        params.set(name, params.get(name) + '-' + value);
      }
    } else {
      let items = params.get(name)?.split("-")
      if (items?.length === 1 && items[0] === value) {
        params.delete(name)
      } else {
        items = items?.filter(item => item !== value)
        if (items) {
          let queryString = ''
          items.forEach((item)=>{
              queryString += item + '-'

          })
          queryString = queryString.substring(0, queryString.length - 1)
          params.set(name, queryString)
        } else {
          params.delete(name)
        }
      }
    }
    // if (value === '' && !params.get(name)) params.delete(name)
    // else {
    //   const items = params.get(name)
    //   params.set(name, items ? items + '_' + value : value)
    // }
    replace(`${pathname}?${params.toString()}`,{ scroll: false });
  };

  const categoryFilterChange = (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (value === '') params.delete(name)
    else params.set(name, value);
    replace(`${pathname}?${params.toString()}`, {scroll: false});
  };
  const brands = useBrandsStore.getState().brands
  const tags = useTagsStore.getState().tags
  const categoriesTree = useCategoriesTreeStore.getState().categoriesTree
  useEffect(() => {
    const isMobileView = window.innerWidth < 768; // md breakpoint
    if (showFilters && isMobileView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Limpieza al desmontar o cuando showFilters cambia
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showFilters]);
  return (
    <>
      <style jsx>{`
      .custom-checkbox {
        appearance: none;
        width: 18px;
        height: 18px;
        border: 2px solid #ddd;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        transition: all 0.2s;
      }

      .custom-checkbox:checked {
        background-color: transparent;
        border-color: #ddd;
      }

      .custom-checkbox:checked::after {
        content: '';
        position: absolute;
        left: 5px;
        top: 2px;
        width: 6px;
        height: 10px;
        border: solid #10B981;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }

      select {
        appearance: none;
        padding-right: 30px !important;
        background-image: url('/arrow.svg');
        background-repeat: no-repeat;
        background-position: right 10px center;
        background-size: 12px;
      }
    `}
    </style>
      <div
        className="md:hidden fixed top-20 right-4 mt-0 z-50 ml-4 p-2 shadow-2xl transition-transform duration-300 ease-in-out scrollbar-hidden rounded-full bg-euroestetic text-white flex items-center justify-center cursor-pointer"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? (
          <span className="text-lg w-5 h-5 text-center flex justify-center items-center font-bold">x</span>
        ) : (
          <Image src="/filter.svg" alt="Abrir filtros" width={20} height={20} />
        )}
      </div>
      <div 
       ref={filterPanelRef}
        className={`
          fixed right-0 top-[64px] md:top-0 h-[calc(100vh-64px)] w-full
          bg-white
          flex
          justify-center
          p-4 pt-[70px] /* Padding: pt para dejar espacio para header (ej. 64px) + margen */
          overflow-y-auto scrollbar-hidden /* Scroll interno si el contenido es largo */
          z-20
          transition-transform duration-300 ease-in-out
          ${showFilters ? 'translate-x-0' : 'translate-x-full'}
          md:relative md:translate-x-0 /* Restablece posicionamiento y transformación */
          md:w-auto md:h-auto /* Restablece dimensiones a automático */
          md:p-0 /* Restablece padding general si el contenido interno lo maneja */
          md:flex md:justify-center /* Layout flex original en desktop */
          md:overflow-visible /* Overflow original en desktop */`}
      >
        <div className="flex flex-col md:flex-row gap-3 min-[850px]:gap-6 justify-start items-start">
          {/* TODO: Filter Categories */}
         
  
          <div className="md:hidden">Resultados: {productsCount} productos</div>
          <select
            name="category"
            value={currentCategory}
            className="py-2 px-4 h-10 rounded-2xl text-xs font-medium bg-euroestetic opacity-80 text-white text-center"
            onChange={categoryFilterChange}
          >
            <option className="text-lg bg-eurostetic text-white border" value="">Todos Los Productos</option>
            <SelectCategoryMenu categories={categoriesTree}/>
          </select>
          <div>
            <div
              className="py-2 px-4 h-10 mb-2 min-w-[200px] md:min-w-32 rounded-2xl text-xs font-medium bg-euroestetic opacity-80 text-white flex justify-between items-center"
              onClick={() => setShowBrandsFilter(!showBrandsFilter)}
            >
              Filtrar por marcas
              <Image
                src="/arrow.svg"
                alt=""
                width={12}
                height={12}
                className={`${showBrandsFilter ? 'rotate-180' : 'rotate-0'} ml-4 hidden md:block`}
                style={{ transition: 'all .5s' }}
              />
            </div>
            <div
              className={`md:absolute p-2 ${showBrandsFilter ? '' : 'md:hidden'} rounded-md min-w-36 max-h-48 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-[999] overflow-y-auto bg-white`}
              onMouseLeave={()=>setShowBrandsFilter(false)}
            >
              {brands.map(brand => (
                <div className="flex mb-1 md:mb-0 items-center" key={brand.slug}>
                  <input 
                    id={brand.slug as string}
                    className="custom-checkbox"
                    type="checkbox"
                    value={brand.slug as string}
                    name="brands"
                    checked={brandSlugs.includes(brand.slug as string)}
                    onChange={checkBoxFilterChange}
                  />
                  <label className="ml-2 text-kynox-gray-800 flex text-xs md:text-sm lg:text-base"
                         htmlFor={brand.slug as string}>
                    {brand.title}
                  </label>
                </div>
              ))}
            </div>

          </div>
          <div>
            <div
              className="py-2 px-4 h-10 mb-2 min-w-[200px] md:min-w-32 rounded-2xl text-xs font-medium bg-euroestetic opacity-80 text-white flex justify-between items-center"
              onClick={() => setShowTagsFilter(!showTagsFilter)}
            >
              Tags
              <Image
                src="/arrow.svg"
                alt=""
                width={12}
                height={12}
                className={`${showTagsFilter ? 'rotate-180' : 'rotate-0'} ml-4 hidden md:block`}
                style={{ transition: 'all .5s' }}
              />

            </div>
            <div
              className={`md:absolute p-2 ${showTagsFilter ? '' : 'md:hidden'} rounded-md min-w-36 max-h-48 shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-[999] overflow-y-auto bg-white`}
              onMouseLeave={()=>setShowTagsFilter(false)}
            >
              {tags.map(tag => (
                <div className="flex mb-1 md:mb-0 items-center" key={tag.slug}>
                  <input 
                    id={tag.slug as string}
                    className="custom-checkbox"
                    type="checkbox"
                    value={tag.slug as string}
                    name="tags"
                    checked={tagSlugs.includes(tag.slug as string)}
                    onChange={checkBoxFilterChange}
                  />
                  <label className="ml-2 text-kynox-gray-800 flex text-xs md:text-sm lg:text-base"
                         htmlFor={tag.slug as string}>
                    {tag.title}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <select
            name="sort"
            id=""
            className="py-2 px-4 h-10 min-w-[200px] md:min-w-32 rounded-2xl text-xs font-medium bg-euroestetic opacity-80 text-white"
            onChange={categoryFilterChange}
          >
            <option className="bg-white text-black" value="">Ordenar por</option>
            <option className="bg-white text-black" value="asc_price">Precio más bajo</option>
            <option className="bg-white text-black" value="desc_price">Precio más alto</option>
            <option className="bg-white text-black" value="asc_lastUpdated">Más nuevo</option>
            <option className="bg-white text-black" value="desc_lastUpdated">Más antiguo</option>
          </select>
          <div className="h-10 md:hidden">&nbsp;</div>
        </div>
      </div>
    </>
  );
};

export default Filter;
