'use client'
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import HomeLinkSection from "../HomeLinkSection";



const KoPaymentSection = () => {
 
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
      if(searchParams) {
        setTimeout(()=>{
          router.push("/checkout/ko");
          return;
        }, 1000)
      } 
    }, [searchParams]);
    return (
        <article className="mx-auto flex flex-col justify-center items-center h-[calc(100vh-64px)] p-5">
            <div className="text-[clamp(1.3rem,1.034rem+0.851vw,1.8rem)] text-center flex justify-center flex-col items-center">
              <h1 className="text-unimobile font-bold">Ha habido algún problema al hacer el pago</h1>&nbsp;
              <Image src={`/failure.svg`} width={160} height={160} alt="ko icon"/>
              <div className="text-unimobile font-bold mb-2" style={{marginTop: '34px'}}>Inténtalo de nuevo</div>
            </div>
            <HomeLinkSection result={'ko'}/>
        </article>
    )
}
export default KoPaymentSection