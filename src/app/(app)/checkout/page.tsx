import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { headers } from "next/headers";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { redirect } from 'next/navigation'

export const dynamic = "force-dynamic";
export default async function CheckoutPage() {
  const payload = await getPayload({ config: configPromise })
  const headersList = await headers()
  const { user } = await payload.auth({
    headers: headersList
  })
  if (!user) {
    redirect('/login')
  }

  return (
    <CheckoutStepper user={user} />          
  )
}