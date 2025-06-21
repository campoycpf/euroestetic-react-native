'use client'
import Tabs from "@/components/dashboard/Tabs"
import { usePWA } from "@/hooks/usePWA"
const TabsClient  = () => {
    const isPwa = usePWA()
    return (
        <>
            {!isPwa &&
                <Tabs/>
            }
        </>
    )
}
export default TabsClient