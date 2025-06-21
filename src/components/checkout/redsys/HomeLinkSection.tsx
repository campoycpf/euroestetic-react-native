import Link from "next/link"
import Image from "next/image"
interface link {
    path: string;
    label: string;
    icon: string;
}
const HomeLinkSection = ({result}:{result: 'ok' | 'ko'}) => {
    let links: link[] = []
    if (result === 'ok') {
        links = [
            {path: '/dashboard/orders', label: 'Ir a pedidos', icon: '/orders.png'},
            {path: '/dashboard/invoices', label: 'Ver Factura', icon: '/invoices.png'},
        ]
    }
    else {
        links = [
            {path: '/list', label: 'Ir a carrito', icon: '/cart.png'},
            {path: '/checkout', label: 'Checkout', icon: '/checkout.svg'},
        ]
    }
    return (
        <div className="flex items-center justify-center min-w-84 gap-2">
            <Link href="/list"
                className={`
                flex items-center sm:space-x-2 px-4 
                sm:px-6 py-4 font-medium border-b-2 
                relative border-euroestetic text-euroestetic`}
            >
                <Image 
                    alt="logo Uni" 
                    loading="lazy" 
                    width="35" 
                    height="35" 
                    decoding="async" 
                    data-nimg="1" 
                    className="object-contain opacity-60" 
                    src="/logo.png"/>
                    <span className="hidden xl:block">Ir a tienda</span>
            </Link>
            {
              links.map((link, i) => {   
                return (
                    <Link
                        key={i}
                        href={link.path}
                        className={`
                            flex items-center sm:space-x-2 px-4
                            sm:px-6 py-4 font-medium border-b-2
                            relative border-euroestetic text-euroestetic`}
                    >
                        <span className="text-2xl relative">
                            <Image src={link.icon} alt="orders" width={40} height={40} className="max-sm:min-w-6" />
                        </span>
                        <span className="hidden xl:block">{link.label}</span>
                    </Link>
                )
            })}
           {/*  <Link
                  href={'/dashboard/orders'}
                  className={`
                    flex items-center sm:space-x-2 px-4 
                    sm:px-6 py-4 font-medium border-b-2 
                    relative border-euroestetic text-euroestetic`}
                >
                   <span className="text-2xl relative">
                    <Image src={'/orders.png'} alt="orders" width={40} height={40} className="max-sm:min-w-6" />
                    
                  </span>
                  <span className="hidden xl:block">Ir a pedidos</span>
            </Link>
            <Link
                  href={'/dashboard/invoices'}
                  className={`
                    flex items-center sm:space-x-2 px-4 
                    sm:px-6 py-4 font-medium border-b-2 
                    relative border-euroestetic text-euroestetic`}
                >
                   <span className="text-2xl relative">
                    <Image src={'/invoices.png'} alt="orders" width={40} height={40} className="max-sm:min-w-6" />
                    
                  </span>
                  <span className="hidden xl:block">Ver Factura</span>
            </Link> */}
        </div>
    )
}
export default HomeLinkSection