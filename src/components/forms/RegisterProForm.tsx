'use client'

import { useState } from 'react'
import { validateEmail, validatePassword } from '../../../utils/validations';

const MAX_FILE_SIZE = 2 * 1024 * 1024; 

const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return 'El archivo es demasiado grande. El tamaño máximo es 2MB.';
  }
  if (!file.type.includes('pdf')) {
    return 'Solo se permiten archivos PDF.';
  }
  return null;
};

export const RegisterProForm = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [success, setSuccess] = useState(false)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        setFile(null);
        e.target.value = ''; // Reset input
      } else {
        setError('');
        setFile(selectedFile);
      }
    }
  };
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
    if (!file) {
      setError('Por favor, sube tu certificado profesional')
      setLoading(false)
      return
    }

    try {
      const certificateFormData = new FormData()
      certificateFormData.append('file', file)
    
      const uploadRes = await fetch('/api/app/upload', {
        method: 'POST',
        body: certificateFormData,
      })

      if (!uploadRes.ok) throw new Error('Error al subir el certificado')
      
      const { id: certificateId } = await uploadRes.json()

      const res = await fetch('/api/app/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: username, // Enviar el nombre de usuario a la API
          email,
          password,
          role: 'pro',
          certificate: certificateId,
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
      <h2 className="text-2xl font-bold text-center">Registro Profesional</h2>

      <div className="flex flex-col gap-1"> {/* Contenedor para label e input */}
        <label className="text-sm text-gray-700">Nombre de Usuario</label>
        <input
          type="text"
          name="username"
          placeholder="Tu nombre de usuario"
          className="ring-2 ring-gray-300 rounded-md p-4 focus:ring-euroestetic focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1"> {/* Contenedor para label e input */}
        <label className="text-sm text-gray-700">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          className="ring-2 ring-gray-300 rounded-md p-4 focus:ring-euroestetic focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1"> {/* Contenedor para label e input */}
        <label className="text-sm text-gray-700">Contraseña</label>
        <input
          type="password"
          name="password"
          placeholder=""
          className="ring-2 ring-gray-300 rounded-md p-4 focus:ring-euroestetic focus:outline-none"
        />
      </div>
      <div className="text-xs text-gray-500 mt-1">
           La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un carácter especial.
      </div>
      <div className="flex flex-col gap-1"> {/* Contenedor para label e input */}
        <label className="text-sm text-gray-700">Confirmar Contraseña</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          className="ring-2 ring-gray-300 rounded-md p-4 focus:ring-euroestetic focus:outline-none"
          required
          minLength={8}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-600">
          Certificado Profesional (PDF)
        </label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            id="certificate"
          />
         <label
            htmlFor="certificate"
            className={`flex items-center gap-3 w-full px-4 py-3 border-2 ${
              error && !file ? 'border-red-300' : 'border-gray-300'
            } border-dashed rounded-md cursor-pointer hover:border-euroestetic transition-colors`}
          >
            <svg
              className="w-8 h-8 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18H17V16H7V18Z"
                fill="currentColor"
              />
              <path
                d="M17 14H7V12H17V14Z"
                fill="currentColor"
              />
              <path
                d="M7 10H11V8H7V10Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 2C4.34315 2 3 3.34315 3 5V19C3 20.6569 4.34315 22 6 22H18C19.6569 22 21 20.6569 21 19V9C21 5.13401 17.866 2 14 2H6ZM6 4H13V9H19V19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V5C5 4.44772 5.44772 4 6 4ZM15 4.10002C16.6113 4.4271 17.9413 5.52906 18.584 7H15V4.10002Z"
                fill="currentColor"
              />
            </svg>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">
                {file ? file.name : 'Selecciona tu certificado PDF'}
              </span>
              <span className="text-xs text-gray-400">
                Tamaño máximo 2MB
              </span>
            </div>
          </label>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}
      {success ?
    <div className="bg-green-50 text-green-500 p-4 rounded-md text-sm text-center">
      Registro exitoso!. Mira tu correo para verificar tu cuenta
    </div>
    :
      <button className="w-full mt-4 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white py-3 px-4 rounded-md hover:opacity-80 transition-colors disabled:opacity-80 disabled:cursor-not-allowed" type="submit" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrarse como Profesional'}
      </button>
    }
      <p className="text-sm text-gray-500 text-center">
        *Tu cuenta será activada después de verificar tu certificado
      </p>
    </form>
  )
}