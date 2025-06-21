'use client'
import { PROVINCES } from "utils/consts"
import { Province } from "utils/consts"
import { ShippingFormErrors, UserShippingForm } from "./types"

interface ShippingFormProps {
    userShippingForm: UserShippingForm;
    setUserShippingForm: React.Dispatch<React.SetStateAction<UserShippingForm>>;
    shippingErrors: ShippingFormErrors;
    setShippingErrors: React.Dispatch<React.SetStateAction<ShippingFormErrors>>;
}

export const ShippingForm = ({ userShippingForm, setUserShippingForm, shippingErrors, setShippingErrors }: ShippingFormProps) => {


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setUserShippingForm(prev => ({
            ...prev,
            [name]: value
        }))

        if (shippingErrors[name as keyof ShippingFormErrors]) {
            setShippingErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    return (
        <form className="space-y-4">
            <input
                type="email"
                name="email"
                value={userShippingForm.email}
                onChange={handleChange}
                placeholder="Email"
                disabled
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
            <div>
                <input
                    type="text"
                    name="name"
                    value={userShippingForm.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    className={`w-full p-3 border ${shippingErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {shippingErrors.name && <p className="text-red-500 text-sm mt-1">{shippingErrors.name}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="address"
                    value={userShippingForm.address}
                    onChange={handleChange}
                    placeholder="Dirección"
                    className={`w-full p-3 border ${shippingErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {shippingErrors.address && <p className="text-red-500 text-sm mt-1">{shippingErrors.address}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="city"
                    value={userShippingForm.city}
                    onChange={handleChange}
                    placeholder="Ciudad"
                    className={`w-full p-3 border ${shippingErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {shippingErrors.city && <p className="text-red-500 text-sm mt-1">{shippingErrors.city}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="cp"
                    value={userShippingForm.cp}
                    onChange={handleChange}
                    placeholder="Código Postal"
                    maxLength={5}
                    className={`w-full p-3 border ${shippingErrors.cp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {shippingErrors.cp && <p className="text-red-500 text-sm mt-1">{shippingErrors.cp}</p>}
            </div>
            <div>
                <select
                    name="province"
                    value={userShippingForm.province}
                    onChange={handleChange}
                    className={`w-full p-3 border ${shippingErrors.province ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                >
                    <option value="">Selecciona una provincia</option>
                    {PROVINCES.map((province: Province) => (
                        <option key={province.value} value={province.value}>
                            {province.label}
                        </option>
                    ))}
                </select>
                {shippingErrors.province && <p className="text-red-500 text-sm mt-1">{shippingErrors.province}</p>}
                </div>
        </form>
    )
}