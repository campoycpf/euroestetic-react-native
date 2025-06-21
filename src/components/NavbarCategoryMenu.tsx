'use client'
import React, { useEffect, useState } from 'react' // Asegúrate de importar useState y useEffect
import { Category } from '@/payload-types'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'


const NavbarCategoryMenu: React.FC<{ categories: Category[]; level?: number }> = ({ categories, level = 0 }) => {
  const searchParams = useSearchParams()
  const categoryActive = searchParams.get('category')
  const [isMounted, setIsMounted] = useState(false); // Estado para controlar la animación de aparición

  useEffect(() => {
    if (level === 0) {
      // Establece isMounted en true después de un breve retraso para activar la transición al aparecer
      const timerId = setTimeout(() => {
        setIsMounted(true);
      }, 10); // Un pequeño retraso es suficiente
      return () => clearTimeout(timerId);
    }
  }, [level]); // El efecto se ejecuta cuando el componente se monta o si 'level' cambia

  let dynamicContainerClasses = '';

  if (level === 0) {
    const baseClasses = 'max-h-[calc(100vh-64px)] overflow-auto scroll-smooth focus:scroll-auto absolute w-full rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-30 bg-white left-0 pt-1.5 pb-8 px-8';
    const transitionProperties = 'transition-all duration-300 ease-out'; // Duración y tipo de transición
    const initialStateClasses = 'opacity-0 -translate-y-4'; // Estado inicial: transparente y ligeramente desplazado hacia arriba
    const finalStateClasses = 'opacity-100 translate-y-0'; // Estado final: completamente visible y en su posición

    dynamicContainerClasses = `${baseClasses} ${transitionProperties} ${isMounted ? finalStateClasses : initialStateClasses}`;
  } else {
    dynamicContainerClasses = 'm-2'; // Clases para submenús (sin animación aquí)
  }

  return (
    <div className={dynamicContainerClasses}>
      <ul style={level === 0 ? { display: 'flex', flexWrap: 'wrap', listStyleType: "none", justifyContent: 'space-around', width: '100%', gap: '25px' }:{ paddingLeft: level * 20, listStyleType: "none" }}>
        {categories && categories.map((category) => (
          <li key={category.id}>
            <div style={{
              fontWeight: level === 0 ? 'bold' : 'normal',
              textAlign: level === 0 ? 'center' : 'left',
              textTransform: level === 0 ? 'uppercase' : 'inherit',
              fontSize: level === 0 ? '20px' : 'inherit',
              borderBlock: level === 0? '2px solid #e0e0e0' : 'none',
            }}
              className={`${categoryActive === category.slug ? 'bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-xl' : ''} px-4 py-1`}
            >
              <Link href={`/list?category=${category.slug}`} style={level === 1 ? { fontWeight: 'bolder', padding: '4px 0', display: 'inline-block' } : {}}>
                {category.title}
              </Link>
            </div>
            {category.subcategories && category.subcategories.length > 0 && (
              <NavbarCategoryMenu categories={category.subcategories as Category[]} level={level + 1} />
            )}
          </li>
        ))}
      </ul>
    </div>
  )
    ;
};
export default NavbarCategoryMenu
