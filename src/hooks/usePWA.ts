'use client'

import { useEffect, useState } from 'react'

export function usePWA() {
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      setIsPWA(isStandalone)
    }

    checkPWA()
    
    // Escuchar cambios
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkPWA)
    
    return () => mediaQuery.removeEventListener('change', checkPWA)
  }, [])

  return isPWA
}