'use server'
import { cookies, headers } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { User } from '@/payload-types'
import { refresh } from '@payloadcms/next/auth'

export async function logout() {
  (await cookies()).delete('payload-token')
}
async function getUserPayload() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({
      headers: headersList
  })
  return user
}
export async function isAuthenticated(): Promise<boolean> {
  const user = await getUserPayload()
  if (!user) {
      return false
  }
  return true
}
export async function getUserAuth(): Promise<User | null> {
  const user = await getUserPayload()
  if (!user) {
      return null
  }
  return user
}
//todo: revisar ya que no actualiza token
export async function refreshAction() {
  try {
    const resolvedConfig = await configPromise; // Asegúrate de que la configuración esté resuelta
    const refreshResponse = await refresh({
      collection: 'users', // slug de tu colección
      config: resolvedConfig, // Pasar la configuración resuelta
    });
    console.log('Respuesta de refreshAction:', refreshResponse); // Log para ver la respuesta
    return refreshResponse;
  } catch (error) {
    console.error('Error en refreshAction:', error); // Log del error detallado
    throw new Error(
      `Falló el refresh del token: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}