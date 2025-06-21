'use client'
import React, { useEffect, useState } from 'react'
import { getUserOrders, GetUserOrdersResult } from './orderActions'
import { formatCurrency, formatDate } from 'utils/consts'
import PdfButton from '../pdfs/PdfButton'

const InvoicesDashboard = () => {
  const [ordersData, setOrdersData] = useState<GetUserOrdersResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfError, setPdfError] = useState<string | null>(null);

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

  if (isLoading) {
    return <div className="p-6 text-center">Cargando pedidos...</div>
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>
  }

  if (!ordersData || !ordersData.success || !ordersData.orders || ordersData.orders.length === 0) {
    return <div className="p-6 text-center">No tienes facturas.</div>
  }

  const { orders, totalPages, hasNextPage, hasPrevPage } = ordersData
 

  return (
    <div className="space-y-4 p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Mis Facturas</h1>
      {/* Mostrar error de PDF global si existe */}
      {pdfError && (
        <div className="mb-4 p-3 text-center text-red-600 bg-red-100 border border-red-400 rounded">
          Error con PDF: {pdfError} <button onClick={() => setPdfError(null)} className="ml-2 text-sm font-semibold">Descartar</button>
        </div>
      )}
      {orders.map((order, i) => (
        <div key={order.id} className={`bg-${i%2===0?'gray-200' : 'white'} rounded-lg shadow-sm overflow-hidden !m-0`}>
          <div
            className="w-full p-4 focus:outline-none text-left transition-colors duration-150"
            aria-controls={`order-details-${order.id}`}
          >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center">
              {/* Columna Izquierda: Referencia y Fecha */}
              <div className="mb-3 sm:mb-0">
                <span className="font-semibold text-gray-800">Factura: {order.invoice_number}</span>
                <span className="text-sm text-gray-600 block">Pedido: {order.order_ref || order.id}</span>
                <span className="text-sm text-gray-600 block">
                  Fecha: {formatDate(order.invoice_date)}
                </span>
              </div>

            
              {/* Botón PDF */}
            <div className="flex items-center gap-8 mt-3 sm:mt-0 sm:ml-4">
              <div className="flex flex-col sm:items-end">
                <div className="font-semibold text-gray-800 text-lg mb-1 sm:mb-0">{formatCurrency(order.total)}</div>
              </div>
                <PdfButton order={order} setPdfError={setPdfError}/>
              </div>
              
            </div>
          </div>
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

export default InvoicesDashboard