'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/storeCart/cartStoreCookies'
import { getHome } from '@/actions/globals'
import { useHomeStore } from '@/store'

export const LoginForm = () => {

  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const homeStore = useHomeStore()
  const { setJWTUser } = useCartStore()
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const res = await fetch('/api/app/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }
      await setJWTUser()
      const home = await getHome()
     
      homeStore.addHome(home)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-lg w-[100%] sm:w-[630px]">
      <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
      <label className="text-sm text-gray-700">Email</label>
      <input
        type="text"
        name="email"
        placeholder="Email"
        defaultValue={email || ''}
        className="ring-2 ring-gray-300 rounded-md p-4"
        required
      />
      <label className="text-sm text-gray-700">Contraseña</label>
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        className="ring-2 ring-gray-300 rounded-md p-4"
        required
      />
      {error && (
        <div className="bg-red-100 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}
      <button 
        className="w-full mt-4 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white py-3 px-4 rounded-md hover:opacity-80 transition-colors disabled:opacity-80 disabled:cursor-not-allowed" 
        type="submit" 
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}