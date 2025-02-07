import { SECTOR_CATEGORIES } from '../../constants/formOptions';

export type SectorCategory = 'PHYSICAL_PRODUCTS' | 'PURE_SERVICES' | 'HYBRID';

export function getSectorCategory(sector: string): SectorCategory {
  if (SECTOR_CATEGORIES.PHYSICAL_PRODUCTS.includes(sector)) {
    return 'PHYSICAL_PRODUCTS';
  }
  if (SECTOR_CATEGORIES.PURE_SERVICES.includes(sector)) {
    return 'PURE_SERVICES';
  }
  if (SECTOR_CATEGORIES.HYBRID.includes(sector)) {
    return 'HYBRID';
  }
  return 'PURE_SERVICES'; // Par défaut, traiter comme un service pur
}

export function shouldUseEditMode(sector: string, hasProductPhotos: boolean): boolean {
  const category = getSectorCategory(sector);
  
  switch (category) {
    case 'PHYSICAL_PRODUCTS':
      return hasProductPhotos; // Toujours utiliser edit si des photos sont disponibles
    case 'PURE_SERVICES':
      return false; // Jamais utiliser edit
    case 'HYBRID':
      return hasProductPhotos; // Utiliser edit si des photos sont disponibles
    default:
      return false;
  }
}

export function getPromptPrefix(sector: string): string {
  const category = getSectorCategory(sector);
  
  switch (category) {
    case 'PHYSICAL_PRODUCTS':
      return 'Create a professional product-focused image with';
    case 'PURE_SERVICES':
      return 'Create a professional service-oriented scene showing';
    case 'HYBRID':
      return 'Create a professional scene that combines both service and product elements showing';
    default:
      return 'Create a professional scene showing';
  }
}

export function getPromptSuffix(sector: string): string {
  const category = getSectorCategory(sector);
  
  switch (category) {
    case 'PHYSICAL_PRODUCTS':
      return 'Ensure product details are clear and well-lit, with professional studio-quality lighting and composition.';
    case 'PURE_SERVICES':
      return 'Focus on human interactions, emotions, and professional environment. Ensure natural and authentic expressions.';
    case 'HYBRID':
      return 'Balance both service interactions and physical elements. Maintain professional quality while keeping scene natural.';
    default:
      return 'Maintain professional quality and natural feel throughout the scene.';
  }
}
