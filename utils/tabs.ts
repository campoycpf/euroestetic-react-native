export const homeTabs = [
    {
      label: 'Mis Datos',
      path: '/dashboard/user-data',
      icon: '/user_data.png'
    },
    {
      label: 'Mis Pedidos',
      path: '/dashboard/orders',
      icon: '/orders.png'
    },
    {
      label: 'Mis Facturas',
      path: '/dashboard/invoices',
      icon: '/invoices.png'
    },
    {
      label: 'Ver carrito',
      path: '/dashboard/cart',
      icon: '/cart2.png'
    }
  ]
export const tabs = [
    {
        label: 'Home',
        path: '/dashboard',
        icon: '/home.png'
    },
   ...homeTabs
  ]