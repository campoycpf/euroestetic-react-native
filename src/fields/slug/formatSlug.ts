import type { FieldHook } from 'payload'

export const formatSlug = (val: string): string =>
  val
    .replace(/ /g, '_').replace(/[áéíóúÁÉÍÓÚüÜñÑ-]/g, function(match) {
    switch (match) {
      case 'á': return 'a';
      case 'é': return 'e';
      case 'í': return 'i';
      case 'ó': return 'o';
      case 'ú': return 'u';
      case 'Á': return 'A';
      case 'É': return 'E';
      case 'Í': return 'I';
      case 'Ó': return 'O';
      case 'Ú': return 'U';
      case 'ü': return 'u';
      case 'Ü': return 'U';
      case 'ñ': return 'n';
      case 'Ñ': return 'N';
      case '-': return '_';
      default: return match;
    }}).replace(/[^\w-]+/g, '')
    .toLowerCase()

export const formatSlugHook =
  (fallback: string): FieldHook =>
  ({ data, operation, originalDoc, value }) => {
    if (typeof value === 'string') {
      return formatSlug(value)
    }

    if (operation === 'create' || !data?.slug) {
      const fallbackData = data?.[fallback] || data?.[fallback]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData)
      }
    }

    return value
  }
