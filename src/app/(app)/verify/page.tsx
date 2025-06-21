'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface VerificationState {
  status: 'loading' | 'success' | 'error' | 'expired'
  message: string
}

export default function VerifyPage() {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    status: 'loading',
    message: 'Verificando tu cuenta...'
  })
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const email = searchParams.get('email')
  const role = searchParams.get('role')

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setVerificationState({
          status: 'error',
          message: 'Token de verificación no encontrado'
        })
        return
      }

      try {
        const response = await fetch('/api/users/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token })
        })

        const data = await response.json()
        if (response.ok) {
          setVerificationState({
            status: 'success',
            message: '¡Tu cuenta ha sido verificada exitosamente!'
          })
          if(!role || role !== 'pro'){
              // Redirigir al login después de 3 segundos
            setTimeout(() => {
              router.push('/login?email=' + email)
            }, 3000)
          }
        
        } else {
          setVerificationState({
            status: data.error === 'Token expired' ? 'expired' : 'error',
            message: data.message || 'Error al verificar la cuenta'
          })
        }
      } catch (error) {
        setVerificationState({
          status: 'error',
          message: 'Error de conexión. Por favor, inténtalo de nuevo.'
        })
      }
    }

    verifyEmail()
  }, [token, router])

  const getIcon = () => {
    switch (verificationState.status) {
      case 'loading':
        return (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        )
      case 'success':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        )
      case 'expired':
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
            <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
        )
      case 'error':
      default:
        return (
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        )
    }
  }

  const getStatusColor = () => {
    switch (verificationState.status) {
      case 'success':
        return 'text-green-800'
      case 'expired':
        return 'text-yellow-800'
      case 'error':
        return 'text-red-800'
      default:
        return 'text-gray-800'
    }
  }

  const getBackgroundColor = () => {
    switch (verificationState.status) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'expired':
        return 'bg-yellow-50 border-yellow-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="h-12 w-auto"
            src="/logo.png"
            alt="Euro Estetic"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Verificación de Email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 min-h-[400px] shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            {getIcon()}
            
            <div className={`mt-6 p-4 rounded-md border ${getBackgroundColor()}`}>
              <h3 className={`text-lg font-medium ${getStatusColor()}`}>
                {verificationState.status === 'loading' && 'Verificando...'}
                {verificationState.status === 'success' && '¡Verificación Exitosa!'}
                {verificationState.status === 'expired' && 'Token Expirado'}
                {verificationState.status === 'error' && 'Error de Verificación'}
              </h3>
              <p className={`mt-2 text-sm ${getStatusColor()}`}>
                {verificationState.message}
              </p>
            </div>

            {verificationState.status === 'success' &&  (
              <>
              {role && role === 'pro' ?
                <div className="mt-6 text-sm">
                  Su cuenta está pendiente de aprobación por parte del administrador.
                  Una vez aprobada, recibirás un correo electrónico con tu cuenta.
                </div>
                :
                <div className="mt-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Serás redirigido automáticamente al login en unos segundos...
                  </p>
                  <Link
                    href={`/login?email=${email}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-euroestetic"
                  >
                    Ir al Login
                  </Link>
                </div>
              }
              </>
            )}

            {verificationState.status === 'expired' && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 mb-4">
                  Tu enlace de verificación ha expirado. Solicita uno nuevo.
                </p>
              </div>
            )}

            {verificationState.status === 'error' && (
              <div className="mt-6">
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Intentar de Nuevo
                  </button>
                </div>
              </div>
            )}

            {/* <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                ¿Necesitas ayuda?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-500">
                  Contacta con soporte
                </a>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}