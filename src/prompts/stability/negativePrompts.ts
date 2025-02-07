import { SectorType } from './utils';

const BASE_NEGATIVE_PROMPTS = [
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
];

const SECTOR_SPECIFIC_NEGATIVES: Record<SectorType, string[]> = {
  'FMCG (Fast-Moving Consumer Goods)': [
    'damaged packaging',
    'dirty product',
    'incorrect colors',
    'poor lighting on product',
    'inconsistent branding',
    'messy background',
    'unfocused product shot',
    'wrong product angle',
    'poor product placement'
  ],
  'Banque et Finance': [
    'casual attire',
    'unprofessional setting',
    'messy office',
    'inappropriate gestures',
    'poor corporate image',
    'informal atmosphere',
    'cluttered workspace',
    'inappropriate background'
  ],
  'Hôtellerie, Restauration et Loisirs': [
    'dirty environment',
    'poor food presentation',
    'messy tables',
    'unfocused atmosphere',
    'bad lighting',
    'unappealing food',
    'unprofessional service',
    'cluttered space'
  ],
  'Technologie et Innovation': [
    'outdated technology',
    'messy cables',
    'poor screen quality',
    'incorrect device proportions',
    'unrealistic interfaces',
    'poor lighting on devices',
    'incorrect tech details'
  ],
  'Biens de consommation': [
    'poor product finish',
    'incorrect product colors',
    'bad product angles',
    'unrealistic materials',
    'poor lighting on products',
    'incorrect scale',
    'messy presentation'
  ],
  'Automobile': [
    'incorrect car proportions',
    'unrealistic reflections',
    'poor car details',
    'incorrect car features',
    'bad car angles',
    'poor lighting on vehicle',
    'unrealistic materials',
    'incorrect scale'
  ],
  'Industrie Manufacturière': [
    'unsafe conditions',
    'messy workplace',
    'incorrect machinery',
    'poor industrial setting',
    'unrealistic equipment',
    'incorrect scale',
    'poor lighting on machinery'
  ]
};

const STYLE_SPECIFIC_NEGATIVES: Record<string, string[]> = {
  premium: [
    'cheap looking',
    'low budget',
    'poor quality materials',
    'amateur lighting',
    'basic composition',
    'simple background',
    'unrefined details'
  ],
  corporate: [
    'casual setting',
    'unprofessional atmosphere',
    'inappropriate attire',
    'messy environment',
    'poor business context'
  ],
  lifestyle: [
    'posed shots',
    'unnatural poses',
    'forced expressions',
    'artificial setting',
    'unrealistic lifestyle'
  ],
  modern: [
    'outdated style',
    'old fashioned',
    'retro elements',
    'vintage look',
    'classical style'
  ]
};

export const getNegativePromptWithStyle = (
  sector: SectorType,
  style: string
): string => {
  const negatives = [...BASE_NEGATIVE_PROMPTS];

  // Ajouter les prompts négatifs spécifiques au secteur
  if (SECTOR_SPECIFIC_NEGATIVES[sector]) {
    negatives.push(...SECTOR_SPECIFIC_NEGATIVES[sector]);
  }

  // Ajouter les prompts négatifs spécifiques au style
  const styleKey = Object.keys(STYLE_SPECIFIC_NEGATIVES).find(
    key => style.toLowerCase().includes(key.toLowerCase())
  );
  
  if (styleKey && STYLE_SPECIFIC_NEGATIVES[styleKey]) {
    negatives.push(...STYLE_SPECIFIC_NEGATIVES[styleKey]);
  }

  // Ajouter des prompts négatifs pour la qualité professionnelle
  negatives.push(
    'stock photo',
    'generic image',
    'basic photography',
    'amateur composition',
    'poor lighting setup',
    'basic camera angle',
    'unbalanced composition',
    'poor color grading',
    'basic post-processing',
    'amateur photography'
  );

  return negatives.join(', ');
};

export const getExtendedNegativePrompt = (
  sector: SectorType,
  style: string,
  purpose: string
): string => {
  const baseNegative = getNegativePromptWithStyle(sector, style);
  const purposeSpecificNegatives: string[] = [];

  // Ajouter des prompts négatifs spécifiques au but
  switch (purpose.toLowerCase()) {
    case 'product':
      purposeSpecificNegatives.push(
        'poor product visibility',
        'distracting background',
        'incorrect product scale',
        'poor product details',
        'unfocused product',
        'incorrect product color',
        'poor product lighting'
      );
      break;
    case 'lifestyle':
      purposeSpecificNegatives.push(
        'unnatural poses',
        'forced expressions',
        'artificial setting',
        'poor environmental context',
        'unrealistic lifestyle',
        'staged looking'
      );
      break;
    case 'social':
      purposeSpecificNegatives.push(
        'poor social context',
        'unengaging composition',
        'boring layout',
        'poor visual hierarchy',
        'cluttered composition',
        'distracting elements'
      );
      break;
  }

  return purposeSpecificNegatives.length > 0
    ? `${baseNegative}, ${purposeSpecificNegatives.join(', ')}`
    : baseNegative;
};
