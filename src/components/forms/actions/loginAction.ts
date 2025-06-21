'use server'

import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'
import { t } from '@payloadcms/translations'

export async function login(prevState: any, formData: FormData) {
  const cookieStore = cookies()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const payload = await getPayload({
    config: configPromise,
  })

  try {
    const { user, token } = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    if (!token) {
      return { error: 'Email o contraseña incorrectos' }
    }
    if (user.role === 'admin') {
      return { error: 'Acceso no permitido' }
    }

    if (user.role === 'pro' && !user.activated){
      return { error: 'Tu cuenta está pendiente de activación' }
    }
    if (!user.activated) {
      return { error: 'Email o contraseña incorrectos' }
    }
      
    (await cookieStore).set({
      name: 'payload-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    redirect('/dashboard')
  } catch (error: any) {
    return { error: 'Email o contraseña incorrectos' }
  }
}