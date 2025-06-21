import { Category, Product } from '@/payload-types'
export function buildCategoryTree(data: Category[]): Category[] {
  const map = new Map<number | null, Category[]>();

  data.forEach(category => {
    const parentId = category.parent ? (category.parent as Category).id : null;
    if (!map.has(parentId)) {
      map.set(parentId, []);
    }
    map.get(parentId)?.push(category);
  });

  function buildTree(parentId: null | number, visited = new Set<number>()): Category[] {
    if (parentId !== null && visited.has(parentId)) {
      console.warn(`Ciclo detectado en parentId: ${parentId}`);
      return [];
    }

    if (parentId) {
      visited.add(parentId);
    }
    return (map.get(parentId) || []).map(category => ({
      ...category,
      subcategories: buildTree(category.id, visited),
    }));
  }

  return buildTree(null);
}
export function getCategoryAndSubcategoryIds(slug: string, categories: Category[]): number[] {
  const categoryMap = new Map<number, Category>();

  // Crear un mapa de categorías por ID para acceso rápido
  categories.forEach(category => {
    categoryMap.set(category.id, category);
  });

  // Función recursiva para encontrar la categoría por slug
  function findCategoryBySlug(slug: string, categoryList: Category[]): Category | undefined {
    for (const category of categoryList) {
      if (category.slug === slug) {
        return category;
      }
      if (category.subcategories) {
        const subcategories = category.subcategories.map(sub => typeof sub === 'number' ? categoryMap.get(sub) : sub).filter(Boolean) as Category[];
        const found = findCategoryBySlug(slug, subcategories);
        if (found) return found;
      }
    }
    return undefined;
  }

  const rootCategory = findCategoryBySlug(slug, categories);
  if (!rootCategory) return [];

  const result: number[] = [];

  function collectIds(category: Category) {
    result.push(category.id);
    if (category.subcategories) {
      for (const sub of category.subcategories) {
        const subCategory = typeof sub === 'number' ? categoryMap.get(sub) : sub;
        if (subCategory) {
          collectIds(subCategory);
        }
      }
    }
  }

  collectIds(rootCategory);
  return result;
}
export const CART_COOKIE_NAME = 'euro_cart';
export interface Province {
  label: string;
  value: string;
}
export const PROVINCES: Province[] = [
  { label: 'Álava', value: 'Alava' },
  { label: 'Albacete', value: 'Albacete' },
  { label: 'Alicante', value: 'Alicante' },
  { label: 'Almería', value: 'Almeria' },
  { label: 'Asturias', value: 'Asturias' },
  { label: 'Ávila', value: 'Avila' },
  { label: 'Badajoz', value: 'Badajoz' },
  { label: 'Barcelona', value: 'Barcelona' },
  { label: 'Burgos', value: 'Burgos' },
  { label: 'Cáceres', value: 'Caceres' },
  { label: 'Cádiz', value: 'Cadiz' },
  { label: 'Cantabria', value: 'Cantabria' },
  { label: 'Castellón', value: 'Castellon' },
  { label: 'Ciudad Real', value: 'Ciudad_Real' },
  { label: 'Córdoba', value: 'Cordoba' },
  { label: 'Cuenca', value: 'Cuenca' },
  { label: 'Gerona', value: 'Gerona' },
  { label: 'Granada', value: 'Granada' },
  { label: 'Guadalajara', value: 'Guadalajara' },
  { label: 'Guipúzcoa', value: 'Guipuzcoa' },
  { label: 'Huelva', value: 'Huelva' },
  { label: 'Huesca', value: 'Huesca' },
  { label: 'Islas Baleares', value: 'Baleares' },
  { label: 'Jaén', value: 'Jaen' },
  { label: 'La Coruña', value: 'La_Coruna' },
  { label: 'La Rioja', value: 'La_Rioja' },
  { label: 'Las Palmas', value: 'Las_Palmas' },
  { label: 'León', value: 'Leon' },
  { label: 'Lérida', value: 'Lerida' },
  { label: 'Lugo', value: 'Lugo' },
  { label: 'Madrid', value: 'Madrid' },
  { label: 'Málaga', value: 'Malaga' },
  { label: 'Murcia', value: 'Murcia' },
  { label: 'Navarra', value: 'Navarra' },
  { label: 'Orense', value: 'Orense' },
  { label: 'Palencia', value: 'Palencia' },
  { label: 'Pontevedra', value: 'Pontevedra' },
  { label: 'Salamanca', value: 'Salamanca' },
  { label: 'Santa Cruz de Tenerife', value: 'Tenerife' },
  { label: 'Segovia', value: 'Segovia' },
  { label: 'Sevilla', value: 'Sevilla' },
  { label: 'Soria', value: 'Soria' },
  { label: 'Tarragona', value: 'Tarragona' },
  { label: 'Teruel', value: 'Teruel' },
  { label: 'Toledo', value: 'Toledo' },
  { label: 'Valencia', value: 'Valencia' },
  { label: 'Valladolid', value: 'Valladolid' },
  { label: 'Vizcaya', value: 'Vizcaya' },
  { label: 'Zamora', value: 'Zamora' },
  { label: 'Zaragoza', value: 'Zaragoza' },
]
export const ORDER_STATUSES = [
  { label: 'Recibido', value: 'R' },
  { label: 'En tránsito', value: 'T' },
  { label: 'Entregado', value: 'E' },
];

export const formatCurrency = (amount?: number | null) => {
    if (amount === null || typeof amount === 'undefined') return 'N/A'
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
  
}
export const getPriceProduct = (product: Product) => {
  return product.price_wholesale ? product.price_wholesale : product.price
}
export const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
