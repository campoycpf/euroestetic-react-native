import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound, redirect } from "next/navigation";
import OkPaymentSection from '@/components/checkout/redsys/ok/OkPaymentSection';
import KoPaymentSection from '@/components/checkout/redsys/ko/koPaymentSection';
import PWADetector from '@/components/PWADetector';
import { Product } from "@/payload-types";
import { headers } from "next/headers";
import { getPriceProduct } from "utils/consts";
import { getIva } from "@/actions/globals";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ result: string }>,
  searchParams: Promise< {Ds_SignatureVersion:string, Ds_MerchantParameters: string, Ds_Signature: string }>,
})  {
  const newParams = await params
  const {result} = newParams
  const newSearchParams = await searchParams
  
  if (!result || (result !== 'ok' && result !== 'ko')) {
    notFound()
  }
  const success = result === 'ok'
  if (!success) {
    return (
      <main>
        <PWADetector />
        <KoPaymentSection />
      </main>
    );
  }

  const Ds_MerchantParameters = newSearchParams.Ds_MerchantParameters
  if(!Ds_MerchantParameters) {
    return (
      <main>
        <PWADetector />
        <OkPaymentSection />
      </main>
    );
  }
  let decodedMerchantParameters = "";
  try {
    decodedMerchantParameters = Buffer.from(Ds_MerchantParameters, "base64").toString("utf-8");

  } catch (e) {
    console.error("Error al decodificar MerchantParameters:", e);
  }
  let orderRef = "000000000000"
  if (decodedMerchantParameters !== "") {
    const redsysParams = JSON.parse(decodedMerchantParameters);
    orderRef = redsysParams.Ds_Order
  }
  const payload = await getPayload({ config: configPromise });

  // 1. Obtener usuario autenticado
  const headersList = await headers()
  const { user } = await payload.auth({
    headers: headersList
  })
  if (!user) {
    redirect('/login')
  }


  // 3. Obtener productos del carrito
  const cartResult = await payload.find({
    collection: "carts",
    where: { user: { equals: user.id } },
    depth: 2,
    user,
    overrideAccess: false,
  });
  const cartItems = cartResult.docs;
  const products = cartItems.map(item => ({
    product_id:( item.product as Product).id.toFixed(0) ,
    product_name: ( item.product as Product).title,  
    quantity: item.quantity,
    price:getPriceProduct(item.product as Product) 
  }));
  const total = cartItems.reduce((acc, item) => acc + getPriceProduct(item.product as Product) * item.quantity, 0);
  const iva = await getIva()
  const subtotal = total / (1 + (iva / 100));
    const totalIva = total - subtotal;

  // 4. Crear la orden en Orders
  const mailingProvince = user.mailing_province ?? 'Madrid'
  await payload.create({
    collection: "orders",
    data: {
      user_id: user.id.toFixed(0),
      cif_dni_nie: user.cif_dni_nie as string,
      customer: user.mailing_name as string,
      mailing_address: user.mailing_address as string,
      mailing_city: user.mailing_city as string,
      mailing_cp: user.mailing_cp as string,
      mailing_province: mailingProvince,
      name: user.name as string,
      address: user.address as string,
      city: user.city as string,
      cp: user.cp as string,
      province: user.province,
      order_items: products,
      order_ref: orderRef,
      iva: iva,
      total_iva: totalIva,
      total
    },
    overrideAccess: false,
    user
  });

  return (
    <main>
      <PWADetector />
      <OkPaymentSection />  
    </main>
  );
};

