import configPromise from '@payload-config'
import { getPayload, Where } from 'payload'
import { NextRequest } from 'next/server'
import {conn} from 'database/postgres'
import { headers } from 'next/headers'

export const POST = async (request: NextRequest) => {
  const body =  await request.json()
  const brandSlugs = body.brandSlugs as string
  const tagSlugs = body.tagSlugs as string
  const page = body.page ? body.page as number : 1
  const categoryIds = body.categoryIds as number[]
  const sortRequest = body.sortSlug as string
  let productTagIds: number[] = []
  if (tagSlugs.length >0) {
    let query = `SELECT id FROM tags WHERE slug = ANY($1) ORDER BY id`
    let rows = []
    try {
      rows = (await conn.query(query, [tagSlugs])).rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
    const tagIds = rows.map(row => {
      return row.id
    })

    query = `SELECT DISTINCT ID FROM products `
    if (tagIds.length > 0) {
      query += `WHERE id IN (
    SELECT parent_id FROM products_rels
    WHERE tags_id = ANY($1)
    ) `
    }
    query += ' ORDER BY id'
    rows = []
    try {
      rows = (tagIds.length === 0 ? await conn.query(query) : await conn.query(query, [tagIds])).rows;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
    productTagIds = rows.map(row => {
      return row.id
    })
  }
  const payload = await getPayload({
    config: configPromise,
  })

  let query = `SELECT DISTINCT ID FROM products `
  if (categoryIds.length > 0) {
    query += `WHERE id IN (
    SELECT parent_id FROM products_rels 
    WHERE categories_id = ANY($1)
    ) `
  }
  query += ' ORDER BY id'

  let rows = []
  try {
    rows = (categoryIds.length === 0 ? await conn.query(query) : await conn.query(query, [categoryIds])).rows;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
  const productCategoryIds = rows.map(row => {
    return row.id
  })

  //TODO: esta query no funciona bien porque no saca los docs reales por categories y tags que son many to many, ver si se puede resolver

  // const where: Where = {
  //
  //   and: [
  //     {
  //       'categories.id': {
  //         in: categoryIds
  //       },
  //       or: [
  //         {
  //           'tags.slug': {
  //             in: tagSlugs
  //           }
  //         },
  //         {
  //           'brand.slug': {
  //             in: brandSlugs
  //           },
  //         }
  //       ]
  //     },
  //   ],
  // }

  const where: Where = {
    and: [
      {
        id: (productCategoryIds.length > 0 ?
                {
                  in: productCategoryIds,
                }
              :
                {
                  in: [0]
                }
            ),
        or: [
          (brandSlugs.length > 0 ?
              {
                'brand.slug': {
                  in: brandSlugs
                }
              }
            :
              {}
          ),
         (productTagIds.length >0 ?
             {
              id: {
                in: productTagIds
              }
             }
           :
             {}
          )
        ]
      },
    ],
  }
  const headersList = await headers()
  const { user } = await payload.auth({
    headers: headersList
  })

  let sort = '-id'
  if (sortRequest?.includes('price')) {
    if (user && user.role === 'pro') {
      if (sortRequest.includes('desc')) {
        sort = '-price_wholesale'
      } else {
        sort = 'price_wholesale'
      }
    } else {
      if (sortRequest.includes('desc')) {
        sort = '-price'
      } else {
        sort = 'price'
      }
    }
  } else if (sortRequest?.includes('lastUpdated')) {
    if (sortRequest.includes('desc')) {
      sort = 'updatedAt'
    } else {
      sort = '-updatedAt'
    }
  }
  const productsResult = await payload.find({
    collection: 'products',
    sort,
    depth:2,
    pagination: true,
    page,
    limit: 8,
    select: {
      description: false,
      slugLock: false,
    },
    where,
    overrideAccess: false,
    user,
  })

  return Response.json(productsResult)
}