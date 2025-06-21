'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function PWADetector() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Detectar si venimos de Redsys por los parámetros que realmente envía
    const hasRedsysParams = searchParams.has('Ds_MerchantParameters') || 
                           searchParams.has('Ds_Signature') ||
                           searchParams.has('Ds_SignatureVersion')
    
    console.log('hasRedsysParams:', hasRedsysParams)
    console.log('URL params:', Object.fromEntries(searchParams.entries()))
    
    // Función para detectar si estamos en PWA (solo métodos confiables)
    const isPWA = () => {
      // Método 1: CSS media query (más confiable)
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Detectado: PWA por display-mode standalone')
        return true
      }
      
      // Método 2: iOS Safari standalone
      if ('standalone' in window.navigator && (window.navigator as any).standalone) {
        console.log('Detectado: PWA por iOS Safari standalone')
        return true
      }
      
      // Método 3: Android Chrome PWA
      if (document.referrer.includes('android-app://')) {
        console.log('Detectado: PWA por Android Chrome')
        return true
      }
      
      console.log('Detectado: Navegador normal')
      return false
    }
    
    const isInPWA = isPWA()
    console.log('¿Estamos en PWA?:', isInPWA)
    
    // Solo actuar si venimos de Redsys Y estamos en navegador normal (no PWA)
    if (hasRedsysParams && !isInPWA) {
      console.log('Condiciones cumplidas: venimos de Redsys y estamos en navegador')
      
      // Intentar abrir la PWA instalada
      const tryOpenPWA = async () => {
        try {
          // Construir la URL para la PWA (sin parámetros adicionales que puedan confundir)
          const baseUrl = window.location.origin
          const pathname = window.location.pathname
          const searchString = window.location.search
          const pwaUrl = `${baseUrl}${pathname}${searchString}`
          
          console.log('Intentando abrir PWA con URL:', pwaUrl)
          
          // Mostrar confirmación al usuario
          const shouldOpenInPWA = confirm(
            '¿Quieres abrir este resultado en la aplicación Euroestetic instalada?'
          )
          
          if (shouldOpenInPWA) {
            // Método 1: Intentar usar navigator.share si está disponible (Android)
            if ('share' in navigator) {
              try {
                await navigator.share({
                  title: 'Resultado del pago - Euroestetic',
                  url: pwaUrl
                })
                return
              } catch (shareError) {
                console.log('navigator.share falló:', shareError)
              }
            }
            
            // Método 2: Crear un enlace con intent para Android
            if (/Android/i.test(navigator.userAgent)) {
              const intentUrl = `intent://${window.location.host}${pathname}${searchString}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(pwaUrl)};end`
              console.log('Intentando abrir con Android Intent:', intentUrl)
              window.location.href = intentUrl
              return
            }
            
            // Método 3: Para iOS, intentar abrir con esquema personalizado
            if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
              // Crear un enlace temporal para intentar abrir la PWA
              const link = document.createElement('a')
              link.href = pwaUrl
              link.target = '_blank'
              link.rel = 'noopener'
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
              return
            }
            
            // Método 4: Fallback - abrir en nueva pestaña
            console.log('Usando fallback: abrir en nueva pestaña')
            window.open(pwaUrl, '_blank', 'noopener,noreferrer')
            
          } else {
            console.log('Usuario canceló la apertura en PWA')
          }
          
        } catch (error) {
          console.error('Error al intentar abrir PWA:', error)
          // Fallback silencioso - no hacer nada si falla
        }
      }
      
      // Ejecutar después de un pequeño delay para asegurar que la página esté completamente cargada
      setTimeout(tryOpenPWA, 1000)
    } else {
      if (!hasRedsysParams) {
        console.log('No venimos de Redsys, no se requiere acción')
      }
      if (isInPWA) {
        console.log('Ya estamos en PWA, no se requiere acción')
      }
    }
  }, [searchParams])
  
  return null
}