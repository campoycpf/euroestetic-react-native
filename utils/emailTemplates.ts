import { User } from "@/payload-types"

export const verificationEmailHTML = ({ token, user }: { token: string; user: User }) => {
  const url =  process.env.NEXT_PUBLIC_SERVER_URL as string 
  let verificationUrl = `${url}/verify?token=${token}&email=${user.email}`
  verificationUrl = user.role !== 'pro' ? verificationUrl : verificationUrl + '&role=pro'
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu cuenta - Euro Estetic</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: solid 1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            padding: 25px 15px;
            text-align: center;
        }
        .logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 15px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content {
            padding: 25px 20px;
            line-height: 1.5;
            text-align: center;
        }
        .verification-title {
            color: #0a1946;
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: 600;
        }
        .verification-text {
            font-size: 14px;
            margin-bottom: 20px;
            color: #555;
            line-height: 1.4;
        }
        .verification-button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            color: #ffffff;
            text-decoration: none;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin: 15px 0;
            transition: transform 0.3s ease;
        }
        .verification-button a {
            color: #ffffff;
        }
        .verification-button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }
        .token-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 3px solid #0a1946;
        }
        .footer {
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            color: #ffffff;
            padding: 20px 15px;
            text-align: center;
            font-size: 12px;
        }
        .footer a {
            color: #ffffff;
            text-decoration: none;
            opacity: 0.8;
        }
        .footer a:hover {
            opacity: 1;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                margin: 0 !important;
            }
            .content {
                padding: 15px !important;
            }
            .header {
                padding: 20px 15px !important;
            }
            .header h1 {
                font-size: 18px !important;
            }
            .verification-title {
                font-size: 18px !important;
            }
            .verification-text {
                font-size: 13px !important;
                margin-bottom: 15px !important;
            }
            .verification-button {
                padding: 10px 25px !important;
                font-size: 13px !important;
            }
            .token-info {
                padding: 12px !important;
                margin: 15px 0 !important;
            }
            .token-info p {
                font-size: 12px !important;
                margin: 0 !important;
            }
            .logo {
                max-width: 100px !important;
            }
        }
        /* Gmail específico */
        @media screen and (max-width: 480px) {
            .verification-text {
                font-size: 12px !important;
            }
            .header h1 {
                font-size: 16px !important;
            }
            .verification-title {
                font-size: 16px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="/logo-white.png" alt="Euro Estetic Logo" class="logo">
            <h1>Euro Estetic</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="verification-title">🔐 Verifica tu cuenta</h2>
            
            <p class="verification-text">
                Hola${user.name ? ` ${user.name}` : ''},<br><br>
                Gracias por registrarte en Euro Estetic. Para completar tu registro y acceder a todas nuestras funcionalidades, 
                necesitamos verificar tu dirección de correo electrónico.
            </p>

            <p class="verification-text">
                Haz clic en el botón de abajo para verificar tu cuenta:
            </p>

            <a href="${verificationUrl}" class="verification-button" style="color:white">
                Verificar mi cuenta
            </a>

            <div class="token-info">
                <p style="margin: 0; font-size: 12px; color: #666;">
                    <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas por motivos de seguridad.
                    Si no verificas tu cuenta en este tiempo, deberás solicitar un nuevo enlace de verificación.
                </p>
            </div>

            <p class="verification-text" style="font-size: 12px; color: #888;">
                Si no puedes hacer clic en el botón, copia y pega este enlace en tu navegador:<br>
                <a href="${verificationUrl}" style="color: #0a1946; word-break: break-all;">${verificationUrl}</a>
            </p>

            <p class="verification-text" style="font-size: 12px; color: #888;">
                Si no te has registrado en Euro Estetic, puedes ignorar este email de forma segura.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                © 2025 Euro Estetic. Todos los derechos reservados.<br>
                <a href="#">Política de Privacidad</a> | 
                <a href="#">Términos y Condiciones</a> | 
                <a href="#">Contacto</a>
            </p>
        </div>
    </div>
</body>
</html>
`
}

export const welcomeEmailHTML = (user: User) => {
  const url =  process.env.NEXT_PUBLIC_SERVER_URL as string 
  const loginUrl = `${url}/login?email=${user.email}`
  const shopUrl = `${url}/list`
  const isActivated = user.activated
  const isPro = user.role === 'pro'
  return `
   <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Euro Estetic</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: solid 1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            padding: 25px 15px;
            text-align: center;
        }
        .logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 15px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content {
            padding: 25px 20px;
            line-height: 1.5;
        }
        .welcome-title {
            color: #0a1946;
            font-size: 20px;
            margin-bottom: 15px;
            text-align: center;
            font-weight: 600;
        }
        .welcome-text {
            font-size: 14px;
            margin-bottom: 20px;
            text-align: center;
            color: #555;
            line-height: 1.4;
        }
        .user-info {
            background-color: #e8f4fd;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .user-info h3 {
            color: #0a1946;
            margin-top: 0;
            margin-bottom: 8px;
            font-size: 14px;
        }
        .user-info p {
            margin: 4px 0;
            color: #555;
            font-size: 12px;
        }
        .benefits {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .benefits h3 {
            color: #0a1946;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .benefits ul {
            margin: 0;
            padding-left: 15px;
        }
        .benefits li {
            margin-bottom: 6px;
            color: #555;
            font-size: 13px;
        }
        .cta-button {
            display: block;
            width: 180px;
            margin: 20px auto;
            padding: 12px 25px;
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            color: #ffffff;
            text-decoration: none;
            border-radius: 20px;
            text-align: center;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }
        .footer {
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            color: #ffffff;
            padding: 20px 15px;
            text-align: center;
            font-size: 12px;
        }
        .footer a {
            color: #ffffff;
            text-decoration: none;
            opacity: 0.8;
        }
        .footer a:hover {
            opacity: 1;
        }
        .social-links {
            margin: 15px 0;
        }
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #ffffff;
            font-size: 16px;
            text-decoration: none;
            opacity: 0.8;
        }
        .social-links a:hover {
            opacity: 1;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                margin: 0 !important;
            }
            .content {
                padding: 15px !important;
            }
            .header {
                padding: 20px 15px !important;
            }
            .header h1 {
                font-size: 18px !important;
            }
            .welcome-title {
                font-size: 18px !important;
            }
            .welcome-text {
                font-size: 13px !important;
            }
            .user-info {
                padding: 12px !important;
            }
            .user-info h3 {
                font-size: 13px !important;
            }
            .user-info p {
                font-size: 11px !important;
            }
            .benefits {
                padding: 12px !important;
            }
            .benefits h3 {
                font-size: 14px !important;
            }
            .benefits li {
                font-size: 12px !important;
            }
            .cta-button {
                width: 160px !important;
                padding: 10px 20px !important;
                font-size: 13px !important;
            }
            .logo {
                max-width: 100px !important;
            }
        }
        /* Gmail específico */
        @media screen and (max-width: 480px) {
            .welcome-text {
                font-size: 12px !important;
            }
            .header h1 {
                font-size: 16px !important;
            }
            .welcome-title {
                font-size: 16px !important;
            }
            .benefits li {
                font-size: 11px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="${url}/logo-white.png" alt="Euro Estetic Logo" class="logo">
            <h1>Euro Estetic</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="welcome-title">¡Bienvenido/a a Euro Estetic${user.name ? `, ${user.name}` : ''}!</h2>
            
            <p class="welcome-text">
                Nos complace darte la bienvenida a nuestra familia de belleza y cuidado personal. 
                Has dado el primer paso hacia una experiencia de compra única en productos de cosmética y estética.
            </p>

            <!-- User Information -->
            <div class="user-info">
                <h3>📋 Información de tu cuenta:</h3>
                ${user.name ? `<p><strong>Nombre:</strong> ${[user.name].filter(Boolean).join(' ')}</p>` : ''}
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Fecha de registro:</strong> ${new Date(user.createdAt).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
                <p><strong>Estado de la cuenta:</strong> ${isActivated ? '<span style="color: #28a745; font-weight: 600;">Activa</span></p>':'<span style="color: red; font-weight: 600;">Inactiva</span></p>'}
            </div>

            <div class="benefits">
                <h3>🌟 ¿Qué puedes esperar de nosotros?</h3>
                <ul>
                    <li>✨ Productos de las mejores marcas internacionales</li>
                    <li>🚚 Envío rápido y seguro a toda España</li>
                    <li>💎 Ofertas exclusivas para miembros</li>
                    <li>👥 Atención al cliente personalizada</li>
                    <li>🎁 Promociones especiales y descuentos</li>
                </ul>
            </div>
            ${!isActivated && isPro ? `<p style="color: #0a1946; font-weight: 600; margin-top: 15px; font-size: 13px;">Hemos recibido tu solicitud de cuenta de Profesional. Tu cuenta se activará en el momento que examinemos tu certificado. En Breve recibirás nuestra respuesta</p>` +
                '<a href="' + shopUrl + '" class="cta-button" style="color:white">Visita nuestra tienda</a>'
                :''
            }
            ${isActivated ? '<p class="welcome-text">' +
            '<p class="welcome-text">' +
                'Tu cuenta ya está activa y lista para usar. Explora nuestro catálogo y descubre' + 
                'los productos que transformarán tu rutina de belleza.' +
            '</p>' + 
            '<a href="' + loginUrl + '" class="cta-button" style="color:white">Comenzar a Comprar</a>'
            :''
            }        
            

            

            <p style="text-align: center; color: #888; font-size: 12px; margin-top: 25px;">
                Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            
            <p>
                © 2025 Euro Estetic. Todos los derechos reservados.<br>
                <a href="#">Política de Privacidad</a> | 
                <a href="#">Términos y Condiciones</a> | 
                <a href="#">Contacto</a>
            </p>
            
            <p style="font-size: 11px; color: #bdc3c7; margin-top: 10px;">
                Has recibido este email porque te has registrado en Euro Estetic.<br>
            </p>
        </div>
    </div>
</body>
</html>
`
}

export const orderConfirmationEmailHTML = (order: any, user: any) => {
  const url = process.env.NEXT_PUBLIC_SERVER_URL as string
  const ordersUrl = `${url}/dashboard/orders`
  const ivaAmount = order.total_iva || 0
  const total = order.total || 0
  const subtotal = total - ivaAmount
  
  // Determinar título, mensaje y color según el estado
  let title = '🛍️ ¡Pedido Confirmado!'
  let message = 'Gracias por tu pedido en Euro Estetic. Hemos recibido tu solicitud y la estamos procesando.'
  let statusText = 'Recibido'
  let statusColor = '#28a745' // verde
  
  if (order.status === 'T') {
    title = '🚚 ¡Pedido en Tránsito!'
    message = 'Tu pedido está en camino. Pronto recibirás tus productos de Euro Estetic.'
    statusText = 'En tránsito'
    statusColor = '#ffc107' // amarillo
  } else if (order.status === 'E') {
    title = '✅ ¡Pedido Entregado!'
    message = 'Tu pedido ha sido entregado. Esperamos que disfrutes de tus productos Euro Estetic.'
    statusText = 'Entregado'
    statusColor = '#0a1946' // azul corporativo
  }
  
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Pedido - Euro Estetic</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f8f9fa;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: solid 1px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            padding: 25px 15px;
            text-align: center;
        }
        .logo {
            max-width: 120px;
            height: auto;
            margin-bottom: 15px;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 22px;
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content {
            padding: 25px 20px;
            line-height: 1.5;
        }
        .order-title {
            color: #0a1946;
            font-size: 20px;
            margin-bottom: 15px;
            text-align: center;
            font-weight: 600;
        }
        .order-text {
            font-size: 14px;
            margin-bottom: 20px;
            text-align: center;
            color: #555;
            line-height: 1.4;
        }
        .order-info {
            background-color: #e8f4fd;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 3px solid #0a1946;
        }
        .order-info h3 {
            color: #0a1946;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .order-info p {
            margin: 6px 0;
            color: #555;
            font-size: 12px;
        }
        .order-items {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .order-items h3 {
            color: #0a1946;
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 16px;
        }
        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .item:last-child {
            border-bottom: none;
        }
        .item-details {
            width: 50%;
            flex: 1;
        }
        .item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 3px;
            font-size: 13px;
        }
        .item-quantity {
            color: #666;
            font-size: 12px;
        }
        .item-price {
            font-weight: 600;
            color: #0a1946;
            width: 50%;
            text-align: right;
            font-size: 13px;
        }
        .order-summary {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
            border: 2px solid #0a1946;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
            font-size: 12px;
        }
        .summary-row.total {
            font-weight: 600;
            font-size: 14px;
            color: #0a1946;
            border-top: 1px solid #dee2e6;
            padding-top: 6px;
            margin-top: 8px;
        }
        .cta-button {
            display: block;
            width: 180px;
            margin: 20px auto;
            padding: 12px 25px;
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            color: #ffffff;
            text-decoration: none;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            transition: transform 0.3s ease;
        }
        .cta-button:hover {
            transform: translateY(-2px);
            opacity: 0.9;
        }
        .footer {
            background: linear-gradient(to right, #0a1946, rgba(10, 25, 70, 0.9), rgba(10, 25, 70, 0.7));
            color: #ffffff;
            padding: 20px 15px;
            text-align: center;
            font-size: 12px;
        }
        .footer a {
            color: #ffffff;
            text-decoration: none;
            opacity: 0.8;
        }
        .footer a:hover {
            opacity: 1;
        }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                margin: 0 !important;
            }
            .content {
                padding: 15px !important;
            }
            .header {
                padding: 20px 15px !important;
            }
            .header h1 {
                font-size: 18px !important;
            }
            .order-title {
                font-size: 18px !important;
            }
            .order-text {
                font-size: 13px !important;
            }
            .order-info {
                padding: 12px !important;
            }
            .order-info h3 {
                font-size: 14px !important;
            }
            .order-info p {
                font-size: 11px !important;
            }
            .order-items {
                padding: 12px !important;
            }
            .order-items h3 {
                font-size: 14px !important;
            }
            .item {
                flex-direction: column;
                align-items: flex-start;
                padding: 6px 0 !important;
            }
            .item-name {
                font-size: 12px !important;
            }
            .item-quantity {
                font-size: 11px !important;
            }
            .item-price {
                margin-top: 6px;
                font-size: 12px !important;
                text-align: left !important;
            }
            .order-summary {
                padding: 12px !important;
            }
            .summary-row {
                font-size: 11px !important;
            }
            .summary-row.total {
                font-size: 12px !important;
            }
            .cta-button {
                width: 160px !important;
                padding: 10px 20px !important;
                font-size: 13px !important;
            }
            .logo {
                max-width: 100px !important;
            }
        }
        /* Gmail específico */
        @media screen and (max-width: 480px) {
            .order-text {
                font-size: 12px !important;
            }
            .header h1 {
                font-size: 16px !important;
            }
            .order-title {
                font-size: 16px !important;
            }
            .item-name {
                font-size: 11px !important;
            }
            .item-quantity {
                font-size: 10px !important;
            }
            .item-price {
                font-size: 11px !important;
            }
            .summary-row {
                font-size: 10px !important;
            }
            .summary-row.total {
                font-size: 11px !important;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="${url}/logo-white.png" alt="Euro Estetic Logo" class="logo">
            <h1>Euro Estetic</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2 class="order-title">${title}</h2>
            
            <p class="order-text">
                Hola${user?.name ? ` ${user.name}` : ''},<br><br>
                ${message}
                ${order.status === 'R' ? 'Te enviaremos actualizaciones sobre el estado de tu pedido.' : ''}
            </p>

            <!-- Order Information -->
            <div class="order-info">
                <h3>📋 Detalles del pedido:</h3>
                <p><strong>Número de Factura:</strong> ${order.invoice_number || 'Pendiente'}</p>
                <p><strong>Fecha del pedido:</strong> ${new Date(order.createdAt).toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                })}</p>
                <p><strong>Estado:</strong> <span style="color: ${statusColor}; font-weight: 600;">${statusText}</span></p>
                ${order.shipping_address ? `
                <p><strong>Dirección de envío:</strong><br>
                ${order.shipping_address.name}<br>
                ${order.shipping_address.address}<br>
                ${order.shipping_address.postal_code} ${order.shipping_address.city}<br>
                ${order.shipping_address.province}</p>
                ` : ''}
            </div>

            <!-- Order Items -->
            <div class="order-items">
                <h3>🛒 Productos Pedidos</h3>
                ${order.order_items?.map((item: any) => `
                    <div class="item" style="justify-content:space-between">
                        <div class="item-details">
                            <div class="item-name">${item.product_name}</div>
                            <div class="item-quantity">Cantidad: ${item.quantity}</div>
                        </div>
                        <div class="item-price">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                `).join('') || '<p>No hay productos en este pedido</p>'}
            </div>

            <!-- Order Summary -->
            <div class="order-summary">
                <h3 style="color: #0a1946; margin-top: 0; margin-bottom: 15px;">💰 Resumen del Pedido</h3>
                <div class="summary-row">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}€</span>
                </div>
                <div class="summary-row">
                    <span>IVA (${order.iva || 21}%):</span>
                    <span>${ivaAmount.toFixed(2)}€</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}€</span>
                </div>
            </div>

            ${order.mailing_address ? `
            <div class="order-info">
                <h3>📦 Dirección de Envío</h3>
                <p>${order.name || order.customer}</p>
                <p>${order.address || order.mailing_address}</p>
                <p>${order.city || order.mailing_city}, ${order.cp || order.mailing_cp}</p>
                <p>${order.province || order.mailing_province}</p>
            </div>
            ` : ''}

            <p class="order-text">
                ${order.status === 'E' ? 'Gracias por confiar en Euro Estetic. ¡Esperamos que disfrutes de tus productos!' : 'Puedes consultar el estado de tu pedido en cualquier momento accediendo a tu cuenta.'}
            </p>

            <a href="${ordersUrl}" class="cta-button" style="color:white;text-align:center">Ver mis Pedidos</a>

            <p style="text-align: center; color: #888; font-size: 14px; margin-top: 30px;">
                Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            
            <p>
                © 2025 Euro Estetic. Todos los derechos reservados.<br>
                <a href="#">Política de Privacidad</a> | 
                <a href="#">Términos y Condiciones</a> | 
                <a href="#">Contacto</a>
            </p>
            
            <p style="font-size: 12px; color: #bdc3c7; margin-top: 15px;">
                Has recibido este email porque te has registrado en Euro Estetic.<br>
            </p>
        </div>
    </div>
</body>
</html>
`
}