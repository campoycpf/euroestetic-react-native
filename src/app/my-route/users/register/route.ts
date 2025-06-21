import { NextResponse } from 'next/server'
import {getPayload} from 'payload'
import configPromise from '@payload-config'

export async function POST(req: Request) {
  const payload = await getPayload({
    config: configPromise,
  })
  try {
    const { email, password, role } = await req.json()
    const userExists = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
    })

    return
    if (userExists.totalDocs > 0) {
      return NextResponse.json(
        { message: 'Usuario ya registrado' },
        { status: 400 }
      )
    }

    await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        role,
        activated: true,
      },
    })

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Error registering user' },
      { status: 500 }
    )
  }
}