import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Token required', message: 'Token de verificación requerido' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })

    try {
        const users = await payload.find({
            collection: 'users',
            where: {
                _verificationToken: {
                equals: token
                }
            }
        })

      // Verificar el token usando Payload
      const result = await payload.verifyEmail({
        collection: 'users',
        token
      })

      if (result) {
        // Como result es boolean, necesitamos encontrar al usuario por el token
        // para poder actualizarlo y disparar el hook afterChange
        
        // Buscar el usuario que tiene este token de verificación
        console.log('users in result', users)

        if (users.docs.length > 0) {
          const user = users.docs[0]
          
          // Actualizar manualmente el usuario para disparar el hook afterChange
          await payload.update({
            collection: 'users',
            id: user.id,
            data: {
              _verified: true
            }
          })
        }

        return NextResponse.json(
          { 
            success: true, 
            message: 'Email verificado exitosamente'
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { 
            error: 'Invalid token', 
            message: 'Token de verificación inválido o expirado' 
          },
          { status: 400 }
        )
      }
    } catch (verifyError: any) {
      console.error('Error verifying email:', verifyError)
      
      // Manejar diferentes tipos de errores
      if (verifyError.message?.includes('expired') || verifyError.message?.includes('Token expired')) {
        return NextResponse.json(
          { 
            error: 'Token expired', 
            message: 'El enlace de verificación ha expirado. Solicita uno nuevo.' 
          },
          { status: 400 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Verification failed', 
          message: 'Error al verificar el email. El token puede ser inválido o haber expirado.' 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error in verify endpoint:', error)
    return NextResponse.json(
      { 
        error: 'Server error', 
        message: 'Error interno del servidor. Por favor, inténtalo de nuevo.' 
      },
      { status: 500 }
    )
  }
}