import { getPayload, Where } from "payload"
import configPromise from '@payload-config'

export async function GET() {
    const payload = await getPayload({ config: configPromise })
    const where: Where = {
        and: [
            {
              role: {
                equals: 'pro'
              }
            },
            {
              activated: {
                equals: false
              }
            }
          ]
        }

    const data = await payload.find({
      collection: 'users',
      where,
      depth: 0,
      limit: 0,
    })
   
    return Response.json({ data })
  }