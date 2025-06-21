'use client'
import { Dispatch } from "react"
import { PROVINCES } from "utils/consts"
import { Province } from "utils/consts"
import { UserBillingForm as BillingFormType, BillingFormErrors } from './types'

interface BillingFormProps {
    billingForm: BillingFormType;
    setBillingForm: Dispatch<React.SetStateAction<BillingFormType>>;
    billingErrors: BillingFormErrors;
    setBillingErrors: Dispatch<React.SetStateAction<BillingFormErrors>>;
}

export const BillingForm = ({ billingForm, setBillingForm, billingErrors, setBillingErrors }: BillingFormProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setBillingForm(prev => ({
            ...prev,
            [name]: value
        }))
 
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (billingErrors[name as keyof BillingFormErrors]) {
            setBillingErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    return (
        <form className="space-y-4">
            <div>
                <input
                    type="text"
                    name="cif_dni_nie"
                    value={billingForm.cif_dni_nie}
                    onChange={handleChange}
                    placeholder="CIF/DNI/NIE"
                    className={`w-full p-3 border ${billingErrors.cif_dni_nie ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {billingErrors.cif_dni_nie && <p className="text-red-500 text-sm mt-1">{billingErrors.cif_dni_nie}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="mailing_name"
                    value={billingForm.mailing_name}
                    onChange={handleChange}
                    placeholder="Nombre de Facturación"
                    className={`w-full p-3 border ${billingErrors.mailing_name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {billingErrors.mailing_name && <p className="text-red-500 text-sm mt-1">{billingErrors.mailing_name}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="mailing_address"
                    value={billingForm.mailing_address}
                    onChange={handleChange}
                    placeholder="Dirección de Facturación"
                    className={`w-full p-3 border ${billingErrors.mailing_address ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {billingErrors.mailing_address && <p className="text-red-500 text-sm mt-1">{billingErrors.mailing_address}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="mailing_city"
                    value={billingForm.mailing_city}
                    onChange={handleChange}
                    placeholder="Ciudad de Facturación"
                    className={`w-full p-3 border ${billingErrors.mailing_city ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {billingErrors.mailing_city && <p className="text-red-500 text-sm mt-1">{billingErrors.mailing_city}</p>}
            </div>
            <div>
                <input
                    type="text"
                    name="mailing_cp"
                    value={billingForm.mailing_cp}
                    onChange={handleChange}
                    placeholder="Código Postal de Facturación"
                    maxLength={5}
                    className={`w-full p-3 border ${billingErrors.mailing_cp ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                />
                {billingErrors.mailing_cp && <p className="text-red-500 text-sm mt-1">{billingErrors.mailing_cp}</p>}
            </div>
            <div>
                <select
                    name="mailing_province"
                    value={billingForm.mailing_province}
                    onChange={handleChange}
                    className={`w-full p-3 border ${billingErrors.mailing_province ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-euroestetic focus:border-transparent outline-none transition-all`}
                >
                    <option value="">Selecciona una provincia</option>
                    {PROVINCES.map((province: Province) => (
                        <option key={province.value} value={province.value}>
                            {province.label}
                        </option>
                    ))}
                </select>
                {billingErrors.mailing_province && <p className="text-red-500 text-sm mt-1">{billingErrors.mailing_province}</p>}
            </div>
        </form>
    )
}