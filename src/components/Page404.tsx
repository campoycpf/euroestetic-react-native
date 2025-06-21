'use client'
import Link from "next/link";
import Image from "next/image";

const Page404 = ()=>{
    return (

            <div
                style={{ minHeight: 'calc(100vh - 140px)'}}
                className={`overflow-hidden min-w-full rounded-sm p-30 flex flex-col justify-center items-center`}>
                <h1 style={{fontSize: '3em', marginBottom: '30px'}}>404</h1>
                <p>Lo sentimos. Esta página no existe</p>
                <Link href="/" style={{color: '#0070f3', textDecoration: 'underline', marginTop: '30px'}} className="focus:outline-none peer relative z-[1]">
                    <Image src={'/logo.png'}
                           alt={'Logo UniMobile'}
                           width={200}
                           height={64}
                           priority
                    />
                </Link>
            </div>

    )
}
export default Page404