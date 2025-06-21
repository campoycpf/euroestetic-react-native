'use client'
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/storeCart/cartStoreCookies";
import HomeLinkSection from "../HomeLinkSection";
import './spinner.css'; // Importa los estilos del spinner



const OkPaymentSection = () => {
  
    const {removeCart} = useCartStore();
 
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(searchParams ? true : false);
    useEffect(() => {
      const handlePayment = async () => {
        await removeCart();
        
        setIsLoading(false);
      }
      if(searchParams.size >0) {
        setTimeout(()=>{
          router.push("/checkout/ok");
          return;
        }, 1000)
      } else {
          handlePayment();
      }
    }, [searchParams]);
    return (
        <article className="mx-auto flex flex-col justify-center items-center h-[calc(100vh-64px)] p-5">
          {isLoading ? 
            <div className="flex flex-col items-center">
              <div className="spinner"></div>
              <p className="mt-2">Cargando...</p>
            </div>
          : 
          <>
            <div className="text-[clamp(1.3rem,1.034rem+0.851vw,1.8rem)] text-center flex justify-center flex-col items-center">
              <h1 className="text-unimobile font-bold">Tu pago ha sido efectuado con éxito. !!!</h1>&nbsp;
              <Image src={`/success.png`} width={160} height={160} alt="ok icon"/>
              <div className="text-unimobile font-bold mb-2" style={{marginTop: '34px'}}>Gracias por tu compra.</div>
            </div>
            <HomeLinkSection result={'ok'}/>
          </>
          }
            
        </article>
    )
}
export default OkPaymentSection