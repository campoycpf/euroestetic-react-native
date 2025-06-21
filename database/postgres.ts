import { Pool } from 'pg'

let conn: Pool
// @ts-ignore
if (!conn) {
  conn = new Pool({
    connectionString: process.env.DATABASE_URI
  })
}
export { conn }
