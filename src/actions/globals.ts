'use server'
import { CompanyInfo, Home } from '@/payload-types'
import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

export async function getCompanyInfo(): Promise<CompanyInfo> {
  const payload = await getPayload({ config: configPromise })
  const CompanyInfo = await payload.findGlobal({
    slug: 'company-info',
  })
  return CompanyInfo
}
export async function getHome(): Promise<Home> {

  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({
    headers: headersList
  })
  const home = await payload.findGlobal({
    slug: 'home',
    depth: 4,
    user,
    overrideAccess: false,
  })
  return home
}
export async function getIva(): Promise<number> {
  const payload = await getPayload({ config: configPromise })
  
  const ivaObject = await payload.findGlobal({
    slug: 'iva',
  })
  return ivaObject.value
}