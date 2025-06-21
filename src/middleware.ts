import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

interface DecodedToken {
  role: string
  exp: number
}

// Solo verificación básica de formato y expiración
const isValidToken = (token: string) => {
  try {
    if (!token) return false
    const decoded = jwtDecode(token) as DecodedToken
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp > currentTime
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
 
  const { nextUrl, cookies } = req
  const token = cookies.get('payload-token')?.value
  const user = isValidToken(token as string)


  if (token && !user) {
    console.log('Token sin user')
    const response = NextResponse.redirect(new URL('/login', req.url))
    response.cookies.delete('payload-token')

    return response
  }

  // Protected dashboard routes
  if (nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/checkout')) {
    console.log('dashboard router')
    if (!token || !user) {
      console.log('dashboard router sin token, sin user')
      return NextResponse.redirect(
        new URL('/login', req.url)
      )
    }
  }

  // Login/Register routes when already authenticated
  if (['/login'].includes(nextUrl.pathname)) {
    console.log('login pathname')
    if (token && isValidToken(token)) {
      console.log('login pathname con token')
      const decodedToken = jwtDecode(token) as DecodedToken
      if (decodedToken.role === 'user' || decodedToken.role === 'pro') {
        console.log('login pathname con token y user or pro')
        return NextResponse.redirect(
          new URL('/dashboard', req.url)
        )
      } else {
        if(decodedToken.role === 'admin'){
          console.log('login pathname con token y admin')
          return NextResponse.redirect(
            new URL('/admin', req.url)
          )
        }
        console.log('login pathname con token y no user or pro')
        return NextResponse.redirect(
          new URL('/login', req.url)
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ]
}
