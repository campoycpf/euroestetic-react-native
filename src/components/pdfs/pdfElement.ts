export const getPdfElement = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    // Usar el nombre de archivo sugerido por la función o generar uno
    a.download = `factura-${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Liberar el objeto URL
}