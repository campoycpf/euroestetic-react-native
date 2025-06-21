'use server'
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'

export interface JWTUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'pro';
}

export async function getCurrentUser(): Promise<JWTUser | null> {
  const cookieStore = cookies()
  const token = (await cookieStore).get('payload-token')
  if (!token) return null
  try {
    const decoded = jwtDecode(token.value) as JWTUser
    return {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
      name: decoded.name,
    }
  } catch (error) {
    console.error('Error decodificando token:', error)
    return null
  }
}

export async function addToCart(productId: number, quantity: number) {
  const payload = await getPayload({ config: configPromise })
  const user = await getCurrentUser();

  if (!user) throw new Error('Usuario no autenticado');

  const existingCart = await payload.find({
    collection: 'carts',
    where: {
      'product': { equals: productId },
      'user': { equals: user.id }
    },
  });

  if (existingCart.docs.length > 0) {
    const cartItem = existingCart.docs[0];
    return await payload.update({
      collection: 'carts',
      id: cartItem.id,
      data: {
        quantity: cartItem.quantity + quantity
      }
    });
  }

  return await payload.create({
    collection: 'carts',
    data: {
      product: productId,
      quantity,
      user: user.id
    }
  });
}

export async function removeFromCart(productId: number) {
  const payload = await getPayload({ config: configPromise })
  const user = await getCurrentUser();

  if (!user) throw new Error('Usuario no autenticado');

  return await payload.delete({
    collection: 'carts',
    where: {
      'product': { equals: productId },
      'user': { equals: user.id }
    }
  });
}

export async function updateCartQuantity(productId: number, quantity: number) {
  const payload = await getPayload({ config: configPromise })
  const user = await getCurrentUser();

  if (!user) throw new Error('Usuario no autenticado');

  return await payload.update({
    collection: 'carts',
    where: {
      'product': { equals: productId },
      'user': { equals: user.id }
    },
    data: { quantity }
  });
}

export async function getCart() {
  const payload = await getPayload({ config: configPromise })
  const user = await getCurrentUser();

  if (!user) return null;

  return await payload.find({
    collection: 'carts',
    where: {
      'user': { equals: user.id }
    },
    depth: 2,
    overrideAccess: false,
    user
  });
}

export async function clearCart() {
  const payload = await getPayload({ config: configPromise })
  const user = await getCurrentUser();

  if (!user) throw new Error('Usuario no autenticado');

  // Paso 1: Encontrar todos los IDs de los items del carrito para el usuario
  const cartItemsQuery = await payload.find({
    collection: 'carts',
    where: {
      'user': { equals: user.id }
    },
    pagination: false, // Asegurarse de obtener todos los items
    depth: 0,          // No necesitamos datos relacionados, solo IDs
    select: { 
      user: false,
      product: false,
      quantity: false,
      createdAt: false,
      updatedAt: false,
     } 
  });

  const itemIdsToDelete = cartItemsQuery.docs.map(doc => doc.id);

  // Si no hay items para borrar, retornar.
  // payload.delete con un `where` que no encuentra nada usualmente retorna algo como { docs: [], errors: [] }
  if (itemIdsToDelete.length === 0) {
    return { docs: [], errors: [] }; // Emula una respuesta de borrado exitoso sin items afectados
  }

  // Paso 2: Borrar los items como siempre
  await payload.delete({
    collection: 'carts',
    where: {
      'user': { equals: user.id }
    }, 
    overrideAccess: false,
    user: user, // Pasar el objeto de usuario para la evaluación de acceso
  });
  //todo: esto lo hago porque no borra el primer item del carrito
  return await payload.delete({
    collection: 'carts',
    where: {
      id: { in: itemIdsToDelete[0] } // Usar el operador 'in' con el primer ID
    }, 
    overrideAccess: false,
    user: user, // Pasar el objeto de usuario para la evaluación de acceso
  });
}