'use client'
import CryptoJS from "crypto-js";
import { RedsysData } from "./types";
import { useCartStore } from "@/storeCart/cartStoreCookies";
function Redsys() {
  const { items } = useCartStore()
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const amount = Math.round(totalPrice * 100)
  function createMerchantParameters(params: RedsysData): string {
    const merchantParameters = CryptoJS.enc.Utf8.parse(JSON.stringify(params));
    const merchantBase64 = merchantParameters.toString(CryptoJS.enc.Base64);

    return merchantBase64;
  }

  function createMerchatSignature(params: RedsysData, merchantBase64: string) {
    const claveComercio = process.env.NEXT_PUBLIC_DS_MERCHANT_KEY as string;
    // Generar clave de transacci
    // Decode key
    const decodeKey = CryptoJS.enc.Base64.parse(claveComercio);

    // Generate transaction key
    const iv = CryptoJS.enc.Hex.parse("0000000000000000");
    const cipher = CryptoJS.TripleDES.encrypt(
      params.DS_MERCHANT_ORDER,
      decodeKey,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      }
    );

    // Sign
    const signature = CryptoJS.HmacSHA256(merchantBase64, cipher.ciphertext);
    const signatureBase64 = signature.toString(CryptoJS.enc.Base64);

    return signatureBase64;
  }

  function generarNumeroPedido() {
    // Genera una cadena base combinando timestamp y aleatorio, y la recorta a 12 caracteres
    const base = Date.now().toString(36) +
      (typeof crypto !== "undefined"
        ? Array.from(crypto.getRandomValues(new Uint32Array(2)))
            .map(n => n.toString(36))
            .join('')
        : Math.random().toString(36).substring(2, 10));
    return base.substring(0, 12).padEnd(12, '0');
  }

  const data: RedsysData = {
    DS_MERCHANT_AMOUNT: amount.toFixed(0),
    DS_MERCHANT_CURRENCY: process.env.NEXT_PUBLIC_DS_MERCHANT_CURRENCY as string,
    DS_MERCHANT_MERCHANTCODE: process.env.NEXT_PUBLIC_DS_MERCHANT_MERCHANTCODE as string,
    DS_MERCHANT_MERCHANTURL: process.env.NEXT_PUBLIC_DS_MERCHANT_MERCHANTURL as string,
    DS_MERCHANT_ORDER: generarNumeroPedido(),
    DS_MERCHANT_TERMINAL: process.env.NEXT_PUBLIC_DS_MERCHANT_TERMINAL as string,
    DS_MERCHANT_TRANSACTIONTYPE: process.env.NEXT_PUBLIC_DS_MERCHANT_TRANSACTIONTYPE as string,
    DS_MERCHANT_URLKO: process.env.NEXT_PUBLIC_DS_MERCHANT_URLKO as string,
    DS_MERCHANT_URLOK: process.env.NEXT_PUBLIC_DS_MERCHANT_URLOK as string,
  };

  const dsmerchantParameters = createMerchantParameters(data);
  const dsSignature = createMerchatSignature(data, dsmerchantParameters);
  const dsSignatureVersion = "HMAC_SHA256_V1";

  return (
    <div className="flex justify-center">
        <form
          name="formularioPago"
          method="POST"
          action="https://sis-t.redsys.es:25443/sis/realizarPago"
        >
          
          <input
            type="hidden"
            name="DS_MERCHANTPARAMETERS"
            value={dsmerchantParameters}
          />
          <input type="hidden" name="DS_SIGNATURE" value={dsSignature} />
          <input
            type="hidden"
            name="DS_SIGNATUREVERSION"
            value={dsSignatureVersion}
          />
          <input 
          className="px-6 py-2 bg-gradient-to-r cursor-pointer from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-lg hover:opacity-90"
        
          type="submit" 
          value="Realizar Pago" 
          />
        </form>
    </div>
  );
}

export default Redsys;
