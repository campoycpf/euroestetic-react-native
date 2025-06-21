'use client'
import TabsClient from './TabsClient';
import { usePWA } from '@/hooks/usePWA';

export const dynamic = "force-dynamic";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isPwa = usePWA();
  return (
    <div className={`${isPwa ? 'min-h-auto' : 'min-h-screen'}`}>
      <div className="container mx-auto px-4 py-8">
        <TabsClient />
        <div className="bg-white">
          {children}
        </div>
      </div>
    </div>
  )
}