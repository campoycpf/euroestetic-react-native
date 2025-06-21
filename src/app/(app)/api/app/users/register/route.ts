import { NextResponse } from 'next/server'
import {getPayload} from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  const payload = await getPayload({
    config: configPromise,
  })
  try {
    const { name, email, password, role, certificate } = await req.json()
    const userExists = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })
    if (userExists.totalDocs > 0) {
      return NextResponse.json(
        { message: 'Usuario ya registrado' },
        { status: 400 }
      )
    }

    await payload.create({
      collection: 'users',
      data: {
        name,
        email,
        password,
        role,
        activated: role === 'pro' ? false : true,
        certificate: certificate ?? null
      },
    })

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente' },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error al registrar usuario' },
      { status: 500 }
    )
  }
}