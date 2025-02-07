export type PresetType = 
  | 'premium'
  | 'lifestyle'
  | 'corporate'
  | 'editorial'
  | 'product'
  | 'social'
  | 'documentary';

export interface StylePreset {
  name: string;
  description: string;
  promptModifiers: string[];
  params: {
    cfgScale: number;
    steps: number;
    samples?: number;
    clipGuidancePreset?: string;
    sampler?: string;
  };
  requirements?: {
    minWidth?: number;
    minHeight?: number;
    aspectRatio?: number;
  };
}

const PRESET_REQUIREMENTS = {
  premium: {
    minWidth: 1024,
    minHeight: 1024
  },
  product: {
    minWidth: 768,
    minHeight: 768
  }
};

export const STYLE_PRESETS: Record<PresetType, StylePreset> = {
  premium: {
    name: 'Premium',
    description: 'Style haut de gamme et luxueux',
    promptModifiers: [
      'luxury photography',
      'high-end commercial',
      'premium quality',
      'professional lighting',
      'studio quality',
      'cinematic atmosphere',
      'elegant composition',
      'sophisticated mood',
      'pristine quality',
      'flawless execution'
    ],
    params: {
      cfgScale: 12,
      steps: 60,
      samples: 1,
      clipGuidancePreset: 'FAST_BLUE',
      sampler: 'DPM++ 2M Karras'
    },
    requirements: PRESET_REQUIREMENTS.premium
  },
  lifestyle: {
    name: 'Lifestyle',
    description: 'Style naturel et authentique',
    promptModifiers: [
      'lifestyle photography',
      'candid moment',
      'natural lighting',
      'authentic atmosphere',
      'real life scene',
      'genuine emotion',
      'spontaneous capture',
      'environmental context',
      'natural composition',
      'organic feel'
    ],
    params: {
      cfgScale: 9,
      steps: 45,
      samples: 2,
      clipGuidancePreset: 'FAST_BLUE',
      sampler: 'DPM++ SDE Karras'
    }
  },
  corporate: {
    name: 'Corporate',
    description: 'Style professionnel et business',
    promptModifiers: [
      'corporate photography',
      'professional environment',
      'business setting',
      'executive style',
      'corporate atmosphere',
      'professional lighting',
      'clean composition',
      'formal setting',
      'business context',
      'professional mood'
    ],
    params: {
      cfgScale: 10,
      steps: 50,
      samples: 1,
      clipGuidancePreset: 'FAST_BLUE',
      sampler: 'DPM++ 2M Karras'
    }
  },
  editorial: {
    name: 'Editorial',
    description: 'Style magazine et éditorial',
    promptModifiers: [
      'editorial photography',
      'magazine style',
      'fashion lighting',
      'artistic composition',
      'editorial mood',
      'dramatic atmosphere',
      'high fashion',
      'creative lighting',
      'bold composition',
      'artistic direction'
    ],
    params: {
      cfgScale: 11,
      steps: 55,
      samples: 1,
      clipGuidancePreset: 'FAST_BLUE',
      sampler: 'DPM++ SDE Karras'
    }
  },
  product: {
    name: 'Product',
    description: 'Style produit commercial',
    promptModifiers: [
      'product photography',
      'commercial quality',
      'studio lighting',
      'professional product shot',
      'clean background',
      'perfect exposure',
      'sharp details',
      'commercial setting',
      'professional staging',
      'perfect product placement'
    ],
    params: {
      cfgScale: 12,
      steps: 60,
      samples: 1,
      clipGuidancePreset: 'FAST_BLUE',
      sampler: 'DPM++ 2M Karras'
    },
    requirements: PRESET_REQUIREMENTS.product
  },
  social: {
    name: 'Social',
    description: 'Style réseaux sociaux',
    promptModifiers: [
      'social media style',
      'engaging composition',
      'eye-catching design',
      'vibrant mood',
      'trendy look',
      'modern aesthetic',
      'social appeal',
      'contemporary style',
      'dynamic composition',
      'scroll-stopping visual'
    ],
    params: {
      cfgScale: 9,
      steps: 45,
      samples: 2,
      clipGuidancePreset: 'FAST_BLUE',
      sampler: 'DPM++ SDE Karras'
    }
  },
  documentary: {
    name: 'Documentary',
    description: 'Style documentaire et reportage',
    promptModifiers: [
      'documentary style',
      'photojournalistic approach',
      'natural lighting',
      'authentic moment',
      'real environment',
      'storytelling composition',
      'genuine atmosphere',
      'truthful capture',
      'unposed scene',
      'realistic mood'
    ],
    params: {
      cfgScale: 8,
      steps: 40,
      samples: 1,
      clipGuidancePreset: 'FAST_BLUE',
      sampler: 'DPM++ SDE Karras'
    }
  }
};

export const getStylePreset = (
  presetType: PresetType,
  overrideParams?: Partial<StylePreset['params']>
): StylePreset => {
  const preset = STYLE_PRESETS[presetType];
  
  if (!preset) {
    throw new Error(`Style preset "${presetType}" not found`);
  }

  if (overrideParams) {
    return {
      ...preset,
      params: {
        ...preset.params,
        ...overrideParams
      }
    };
  }

  return preset;
};

export const validatePresetRequirements = (
  presetType: PresetType,
  width: number,
  height: number
): boolean => {
  const preset = STYLE_PRESETS[presetType];
  
  if (!preset || !preset.requirements) {
    return true;
  }

  const { requirements } = preset;

  if (requirements.minWidth && width < requirements.minWidth) {
    return false;
  }

  if (requirements.minHeight && height < requirements.minHeight) {
    return false;
  }

  if (requirements.aspectRatio) {
    const currentRatio = width / height;
    const tolerance = 0.1; // 10% de tolérance
    return Math.abs(currentRatio - requirements.aspectRatio) <= tolerance;
  }

  return true;
};

export const getSuggestedPreset = (
  purpose: string,
  sector: string,
  style: string
): PresetType => {
  // Style premium prioritaire
  if (style.toLowerCase().includes('premium')) {
    return 'premium';
  }

  // Selon le but
  switch (purpose.toLowerCase()) {
    case 'product':
      return 'product';
    case 'lifestyle':
      return 'lifestyle';
    case 'social':
      // Pour le secteur bancaire, préférer le style corporate
      if (sector.toLowerCase().includes('banque')) {
        return 'corporate';
      }
      return 'social';
  }

  // Par défaut
  return 'editorial';
};
