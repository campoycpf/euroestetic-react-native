import { CompanyInfo, Order, User } from "@/payload-types"
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFImage, PageSizes } from "pdf-lib"
import { formatCurrency, formatDate } from "utils/consts"

const drawHeader = async (page: any, pdfDoc: PDFDocument, orderData: Order, companyInfo: CompanyInfo, font: PDFFont, boldFont: PDFFont, logoImage: PDFImage) => {
    const { width, height } = page.getSize();
    const margin = 50;
    const topMargin = 30;
    const lineHeight = 12;
    const regularLineHeight = 15;
    const fontSize = 9;
    const headerFontSize = 10;
    const columnGap = 15;
    const leftColumnX = margin;
    const rightColumnX = width / 2 + columnGap / 2;
    const columnWidth = width / 2 - margin - columnGap / 2 - columnGap;

    let currentY = height - topMargin;

    // --- Información de la Empresa (Arriba y Centrado) ---
    const logoDims = logoImage.scale(0.01);
    const companyName = companyInfo.name || '';
    const companyNameWidth = boldFont.widthOfTextAtSize(companyName, headerFontSize);
    const logoAndNameWidth = logoDims.width + companyNameWidth + 5;
    const companyInfoX = (width - logoAndNameWidth) / 2;

    page.drawImage(logoImage, {
        x: companyInfoX,
        y: currentY - logoDims.height + 2,
        width: logoDims.width,
        height: logoDims.height,
    });

    page.drawText(companyName, {
        x: companyInfoX + logoDims.width + 5,
        y: currentY - headerFontSize + 2,
        size: headerFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    currentY -= (Math.max(logoDims.height, headerFontSize) + lineHeight * 0.5);

    const cifText = companyInfo.cif_dni_nie || '';
    const cifWidth = font.widthOfTextAtSize(cifText, fontSize);
    page.drawText(cifText, {
        x: (width - cifWidth) / 2,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;

    const companyAddressDetails = `${companyInfo.address || ''} - ${companyInfo.cp || ''} ${companyInfo.city || ''} - ${companyInfo.province || ''}`;
    const companyAddressWidth = font.widthOfTextAtSize(companyAddressDetails, fontSize);
    page.drawText(companyAddressDetails, {
        x: (width - companyAddressWidth) / 2,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
    });
    currentY -= (lineHeight * 2);

    const headerBottomY = currentY;

    // --- Columnas de Información del Cliente y Envío ---
    let leftColumnCurrentY = headerBottomY;

    page.drawText(`Factura: ${orderData.invoice_number || orderData.order_ref || orderData.id}`, {
        x: leftColumnX,
        y: leftColumnCurrentY,
        size: headerFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    leftColumnCurrentY -= lineHeight;
    page.drawText(`Fecha: ${formatDate(orderData.invoice_date)}`, {
        x: leftColumnX,
        y: leftColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    leftColumnCurrentY -= (lineHeight * 1.5);

    const billingAndShippingStartY = leftColumnCurrentY;

    page.drawText('Datos de Facturación:', {
        x: leftColumnX,
        y: billingAndShippingStartY,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    leftColumnCurrentY -= lineHeight;
    page.drawText(orderData.customer, {
        x: leftColumnX,
        y: leftColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    leftColumnCurrentY -= lineHeight;
    page.drawText(orderData.cif_dni_nie, {
        x: leftColumnX,
        y: leftColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    leftColumnCurrentY -= lineHeight;
    page.drawText(orderData.mailing_address || '', {
        x: leftColumnX,
        y: leftColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    leftColumnCurrentY -= lineHeight;
    page.drawText(`${orderData.mailing_cp || ''} - ${orderData.mailing_city || ''} - ${orderData.mailing_province || ''}`, {
        x: leftColumnX,
        y: leftColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });

    let rightColumnCurrentY = billingAndShippingStartY;

    page.drawText('Datos de Envío:', {
        x: rightColumnX,
        y: rightColumnCurrentY,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    rightColumnCurrentY -= lineHeight;
    page.drawText(orderData.name, {
        x: rightColumnX,
        y: rightColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    rightColumnCurrentY -= lineHeight;
    page.drawText(orderData.address, {
        x: rightColumnX,
        y: rightColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });
    rightColumnCurrentY -= lineHeight;
    page.drawText(`${orderData.cp} - ${orderData.city} - ${orderData.province}`, {
        x: rightColumnX,
        y: rightColumnCurrentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: columnWidth,
    });

    return Math.min(leftColumnCurrentY, rightColumnCurrentY) - regularLineHeight * 1.5;
};

export async function generateInvoicePdf(orderData: Order, companyInfo: CompanyInfo, logoImageBytes:ArrayBuffer, ivaRate: number): Promise<Blob> {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const logoImage = await pdfDoc.embedPng(logoImageBytes);

    const lineHeight = 12;
    const fontSize = 9;
    const margin = 50;

    let page = pdfDoc.addPage(PageSizes.A4);
    const { width: pageWidth } = page.getSize(); // Obtener el ancho de la página aquí
    let contentStartY = await drawHeader(page, pdfDoc, orderData, companyInfo, font, boldFont, logoImage);
    let currentY = contentStartY;

    const itemColX = margin;
    const qtyColX = margin + 280; 
    const priceColRight = qtyColX + 50 + 60;
    const subtotalColRight = priceColRight + 70;
    const tableRightX = subtotalColRight;

    page.drawText('Producto', { x: itemColX, y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
    page.drawText('Cant.', { x: qtyColX, y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
    page.drawText('Precio', { x: priceColRight - font.widthOfTextAtSize('Precio', fontSize), y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
    page.drawText('Subtotal', { x: subtotalColRight - font.widthOfTextAtSize('Subtotal', fontSize), y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
    currentY -= lineHeight * 0.8;
    page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: tableRightX, y: currentY },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
    });
    currentY -= lineHeight;

    let totalBaseSinIva = 0;

    for (const item of orderData.order_items) {
        if (currentY < margin + lineHeight * 5) { 
            page = pdfDoc.addPage(PageSizes.A4);
            contentStartY = await drawHeader(page, pdfDoc, orderData, companyInfo, font, boldFont, logoImage);
            currentY = contentStartY;
            page.drawText('Producto', { x: itemColX, y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
            page.drawText('Cant.', { x: qtyColX, y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
            page.drawText('Precio', { x: priceColRight - font.widthOfTextAtSize('Precio', fontSize), y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
            page.drawText('Subtotal', { x: subtotalColRight - font.widthOfTextAtSize('Subtotal', fontSize), y: currentY, size: fontSize, font: boldFont, color: rgb(0,0,0) });
            currentY -= lineHeight * 0.8;
            page.drawLine({
                start: { x: margin, y: currentY },
                end: { x: tableRightX, y: currentY },
                thickness: 0.5,
                color: rgb(0.5, 0.5, 0.5),
            });
            currentY -= lineHeight;
        }

        const productName = item.product_name || 'N/A';
        const quantity = item.quantity || 0;
        const priceWithIva = typeof item.price === 'number' ? item.price : 0;
        const priceWithoutIva = priceWithIva / (1 + ivaRate / 100);
        const subtotalWithoutIva = quantity * priceWithoutIva;
        totalBaseSinIva += subtotalWithoutIva;

        let displayProductName = productName;
        const maxProductNameWidth = qtyColX - itemColX - 10; 
        let nameWidth = font.widthOfTextAtSize(displayProductName, fontSize);
        while (nameWidth > maxProductNameWidth && displayProductName.length > 3) {
            displayProductName = displayProductName.substring(0, displayProductName.length - 4) + "...";
            nameWidth = font.widthOfTextAtSize(displayProductName, fontSize);
        }

        page.drawText(displayProductName, { x: itemColX, y: currentY, size: fontSize, font: font, color: rgb(0,0,0) });
        page.drawText(quantity.toString(), { x: qtyColX + 10, y: currentY, size: fontSize, font: font, color: rgb(0,0,0) });
        
        const priceText = formatCurrency(priceWithoutIva);
        const priceTextWidth = font.widthOfTextAtSize(priceText, fontSize);
        page.drawText(priceText, { x: priceColRight - priceTextWidth, y: currentY, size: fontSize, font: font, color: rgb(0,0,0) });

        const subtotalText = formatCurrency(subtotalWithoutIva);
        const subtotalTextWidth = font.widthOfTextAtSize(subtotalText, fontSize);
        page.drawText(subtotalText, { x: subtotalColRight - subtotalTextWidth, y: currentY, size: fontSize, font: font, color: rgb(0,0,0) });
        currentY -= lineHeight;
    }
    
    page.drawLine({ 
        start: { x: margin, y: currentY + (lineHeight * 0.5) }, 
        end: { x: tableRightX, y: currentY + (lineHeight * 0.5) },
        thickness: 0.5,
        color: rgb(0.5, 0.5, 0.5),
    });
    const itemsTableBottomY = currentY; // Nombre de variable corregido
    currentY -= (lineHeight * 0.5);

    if (currentY < margin + lineHeight * 4) { 
        page = pdfDoc.addPage(PageSizes.A4);
        contentStartY = await drawHeader(page, pdfDoc, orderData, companyInfo, font, boldFont, logoImage);
        currentY = contentStartY;
    }
    
    currentY = itemsTableBottomY - lineHeight * 2; // Espacio después de la tabla, usando la Y corregida

    const totalIvaAmount = totalBaseSinIva * (ivaRate / 100);
    const totalConIva = orderData.total;

    const valueRightAlignX = pageWidth - margin - 30;
    const labelRightAlignX = valueRightAlignX - 70; // Espacio para los valores

    // Total Base Imponible
    let text = `Total Base Imponible:`;
    let textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
        x: labelRightAlignX - textWidth,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
    });
    let formattedValue = formatCurrency(totalBaseSinIva);
    textWidth = boldFont.widthOfTextAtSize(formattedValue, fontSize);
    page.drawText(formattedValue, {
        x: valueRightAlignX - textWidth,
        y: currentY,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    currentY -= lineHeight;

    // IVA
    text = `IVA (${ivaRate}%):`;
    textWidth = font.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
        x: labelRightAlignX - textWidth,
        y: currentY,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
    });
    formattedValue = formatCurrency(totalIvaAmount);
    textWidth = boldFont.widthOfTextAtSize(formattedValue, fontSize);
    page.drawText(formattedValue, {
        x: valueRightAlignX - textWidth,
        y: currentY,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    currentY -= lineHeight * 1.5;

    // Total
    text = `Total:`;
    const totalFontSize = fontSize + 1;
    textWidth = boldFont.widthOfTextAtSize(text, totalFontSize);
    page.drawText(text, {
        x: labelRightAlignX - textWidth,
        y: currentY,
        size: totalFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    formattedValue = formatCurrency(totalConIva);
    textWidth = boldFont.widthOfTextAtSize(formattedValue, totalFontSize);
    page.drawText(formattedValue, {
        x: valueRightAlignX - textWidth,
        y: currentY,
        size: totalFontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
}
