'use client'

import { a } from 'node_modules/framer-motion/dist/types.d-B_QPEvFK'
import { useEffect, useState } from 'react'

export default function PWARedirector() {
  const [url, setUrl] = useState('')  
  useEffect(() => {
    const currentUrl = window.location.href
        const baseUrl = window.location.origin
        const pathname = window.location.pathname
        const searchString = window.location.search
        
        // Construir URL para PWA con parámetro identificador
        const pwaUrl = `${baseUrl}${pathname}${searchString}${searchString ? '&' : '?'}utm_source=pwa`
        
        console.log('🔗 PWARedirector: URL actual:', currentUrl)
        console.log('🔗 PWARedirector: URL PWA:', pwaUrl)

console.log(`intent://euroestetic.es/?utm_source=pwa#Intent;scheme=https;package=com.android.chrome;end;`)
        if (/Android/i.test(navigator.userAgent)) {
            console.log("ha entrado al intent")
            console.log('🤖 PWARedirector: Detectado Android, usando Intent')
            const intentUrl = `intent://euroestetic.es/?utm_source=pwa#Intent;scheme=https;package=com.android.chrome;end;`
            console.log('🤖 PWARedirector: Intent URL:', intentUrl)
            setUrl(intentUrl)

           

            return
          }
          return
    console.log('🔄 PWARedirector: Iniciando componente')
    
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') {
      console.log('❌ PWARedirector: Ejecutándose en servidor, saliendo')
      return
    }
    
    console.log('✅ PWARedirector: Ejecutándose en cliente')
    console.log('📍 PWARedirector: URL actual:', window.location.href)
    console.log('🌐 PWARedirector: User Agent:', navigator.userAgent)
    
    // Función para detectar si estamos en PWA
    const isPWA = () => {
      console.log('🔍 PWARedirector: Verificando si estamos en PWA...')
      
      // Método 1: CSS media query (más confiable)
      const standaloneMatch = window.matchMedia('(display-mode: standalone)').matches
      console.log('📱 PWARedirector: CSS display-mode standalone:', standaloneMatch)
      if (standaloneMatch) {
        console.log('✅ PWARedirector: PWA detectada por CSS media query')
        return true
      }
      
      // Método 2: iOS Safari standalone
      const iosStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone
      console.log('🍎 PWARedirector: iOS standalone:', iosStandalone)
      if (iosStandalone) {
        console.log('✅ PWARedirector: PWA detectada por iOS standalone')
        return true
      }
      
      // Método 3: Android Chrome PWA
      const androidApp = document.referrer.includes('android-app://')
      console.log('🤖 PWARedirector: Android app referrer:', androidApp)
      if (androidApp) {
        console.log('✅ PWARedirector: PWA detectada por Android referrer')
        return true
      }
      
      console.log('❌ PWARedirector: No estamos en PWA')
      return false
    }
    
    // Función para detectar si la PWA está instalada
    const isPWAInstalled = async () => {
      console.log('🔍 PWARedirector: Verificando si PWA está instalada...')
      
      // Verificar si el navegador soporta getInstalledRelatedApps
      if ('getInstalledRelatedApps' in navigator) {
        console.log('📱 PWARedirector: getInstalledRelatedApps disponible')
        try {
          const relatedApps = await (navigator as any).getInstalledRelatedApps()
          console.log('📱 PWARedirector: Apps relacionadas encontradas:', relatedApps.length)
          console.log('📱 PWARedirector: Apps relacionadas:', relatedApps)
          if (relatedApps.length > 0) {
            console.log('✅ PWARedirector: PWA instalada detectada por getInstalledRelatedApps')
            return true
          }
        } catch (error) {
          console.log('❌ PWARedirector: Error en getInstalledRelatedApps:', error)
        }
      } else {
        console.log('❌ PWARedirector: getInstalledRelatedApps no disponible')
      }
      
      // Fallback: verificar si hay indicios de PWA instalada
      console.log('🔄 PWARedirector: Usando métodos fallback...')
      
      // Verificar si hay un service worker registrado (indicio de PWA)
      if ('serviceWorker' in navigator) {
        console.log('🔧 PWARedirector: Service Worker disponible')
        try {
          const registration = await navigator.serviceWorker.getRegistration()
          console.log('🔧 PWARedirector: Service Worker registration:', !!registration)
          if (registration) {
            const currentlyInPWA = isPWA()
            console.log('🔧 PWARedirector: Actualmente en PWA:', currentlyInPWA)
            // Si hay SW y no estamos en PWA, probablemente esté instalada
            if (!currentlyInPWA) {
              console.log('✅ PWARedirector: PWA probablemente instalada (SW registrado pero no en PWA)')
              return true
            }
          }
        } catch (error) {
          console.log('❌ PWARedirector: Error verificando service worker:', error)
        }
      } else {
        console.log('❌ PWARedirector: Service Worker no disponible')
      }
      
      // Verificar localStorage para indicios de instalación previa
      const pwaInstalled = localStorage.getItem('pwa-installed')
      console.log('💾 PWARedirector: localStorage pwa-installed:', pwaInstalled)
      if (pwaInstalled === 'true') {
        console.log('✅ PWARedirector: PWA instalada detectada por localStorage')
        return true
      }
      
      console.log('❌ PWARedirector: PWA no detectada como instalada')
      return false
    }
    
    // Función para intentar abrir en PWA
    const openInPWA = async () => {
      console.log('🚀 PWARedirector: Intentando abrir en PWA...')
      try {
        const currentUrl = window.location.href
        const baseUrl = window.location.origin
        const pathname = window.location.pathname
        const searchString = window.location.search
        
        // Construir URL para PWA con parámetro identificador
        const pwaUrl = `${baseUrl}${pathname}${searchString}${searchString ? '&' : '?'}utm_source=pwa`
        
        console.log('🔗 PWARedirector: URL actual:', currentUrl)
        console.log('🔗 PWARedirector: URL PWA:', pwaUrl)
        
        // Método 1: Android Intent
        if (/Android/i.test(navigator.userAgent)) {
          console.log('🤖 PWARedirector: Detectado Android, usando Intent')
          const intentUrl = `intent://${window.location.host}${pathname}${searchString}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(currentUrl)};end`
          console.log('🤖 PWARedirector: Intent URL:', intentUrl)
          window.location.href = intentUrl
          return
        }
        
        // Método 2: iOS - crear enlace temporal
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          console.log('🍎 PWARedirector: Detectado iOS, usando enlace temporal')
          const link = document.createElement('a')
          link.href = pwaUrl
          link.target = '_self'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          console.log('🍎 PWARedirector: Enlace temporal ejecutado')
          return
        }
        
        // Método 3: Windows/Desktop - múltiples intentos
        console.log('💻 PWARedirector: Detectado Windows/Desktop, usando múltiples métodos')
        
        // Intentar con window.open primero
        console.log('💻 PWARedirector: Intentando window.open')
        const newWindow = window.open(pwaUrl, '_self')
        
        // Si window.open falla, usar location.href
        if (!newWindow || newWindow.closed) {
          console.log('💻 PWARedirector: window.open falló, usando location.href')
          window.location.href = pwaUrl
        } else {
          console.log('💻 PWARedirector: window.open exitoso')
        }
        
        // Fallback adicional con timeout
        setTimeout(() => {
          if (window.location.href === currentUrl) {
            console.log('💻 PWARedirector: Fallback final - location.replace')
            window.location.replace(pwaUrl)
          }
        }, 1000)
        
      } catch (error) {
        console.error('❌ PWARedirector: Error al intentar abrir PWA:', error)
        
        // Último recurso: forzar navegación
        try {
          console.log('🆘 PWARedirector: Último recurso - forzando navegación')
          const pwaUrl = `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.search ? '&' : '?'}utm_source=pwa`
          window.location.assign(pwaUrl)
        } catch (finalError) {
          console.error('❌ PWARedirector: Error en último recurso:', finalError)
        }
      }
    }
    
    // Función principal
    const checkAndRedirect = async () => {
      console.log('🎯 PWARedirector: Iniciando verificación y redirección')
      
      // No hacer nada si ya estamos en PWA
      if (isPWA()) {
        console.log('✅ PWARedirector: Ya estamos en PWA, no se requiere redirección')
        return
      }
      
      // No redirigir si venimos de una redirección previa (evitar bucles)
      const urlParams = new URLSearchParams(window.location.search)
      const utmSource = urlParams.get('utm_source')
      console.log('🔄 PWARedirector: utm_source:', utmSource)
      if (utmSource === 'pwa') {
        console.log('🔄 PWARedirector: Ya venimos de una redirección PWA, evitando bucle')
        return
      }
      
      // Verificar si la PWA está instalada
      console.log('🔍 PWARedirector: Verificando instalación de PWA...')
      const installed = await isPWAInstalled()
      console.log('📊 PWARedirector: Resultado verificación PWA instalada:', installed)
      
      if (installed) {
        console.log('🚀 PWARedirector: PWA detectada como instalada, iniciando redirección...')
        
        // Pequeño delay para evitar problemas de renderizado
        console.log('⏱️ PWARedirector: Esperando 500ms antes de redirigir...')
        setTimeout(() => {
          console.log('⏱️ PWARedirector: Delay completado, ejecutando redirección')
          openInPWA()
        }, 500)
      } else {
        console.log('ℹ️ PWARedirector: PWA no detectada como instalada, no se redirige')
      }
    }
    
    // Ejecutar después de que la página esté completamente cargada
    console.log('📄 PWARedirector: Estado del documento:', document.readyState)
    if (document.readyState === 'complete') {
      console.log('📄 PWARedirector: Documento ya cargado, ejecutando inmediatamente')
      checkAndRedirect()
    } else {
      console.log('📄 PWARedirector: Esperando carga completa del documento')
      const handleLoad = () => {
        console.log('📄 PWARedirector: Documento cargado, ejecutando verificación')
        checkAndRedirect()
      }
      window.addEventListener('load', handleLoad)
      return () => {
        console.log('🧹 PWARedirector: Limpiando event listener')
        window.removeEventListener('load', handleLoad)
      }
    }
  }, [])
  
  return (
    <>
    {url !=='' && 
        <a href={url} className='fixed bottom-10 left-10 bg-black text-white px-5 py-2'>{url}</a>
    }
    </>
  )
}