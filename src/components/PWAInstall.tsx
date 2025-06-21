'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  if (!showInstallButton) return null

  return (
    <div className="fixed bottom-4 right-4 z-[500000]">
      <div className="bg-euroestetic text-white p-4 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Instalar App</h3>
            <p className="text-xs opacity-90">Accede más rápido a Euro Estetic</p>
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setShowInstallButton(false)}
              className="text-xs px-2 py-1 border border-white/30 rounded hover:bg-white/10"
            >
              Ahora no
            </button>
            <button
              onClick={handleInstallClick}
              className="text-xs px-2 py-1 bg-white text-euroestetic rounded hover:bg-gray-100"
            >
              Instalar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}