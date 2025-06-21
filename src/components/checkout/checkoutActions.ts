'use server'

import { getPayload } from "payload"
import configPromise from '@payload-config'
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { User } from "@/payload-types"
import { refresh } from '@payloadcms/next/auth'
import config from '@payload-config'
import { refreshAction } from "@/actions/auth"

interface UserShippingForm {
    email: string
    name: string
    address: string
    city: string
    cp: string
    province: string
}

interface BillingForm {
    cif_dni_nie: string
    mailing_name: string
    mailing_address: string
    mailing_city: string
    mailing_cp: string
    mailing_province: string
}

export async function updateUserShippingData(userShippingForm: UserShippingForm) {
    try {
        const payload = await getPayload({ config: configPromise })
        const headersList = await headers()
        const { user } = await payload.auth({
            headers: headersList
        })
        if (!user) {
            redirect('/login')
        }

        // Actualizamos los campos en el objeto user
        user.name = userShippingForm.name
        user.address = userShippingForm.address
        user.city = userShippingForm.city
        user.cp = userShippingForm.cp
        user.province = userShippingForm.province as User['province']
        
        // Actualizamos los campos de facturación solo si están vacíos
        user.mailing_name = user.mailing_name || userShippingForm.name
        user.mailing_address = user.mailing_address || userShippingForm.address
        user.mailing_city = user.mailing_city || userShippingForm.city
        user.mailing_cp = user.mailing_cp || userShippingForm.cp
        user.mailing_province = user.mailing_province || userShippingForm.province as User['province']

        const updatedUser = await payload.update({
            collection: 'users',
            id: user.id,
            data: user
        })
        
        await refreshAction()
        return { success: true, user: updatedUser }
    } catch (error) {
        console.error('Error al actualizar datos de envío:', error)
        return { success: false, error: 'Error al actualizar los datos de envío' }
    }
}

export async function updateUserBillingData(billingForm: BillingForm) {
    try {
        const payload = await getPayload({ config: configPromise })
        const headersList = await headers()
        const { user } = await payload.auth({
            headers: headersList
        })
        if (!user) {
            redirect('/login')
        }

        // Actualizamos los datos de facturación del usuario
        const updatedUser = await payload.update({
            collection: 'users',
            id: user.id,
            data: {
                cif_dni_nie: billingForm.cif_dni_nie,
                mailing_name: billingForm.mailing_name,
                mailing_address: billingForm.mailing_address,
                mailing_city: billingForm.mailing_city,
                mailing_cp: billingForm.mailing_cp,
                mailing_province: billingForm.mailing_province as User['province']
            }
        })
        return { 
            success: true, 
            user: updatedUser,
        }
    } catch (error) {
        console.error('Error al actualizar datos de facturación:', error)
        return { 
            success: false, 
            error: 'Error al actualizar los datos de facturación' 
        }
    }
}
