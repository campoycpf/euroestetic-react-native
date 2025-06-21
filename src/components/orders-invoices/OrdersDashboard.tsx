'use client'

import React, { useEffect, useState } from 'react'
import { getUserOrders, GetUserOrdersResult } from './orderActions'
import Image from 'next/image'
import { FaCheck } from 'react-icons/fa'; // Importación añadida

// Helper para formatear fechas
const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Helper para formatear moneda
const formatCurrency = (amount?: number | null) => {
  if (amount === null || typeof amount === 'undefined') return 'N/A'
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

// Helper para obtener el texto del estado del pedido
const getOrderStatusText = (status?: 'R' | 'T' | 'E' | null): string => {
  if (!status) return 'Desconocido';
  switch (status) {
    case 'R': return 'Recibido';
    case 'T': return 'En Tramitación';
    case 'E': return 'Enviado';
    default: return 'Desconocido';
  }
};

// Nuevo componente para el Timeline del Estado del Pedido
const OrderStatusTimeline = ({ status }: { status?: 'R' | 'T' | 'E' | null }) => {
  const stages = [
    { id: 'R', label: 'Recibido' },
    { id: 'T', label: 'En Transito' },
    { id: 'E', label: 'Entregado' },
  ];

  let currentStageIndex = -1;
  if (status === 'R') currentStageIndex = 0;
  else if (status === 'T') currentStageIndex = 1;
  else if (status === 'E') currentStageIndex = 2;

  return (
    <div className="flex items-center space-x-2 mt-2 mx-auto max-w-md">
      {stages.map((stage, index) => (
        <React.Fragment key={stage.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${ // Tamaño aumentado y flex para centrar icono
                index <= currentStageIndex 
                  ? 'bg-euroestetic text-white' // Etapa completada: fondo euroestetic, icono check blanco
                  : 'bg-gray-300' // Etapa no completada: círculo gris
              }`}
            >
              {index <= currentStageIndex && <FaCheck size={10} />} {/* Mostrar icono si la etapa está completada */}
            </div>
            <span className={`mt-1 text-xs ${
              index <= currentStageIndex ? 'font-semibold text-euroestetic' : 'text-gray-500'
            }`}>
              {stage.label}
            </span>
          </div>
          {index < stages.length - 1 && (
            <div
              className={`flex-1 h-0.5 ${
                index < currentStageIndex ? 'bg-euroestetic' : 'bg-gray-300'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const OrdersDashboard = () => {
  const [ordersData, setOrdersData] = useState<GetUserOrdersResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<number | string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getUserOrders(currentPage)
        setOrdersData(result)
        if (!result.success) {
          setError(result.error || 'Error desconocido al cargar los pedidos.')
        }
      } catch (e: any) {
        setError(e.message || 'Ocurrió un error al cargar los pedidos.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [currentPage])

  const handleToggleAccordion = (orderId: number | string) => {
    setOpenAccordion(openAccordion === orderId ? null : orderId)
  }

  if (isLoading) {
    return <div className="p-6 text-center">Cargando pedidos...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>
  }

  if (!ordersData || !ordersData.success || !ordersData.orders || ordersData.orders.length === 0) {
    return <div className="p-6 text-center">No tienes pedidos realizados.</div>
  }

  const { orders, totalPages, hasNextPage, hasPrevPage, filenames } = ordersData
  const getFilename = (product_id: string) => {
    return filenames?.find(f => f.productId === product_id)?.filename || 'logo-default-image.png'
  }

  return (
    <div className="space-y-4 p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Mis Pedidos</h1>
      {orders.map((order) => (
        <div key={order.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <button
            onClick={() => handleToggleAccordion(order.id)}
            className="w-full p-4 bg-gray-50 hover:bg-gray-100 focus:outline-none text-left transition-colors duration-150"
            aria-expanded={openAccordion === order.id}
            aria-controls={`order-details-${order.id}`}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              {/* Columna Izquierda: Referencia y Fecha */}
              <div className="mb-3 sm:mb-0">
                <span className="font-semibold text-gray-800 text-lg">{order.order_ref || order.id}</span>
                <span className="text-sm text-gray-600 block">
                  {formatDate(order.createdAt)}
                </span>
              </div>

              {/* Columna Central: Total y Timeline de Estado */}
              <div className="flex flex-col sm:items-end">
                <div className="font-semibold text-gray-800 text-lg mb-1 sm:mb-0">{formatCurrency(order.total)}</div>
              </div>
              
              {/* Icono de Acordeón */}
              <span className="text-euroestetic text-2xl mt-3 sm:mt-0 sm:ml-4 self-center sm:self-auto">
                {openAccordion === order.id ? '−' : '+'}
              </span>
              
            </div>
            <OrderStatusTimeline status={order.status} />
          </button>
          {openAccordion === order.id && (
            <div id={`order-details-${order.id}`} className="p-4 border-t border-gray-200 bg-white">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Detalles del Pedido</h3>
              <div className="space-y-3 mb-4">
                {order.order_items.map((item, index) => (
                  <div key={item.id || index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 border-b border-gray-100 last:border-b-0">
                    <div className="w-20 h-20 relative flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                      {/* Placeholder para imagen del producto. Para imágenes reales, se necesita ajustar la data. */}
                      <Image
                        src={item.product_id ? '/media/' + getFilename(item.product_id) : '/logo-default-image.png'} // Usar un placeholder genérico
                        alt={item.product_name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.product_name}</p>
                      <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <p className="font-medium text-gray-800">{formatCurrency(item.price)} /ud.</p>
                      <p className="text-sm text-gray-500">Subtotal: {formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h4 className="font-semibold text-gray-700 mb-2">Resumen del Pedido</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Subtotal (sin IVA):</span>
                    <span className="font-medium text-gray-800">{formatCurrency((order.total || 0) - (order.total_iva || 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA ({order.iva}%):</span>
                    <span className="font-medium text-gray-800">{formatCurrency(order.total_iva)}</span>
                  </div>
                  <hr className="my-2 border-gray-200"/>
                  <div className="flex justify-between font-bold text-base text-gray-800">
                    <span>Total Pedido:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Estado del pedido:</span> {getOrderStatusText(order.status)}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}

      {totalPages && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-3 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!hasPrevPage || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-colors"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!hasNextPage || isLoading}
            className="px-4 py-2 bg-gradient-to-r from-euroestetic via-euroestetic/90 to-euroestetic/70 text-white rounded-md hover:opacity-90 disabled:opacity-50 transition-colors"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}

export default OrdersDashboard