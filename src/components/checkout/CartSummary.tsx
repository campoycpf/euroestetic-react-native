'use client'
import { useCartStore } from "@/storeCart/cartStoreCookies"
import { useIvaStore } from "@/store"
import Image from 'next/image'

export const CartSummary = () => {
    const { items } = useCartStore()
    const { iva } = useIvaStore()
    const baseImponible = items.reduce((acc, item) => 
        acc + (item.quantity * ((item.price || 0) / (1 + (iva/100)))), 0
    )
    
    return (
        <div className="space-y-4">
            {/* Lista de Productos */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.slug} className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                            <Image
                                src={'/media/' + item.image || '/logo-default-image.png'}
                                alt={item.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {(item.quantity * item.price).toFixed(2)}€
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Línea divisoria */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* Desglose del Total */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span>Base Imponible</span>
                    <span>{baseImponible.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>IVA ({iva.toFixed(0)}%)</span>
                    <span>{(baseImponible * iva / 100).toFixed(2)}€</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{(baseImponible * (1 + iva/100)).toFixed(2)}€</span>
                </div>
            </div>
        </div>
    )
}