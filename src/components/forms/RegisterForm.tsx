'use client'
import { useState } from 'react'
import { validateEmail, validatePassword } from '../../../utils/validations';

export const RegisterForm = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string // Obtener el nombre de usuario
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validar nombre de usuario
    if (!username || username.trim() === '') {
      setError('El nombre de usuario es obligatorio');
      setLoading(false);
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      setLoading(false)
      return
    }
    try {
      const res = await fetch('/api/app/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username, // Enviar el nombre de usuario a la API
          email,
          password,
          role: 'user',
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }

      setSuccess(true)
      setLoading(false)
      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (   
  <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white w-[100%] sm:w-[630px]">
  <h2 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h2>
  
  <div className="flex flex-col gap-2">
    <label className="text-sm text-gray-600">Nombre de Usuario</label>
    <input
      type="text"
      name="username"
      placeholder="Tu nombre de usuario"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-euroestetic focus:border-transparent"
    />
  </div>

  <div className="flex flex-col gap-2">
    <label className="text-sm text-gray-600">Email</label>
    <input
      type="text"
      name="email"
      placeholder="Tu correo electrónico"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-euroestetic focus:border-transparent"
    />
  </div>

  <div className="flex flex-col gap-2">
    <label className="text-sm text-gray-600">Contraseña</label>
    <input
      type="password"
      name="password"
      placeholder=""
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-euroestetic focus:border-transparent"
    />
    <div className="text-xs text-gray-500 mt-1">
      La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un carácter especial.
    </div>
  </div>


  <div className="flex flex-col gap-2">
    <label className="text-sm text-gray-600">Confirmar Contraseña</label>
    <input
      type="password"
      name="confirmPassword"
      placeholder="Repite tu contraseña"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-euroestetic focus:border-transparent"
    />
  </div>

  {error && (
    <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm">
      {error}
    </div>
  )}
  {success ?
    <div className="bg-green-50 text-center text-green-500 p-4 rounded-md text-sm">
      Registro exitoso!. Mira tu correo para verificar tu cuenta
    </div>
    :
    <button 
    type="submit" 
    disabled={loading}
    className="w-full mt-4 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white py-3 px-4 rounded-md transition-colors hover:opacity-80 disabled:opacity-80 disabled:cursor-not-allowed"
  >
    {loading ? 'Registrando...' : 'Crear cuenta'}
  </button>
  }

  
</form>
)
}