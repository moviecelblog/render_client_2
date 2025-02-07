import { BriefData } from '../../types/brief';

export type SectorType = 
  | 'FMCG (Fast-Moving Consumer Goods)' 
  | 'Banque et Finance' 
  | 'Hôtellerie, Restauration et Loisirs' 
  | 'Technologie et Innovation'
  | 'Biens de consommation'
  | 'Automobile'
  | 'Industrie Manufacturière';

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface PromptValidation {
  isValid: boolean;
  errors: string[];
}

export interface StabilityParams {
  cfgScale: number;
  steps: number;
  samples: number;  // Rendu obligatoire
  clipGuidancePreset?: string;
  sampler?: string;
}

const QUALITY_MODIFIERS = [
  'masterpiece',
  'best quality',
  'highly detailed',
  'sharp focus',
  'professional photography',
  '8k uhd',
  'award winning',
  'stunning',
  'perfect composition',
  'cinematic lighting'
];

const TECHNICAL_MODIFIERS = [
  'raw photo',
  'high resolution',
  'detailed',
  'sharp',
  'professional',
  'commercial photography',
  'advertising quality'
];

export const validatePrompt = (prompt: string, briefData: BriefData): PromptValidation => {
  const errors: string[] = [];

  // Vérification de la longueur
  if (prompt.length < 10) {
    errors.push('Prompt trop court');
  }

  // Vérification des mots-clés essentiels
  const essentialKeywords = ['quality', 'professional', 'detailed'];
  essentialKeywords.forEach(keyword => {
    if (!prompt.toLowerCase().includes(keyword)) {
      errors.push(`Le prompt devrait inclure le mot-clé "${keyword}"`);
    }
  });

  // Vérification des éléments spécifiques au secteur
  if (briefData.sector && !prompt.toLowerCase().includes(briefData.sector.toLowerCase())) {
    errors.push('Le prompt devrait inclure des éléments spécifiques au secteur');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const optimizePromptForStability = (prompt: string): string => {
  // Optimisations spécifiques pour SDXL
  const optimizedPrompt = prompt
    .replace(/\s+/g, ' ') // Normalise les espaces
    .replace(/^\s+|\s+$/g, '') // Trim
    .replace(/(?:^|\s)(?:a\s+|an\s+|the\s+)/g, ' ') // Supprime les articles inutiles
    .replace(/\b(?:very|really|extremely)\s+/g, '') // Supprime les intensifieurs inutiles
    .trim();

  // Ajouter les modificateurs de qualité au début
  const qualityPrefix = QUALITY_MODIFIERS.join(', ');
  
  // Ajouter les modificateurs techniques à la fin
  const technicalSuffix = TECHNICAL_MODIFIERS.join(', ');

  return `${qualityPrefix}, ${optimizedPrompt}, ${technicalSuffix}`;
};

export const getDimensions = (
  purpose: 'social' | 'product' | 'lifestyle' | 'banner',
  platform?: string,
  hasLegalText: boolean = false
): ImageDimensions => {
  let dimensions: ImageDimensions = { width: 1024, height: 1024 }; // Default square optimisé pour SDXL

  switch (purpose) {
    case 'social':
      if (platform) {
        dimensions = getSocialDimensions(platform);
      }
      break;
    case 'product':
      dimensions = { width: 1024, height: 1024 }; // Portrait pour produits
      break;
    case 'lifestyle':
      dimensions = { width: 1024, height: 768 }; // Format 4:3 pour lifestyle
      break;
    case 'banner':
      dimensions = { width: 1024, height: 512 }; // Format 2:1 pour bannières
      break;
  }

  // Ajuster pour le texte légal si nécessaire
  if (hasLegalText) {
    dimensions.height = Math.floor(dimensions.height * 1.2);
  }

  // S'assurer que les dimensions sont valides pour SDXL
  return validateDimensions(dimensions);
};

const getSocialDimensions = (platform: string): ImageDimensions => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return { width: 1024, height: 1024 }; // Format carré
    case 'facebook':
      return { width: 1024, height: 640 }; // Format 16:10
    case 'linkedin':
      return { width: 1024, height: 576 }; // Format 16:9
    case 'twitter':
      return { width: 1024, height: 512 }; // Format 2:1
    default:
      return { width: 1024, height: 1024 };
  }
};

const validateDimensions = (dimensions: ImageDimensions): ImageDimensions => {
  // SDXL requiert des dimensions multiples de 64
  const roundTo64 = (num: number): number => Math.round(num / 64) * 64;
  
  // Limiter les dimensions maximales pour SDXL
  const maxDim = 1024; // Maximum supporté par SDXL
  const minDim = 512;  // Minimum supporté par SDXL
  
  let width = Math.min(Math.max(roundTo64(dimensions.width), minDim), maxDim);
  let height = Math.min(Math.max(roundTo64(dimensions.height), minDim), maxDim);
  
  return { width, height };
};

export const getStabilityParams = (
  briefData: BriefData,
  purpose: string
): StabilityParams => {
  // Paramètres optimisés pour SDXL
  const baseParams: StabilityParams = {
    cfgScale: 10,    // Augmenté pour plus de fidélité
    steps: 50,       // Plus de steps pour plus de détails
    samples: 1,      // Valeur par défaut
    clipGuidancePreset: 'FAST_BLUE',
    sampler: 'DPM++ 2M Karras'
  };

  // Ajustements selon le secteur
  switch (briefData.sector as SectorType) {
    case 'FMCG (Fast-Moving Consumer Goods)':
      baseParams.cfgScale = 12;  // Produits nécessitent plus de détails
      baseParams.steps = 60;
      break;
    case 'Banque et Finance':
      baseParams.cfgScale = 11;  // Images corporate plus précises
      baseParams.steps = 55;
      break;
    case 'Hôtellerie, Restauration et Loisirs':
      baseParams.cfgScale = 9;   // Plus de créativité
      baseParams.steps = 45;
      break;
  }

  // Ajustements selon l'utilisation
  switch (purpose) {
    case 'product':
      baseParams.cfgScale += 2;
      baseParams.steps += 10;
      break;
    case 'lifestyle':
      baseParams.cfgScale -= 1;
      baseParams.steps -= 5;
      break;
    case 'social':
      baseParams.steps -= 10;
      baseParams.samples = 2;  // Générer plus d'options pour le social
      break;
  }

  // Ajustements selon le budget
  const budgetAllocation = briefData.budget.allocation['Photo/Vidéo'] || 0;
  if (budgetAllocation > 30) {
    baseParams.steps += 10;
    baseParams.samples = Math.min(baseParams.samples + 1, 3);
  }

  return baseParams;
};

export const formatPromptForStability = (
  mainPrompt: string,
  negativePrompt?: string
): { prompt: string; negative_prompt?: string } => {
  const formattedPrompt = optimizePromptForStability(mainPrompt);
  
  // Negative prompt optimisé pour SDXL
  const defaultNegative = [
    'blurry', 'low quality', 'low resolution', 'jpeg artifacts',
    'compression artifacts', 'amateur', 'unprofessional',
    'oversaturated', 'undersaturated', 'distorted proportions',
    'unrealistic anatomy', 'deformed', 'bad composition',
    'watermark', 'text', 'writing', 'signature', 'logo',
    'out of frame', 'cropped', 'worst quality', 'normal quality',
    'jpeg artifacts', 'signature', 'watermark', 'username',
    'blurry', 'artist name', 'trademark', 'title',
    'multiple views', 'extra digit', 'fewer digits',
    'poorly drawn face', 'out of frame', 'poorly drawn hands',
    'text', 'error', 'missing fingers', 'extra digit',
    'fewer digits', 'cropped', 'worst quality'
  ].join(', ');
  
  return {
    prompt: formattedPrompt,
    negative_prompt: negativePrompt 
      ? `${defaultNegative}, ${negativePrompt}`
      : defaultNegative
  };
};

export const extractVisualElements = (briefData: BriefData): string[] => {
  const elements: string[] = [];

  // Extraire les éléments visuels des campagnes précédentes
  briefData.previousCampaigns.forEach(campaign => {
    campaign.learnings
      .filter(learning => learning.toLowerCase().includes('visuel'))
      .forEach(learning => elements.push(learning));
  });

  // Ajouter les différenciateurs visuels
  briefData.competitiveAnalysis.differentiators
    .filter(diff => diff.toLowerCase().includes('visuel'))
    .forEach(diff => elements.push(diff));

  // Ajouter les éléments de style de communication
  if (briefData.communicationStyle) {
    elements.push(`style: ${briefData.communicationStyle}`);
  }

  // Ajouter les éléments spécifiques au secteur
  if (briefData.sector) {
    elements.push(`sector: ${briefData.sector}`);
  }

  return elements;
};
