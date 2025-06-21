'use client'
import { formatCurrency } from 'utils/consts'
import Image from 'next/image'
import { useIvaStore } from '@/store'
import { useCartStore } from '@/storeCart/cartStoreCookies'
import AddCart from '@/components/AddCart'
import Link from 'next/link'

export const dynamic = "force-dynamic";
export default function CartPage() {
  const { items, removeItem, removeCart } = useCartStore()
  const { iva } = useIvaStore()

  if (!items || !items.length) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Tu carrito está vacío</h2>
        <Link
            href="/list"
            className="bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white px-6 py-2 rounded-full hover:border transition-colors"
          >
            Continuar comprando
        </Link>
      </div>
    )
  }

  const baseImponible = items.reduce((acc, item) => 
    acc + (item.quantity * ((item.price || 0) / (1 + (iva/100)))), 0
  )

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tu Carrito</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex gap-4">
                <div className="w-24 h-24 relative flex-shrink-0">
                  <Image
                    src={'/media/' + item.image || '/logo-default-image.png'}
                    alt={item.name}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>
                <Link href={`/${item.slug}`} className="flex-grow hover:text-euroestetic">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-500 mt-1">{formatCurrency(item.price || 0)}/ud</p>
                </Link>
              </div>
              
              <div className="mt-4 flex items-center justify-between gap-4 sm:justify-end">
                <AddCart
                  productId={item.productId}
                  name={item.name}
                  price={item.price}
                  stockNumber={20}
                  image={item.image}
                  slug={item.slug}
                  currentQuantity={item.quantity}
                />
                <div className="font-medium">
                  {formatCurrency(item.quantity * (item.price || 0))}
                </div>
                <button
                  className="text-red-500 flex items-center justify-center hover:text-red-700 transition-colors w-8 h-8"
                  onClick={() => removeItem(item.productId)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <div className="flex flex-wrap  items-center justify-center gap-x-2 md:justify-between md:mx-auto">
            <button
                className="w-60 md:w-[calc(50%-10px)] mt-6 block text-center bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                onClick={() =>{ 
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  removeCart()
                }}
            >
                Vaciar Carrito
            </button>
            <Link
                href="/list"
                className="w-60 md:w-[calc(50%-10px)] mt-6 block text-center bg-gradient-to-l from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
              >
                Continuar comprando
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Resumen del pedido</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Base Imponible</span>
              <span>{formatCurrency(baseImponible)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>IVA ({iva.toFixed(0)}%)</span>
              <span>{formatCurrency(baseImponible * iva / 100)}</span>
            </div>
            <div className="h-px bg-gray-200 my-4"></div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(baseImponible * (1 + iva/100))}</span>
            </div>
            <Link
              href="/checkout"
              className="w-full mt-6 block text-center bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
            >
              Realizar Pedido
            </Link>
            
          </div>
        </div>
      </div>
    </div>
  )
}