'use client'
import PdfButton from '@/components/pdfs/PdfButton'
import { Order } from '@/payload-types'
import { useEffect, useState } from 'react' // Eliminado useEffect
import { formatCurrency } from 'utils/consts'
import { useDocumentInfo, usePayloadAPI } from '@payloadcms/ui'
import { useWatchForm } from '@payloadcms/ui'


const DownloadInvoiceButton: React.FC<{
  rowData: Order | null;
}> = ({rowData}) => {
  const { fields } = useWatchForm()
  const { id } = useDocumentInfo()
  
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(rowData);
  
  useEffect(() => {
    const dataFetch = async () => {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },

      });
      
      const data = await response.json();
      setOrder(data as Order)
    }
    if (fields) {
      dataFetch()
    }
   }, [fields]);
  return (
    <>
    {order && order.id &&
      <div className="flex items-center gap-8 mt-3 sm:mt-0 sm:ml-4"> {/* Aplicando clases de Tailwind directamente */}
        <div className="flex flex-col sm:items-end"> {/* Aplicando clases de Tailwind directamente */}
          <div className="font-semibold text-gray-800 text-lg mb-1 sm:mb-0"> {/* Aplicando clases de Tailwind directamente */}
            {formatCurrency(order.total)}
          </div>
        </div>
        {/* Mostrar error si existe */}
        {pdfError && (
          <div className="text-red-500 ml-4"> {/* Ajusta las clases según necesites */}
            Error: {pdfError}
          </div>
        )}
        <PdfButton order={order} setPdfError={setPdfError}/>
      </div>
    }
  </>
  )
}

export default DownloadInvoiceButton