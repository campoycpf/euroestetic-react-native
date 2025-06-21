import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { CART_COOKIE_NAME } from 'utils/consts'

export async function POST(req: Request) {
  const payload = await getPayload({
    config: configPromise,
  })

  try {
    const { email, password } = await req.json()
    const { user, token } = await payload.login({
      collection: 'users',
      data: { email, password },
    })

    // Prevent admin users from logging in through this endpoint
    if (user.role === 'admin') {
      return NextResponse.json(
        { message: 'Acceso no permitido' },
        { status: 403 }
      )
    }

    // Check if pro user is activated
    if (user.role === 'pro' && !user.activated) {
      return NextResponse.json(
        { message: 'Tu cuenta está pendiente de activación' },
        { status: 403 }
      )
    }
    if (!user.activated) {
        return NextResponse.json(
          { message: 'Acceso no permitido' },
          { status: 403 }
        )
      }

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      message: 'Login exitoso'
    }, { status: 200 })

    // Migrate cart from cookie to database
    const cookieStore = cookies()
    const cartCookie = (await cookieStore).get(CART_COOKIE_NAME)
    
    if (cartCookie) {
      try {
        const cartItems = JSON.parse(cartCookie.value)
        
        // Create cart items in database
        for (const item of cartItems) {
          const existingCart = await payload.find({
            collection: 'carts',
            where: {
              'product': { equals: item.productId },
              'user': { equals: user.id }
            }
          })

          if (existingCart.docs.length > 0) {
            const cartItem = existingCart.docs[0]
            await payload.update({
              collection: 'carts',
              id: cartItem.id,
              data: {
                quantity: cartItem.quantity + item.quantity
              }
            })
          } else {
            await payload.create({
              collection: 'carts',
              data: {
                product: item.productId,
                quantity: item.quantity,
                user: user.id
              }
            })
          }
        }
        
        // Delete cookie after migration
        response.cookies.delete('euro_cart')
      } catch (error) {
        console.error('Error migrating cart:', error)
      }
    }

    //@ts-ignore
    response.cookies.set('payload-token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
    return response
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Email o contraseña incorrectos' },
      { status: 401 }
    )
  }
}