'use client'
import { getCompanyInfo, getIva } from "@/actions/globals";
import { Order } from "@/payload-types";
import Image from "next/image";
import { Dispatch, useEffect, useState } from "react";
import { generateInvoicePdf } from "./invoicePdf";
import { getPdfElement } from "./pdfElement";

interface PdfButtonProps {
    order: Order;
    setPdfError: Dispatch<React.SetStateAction<string | null>>
}
const PdfButton = ({order, setPdfError}: PdfButtonProps) => {
    const [iva, setIva] = useState<number>(0)
    useEffect(() => {
      const fetchIva = async () => {
        setIva(await getIva())
      }
      fetchIva()
    },[])
    console.log('iva: ', iva)
    const [pdfLoadingStates, setPdfLoadingStates] = useState<Record<string, boolean>>({});
    const handleDownloadPdf = async (order: Order) => {
        setPdfLoadingStates(prev => ({ ...prev, [order.id]: true }));
        setPdfError(null); // Limpiar errores previos
        try {
            const companyInfo = await getCompanyInfo()
            // Cargar el logo
            const logoImageBytes = await fetch('/logo.png').then(res => res.arrayBuffer());
            const blob = await generateInvoicePdf(order, companyInfo, logoImageBytes, iva);
            getPdfElement(blob, order.order_ref || order.id.toFixed(0));
        } catch (e: any) {
          setPdfError(e.message || 'Error al descargar el PDF.');
          console.error("Error en handleDownloadPdf:", e);
        } finally {
          setPdfLoadingStates(prev => ({ ...prev, [order.id]: false }));
        }
      };
  return (
    <button
    onClick={(e) => {
      e.stopPropagation(); // Previene que el acordeón se abra/cierre
      // Asegurarse de que order.id es un string para la clave del estado y la función
      handleDownloadPdf(order);
    }}
    className="p-1 cursor-pointer text-gray-600 hover:text-red-600 focus:outline-none disabled:opacity-50 border-0"
    aria-label="Ver factura PDF"
    title="Ver factura PDF"
    disabled={pdfLoadingStates[order.id.toString()]} // Deshabilitar mientras carga
  >
    {pdfLoadingStates[order.id.toString()] ? (
      // Indicador de carga simple
      <svg className="animate-spin h-9 w-9 text-euroestetic" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    ) : (
      <Image
        src="/pdf.svg"
        alt="Ver factura PDF"
        width={36} // Ajustado para que coincida con el spinner h-9 w-9 (36px)
        height={36}
      />
    )}
  </button>
  )
}
export default PdfButton