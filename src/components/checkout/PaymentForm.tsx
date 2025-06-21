'use client'
import { User } from "@/payload-types"
import { CartSummary } from "./CartSummary";
import Redsys from "./redsys/Redsys";

interface PaymentFormProps {
    user: User
}

export const PaymentForm = ({ user }: PaymentFormProps) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna Izquierda - Datos de Envío y Facturación */}
                <div className="my-3">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Datos de Envío</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">Nombre:</span> {user.name}</p>
                            <p><span className="font-medium">Dirección:</span> {user.address}</p>
                            <p><span className="font-medium">Ciudad:</span> {user.city}</p>
                            <p><span className="font-medium">CP:</span> {user.cp}</p>
                            <p><span className="font-medium">Provincia:</span> {user.province}</p>
                        </div>
                    </div>

                    
                </div>

                {/* Columna Derecha - Resumen del Pedido y Formulario de Pago */}
                <div className="my-3">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Datos de Facturación</h3>
                        <div className="space-y-2">
                            <p><span className="font-medium">CIF/DNI/NIE:</span> {user.cif_dni_nie}</p>
                            <p><span className="font-medium">Nombre:</span> {user.mailing_name}</p>
                            <p><span className="font-medium">Dirección:</span> {user.mailing_address}</p>
                            <p><span className="font-medium">Ciudad:</span> {user.mailing_city}</p>
                            <p><span className="font-medium">CP:</span> {user.mailing_cp}</p>
                            <p><span className="font-medium">Provincia:</span> {user.mailing_province}</p>
                        </div>
                    </div>
                    
                </div>
            </div>
            <div className="grid grid-cols-1 gap-8">
            <div className="my-3">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Resumen del Pedido</h3>
                        <div className="space-y-4">
                            {/* Aquí irá el CartSummary component */}
                            <CartSummary />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}