'use client';
import React, { useMemo } from 'react';
import { useWatchForm, useField } from '@payloadcms/ui';

const LiveTotals: React.FC = () => {
  const { fields } = useWatchForm();
  const { setValue: setTotal } = useField({ path: 'total' });
  const { setValue: setTotalIva } = useField({ path: 'total_iva' });

  // Extraer el IVA real
  const iva = typeof fields?.iva?.value === 'number'
    ? fields.iva.value
    : parseFloat(fields?.iva?.value as string) || 0;

  // Extraer los valores de cada item del array
  const orderItems = useMemo(() => {
    const items = [];
    let i = 0;
    while (fields[`order_items.${i}.price`] && fields[`order_items.${i}.quantity`]) {
      items.push({
        price: Number(fields[`order_items.${i}.price`]?.value) || 0,
        quantity: Number(fields[`order_items.${i}.quantity`]?.value) || 0,
      });
      i++;
    }
    return items;
  }, [fields]);

  // Calcular totales
  const { subtotal, totalIva, total } = useMemo(() => {
    const totalConIva = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    // Calculamos el subtotal (sin IVA) a partir del total con IVA
    const subtotal = totalConIva / (1 + (iva / 100));
    const totalIva = totalConIva - subtotal;
    const total = totalConIva;
    return { subtotal, totalIva, total };
  }, [orderItems, iva]);

  // Setear automáticamente los valores en el formulario
  React.useEffect(() => {
    setTotal(total);
    setTotalIva(totalIva);
  }, [total, totalIva, setTotal, setTotalIva]);

  return (
    <div style={{ display:'flex', gap:'20px', justifyContent: 'center', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', marginTop: '1rem' }}>
      <p><strong>Base Imponible:</strong> {subtotal.toFixed(2)} €</p>
      <p><strong>IVA ({iva}%):</strong> {totalIva.toFixed(2)} €</p>
      <p><strong>Total:</strong> {total.toFixed(2)} €</p>
    </div>
  );
};

export default LiveTotals;
