'use client'
import { useRouter } from 'next/navigation'
import { homeTabs } from '../../../../utils/tabs'

export const dynamic = "force-dynamic";
export default function DashboardPage() {
  const router = useRouter()
  return (
    <div className="min-h-auto">
      <div className="container mx-auto px-2 py-0 lg:px-4 lg:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto">
          {homeTabs.map((tab) => 
            (
              <button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className="w-full h-auto rounded-xl py-8 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-2xl">
                    <img src={tab.icon} alt="" width={150} height={150} />
                  </span>
                  <span className="text-xl font-semibold">{tab.label}</span>
                </div>
              </button>
            )
          )}
      
        </div>
      </div>
    </div>
  )
}
