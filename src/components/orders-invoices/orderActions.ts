'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Order, User, Product, Media } from '@/payload-types' 
import { getUserAuth } from '@/actions/auth' 

export interface GetUserOrdersResult {
  success: boolean
  orders?: Order[]
  totalPages?: number
  currentPage?: number
  hasNextPage?: boolean
  hasPrevPage?: boolean
  error?: string
  filenames?: FilenameProduct[]
}

const ORDERS_PER_PAGE = 10;

export async function getUserOrders(
  page: number = 1 // Parámetro de página, por defecto 1
): Promise<GetUserOrdersResult> {
  try {
    const payload = await getPayload({ config: configPromise })
    const user: User | null = await getUserAuth()

    if (!user) {
      return { success: false, error: 'Usuario no autenticado.' }
    }

    const ordersData = await payload.find({
      collection: 'orders',
      where: {
        user_id: {
          // Asume que 'orderedBy' es el campo en tu colección 'orders'
          // que almacena el ID del usuario que realizó el pedido.
          // Si el campo es diferente (ej. 'user', 'customer'), ajústalo.
          equals: user.id,
        },
      },
      sort: '-createdAt', // Ordena por fecha de creación en orden descendente
      depth: 2, // Ajusta la profundidad según los datos relacionados que necesites
      limit: ORDERS_PER_PAGE,
      page: page, // Pasa el número de página actual
    })

    if (!ordersData.docs) { // ordersData.docs puede ser un array vacío, lo cual es válido
      return { 
        success: true, 
        orders: [],
        totalPages: 0,
        currentPage: page,
        hasNextPage: false,
        hasPrevPage: false,
      }
    }
    const orders: Order[] = ordersData.docs as Order[]
    // Corregido para obtener un array plano de product_id
    const productIds: string[] = orders
      .flatMap(order => order.order_items.map(item => item.product_id ?? ""))
      .filter(id => id !== ""); // Filtra las cadenas vacías resultantes de product_id nulos/undefined
    const filenames = await getProductImageFilenames(productIds);
    return { 
      success: true, 
      orders: ordersData.docs as Order[],
      totalPages: ordersData.totalPages,
      currentPage: ordersData.page,
      hasNextPage: ordersData.hasNextPage,
      hasPrevPage: ordersData.hasPrevPage,
      filenames: filenames,

    }
  } catch (error: any) {
    console.error('Error al obtener los pedidos del usuario:', error)
    return {
      success: false,
      error: error.message || 'Ocurrió un error inesperado al obtener los pedidos.',
    }
  }
}
export interface FilenameProduct{
  productId: string;
  filename: string | null;
}

export async function getProductImageFilenames(productIds: string[]): Promise<FilenameProduct[]> {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  const payload = await getPayload({ config: configPromise });

  try {
    const productsData = await payload.find({
      collection: 'products',
      where: {
        id: {
          in: productIds,
        },
      },
      depth: 1, // Suficiente para la imagen principal si está directamente relacionada
      limit: productIds.length, // Aseguramos obtener todos los productos solicitados si existen
      select: {
        id: true, // Necesitamos el ID para mapear de vuelta
        image: true, // Solo seleccionamos la imagen principal
      },
    });

    // Crear un mapa para facilitar la búsqueda de productos por ID
    const productsMap = new Map<string, Product>();
    if (productsData.docs) {
      productsData.docs.forEach(doc => productsMap.set(doc.id.toFixed(0), doc as Product));
    }

    const results = productIds.map(productId => {
      const product = productsMap.get(productId);

      if (!product) {
        console.warn(`Producto con ID ${productId} no encontrado en la respuesta de la BD.`);
        return { productId, filename: null };
      }

      if (product.image && typeof product.image === 'object' && 'filename' in product.image) {
        const mainImage = product.image as Media;
        if (mainImage.filename) {
          return { productId, filename: mainImage.filename };
        }
      }
      
      console.warn(`Imagen principal no encontrada o sin filename para el producto con ID ${productId}.`);
      return { productId, filename: null };
    });

    return results;

  } catch (error) {
    console.error(`Error al obtener los nombres de archivo de las imágenes para los productos:`, error);
    // Devolver un array donde todos los filenames son null en caso de error general
    return productIds.map(productId => ({ productId, filename: null }));
  }
}

// Interfaz para el resultado de la obtención del PDF del pedido
export interface OrderResult {
  success: boolean;
  error?: string;
  order?: Order; // Nombre sugerido para el archivo PDF
}

/**
 * Obtiene la factura de un pedido específico en formato PDF (Blob).
 * @param orderId El ID del pedido para el cual generar la factura.
 * @returns Un objeto OrderResult con el Order o un error.
 */
export async function getOrderById(orderId: string): Promise<OrderResult> {
  try {
    const payload = await getPayload({ config: configPromise });
    const user: User | null = await getUserAuth();

    if (!user) {
      return { success: false, error: 'Usuario no autenticado.' };
    }

    // 1. Obtener los detalles del pedido
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
      depth: 2, // Ajusta la profundidad según los datos que necesites para la factura
    });

    if (!order) {
      return { success: false, error: 'Pedido no encontrado.' };
    }
    return {
        success: true,
        order
    }

  } catch (error: any) {
    console.error('Error al generar el PDF de la factura:', error);
    return {
      success: false,
      error: error.message || 'Ocurrió un error inesperado al generar la factura.',
    };
  }
}