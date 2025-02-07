import { BriefData } from '../../types/brief';
import { StabilityParams, SectorType } from './utils';

interface SectorConfig {
  promptModifiers: string[];
  styleGuide: string[];
  technicalParams: StabilityParams;
  restrictions: string[];
}

const sectorConfigs: Record<SectorType, SectorConfig> = {
  "FMCG (Fast-Moving Consumer Goods)": {
    promptModifiers: [
      "professional product photography",
      "lifestyle context",
      "aspirational setting",
      "studio lighting setup",
      "vibrant color grading",
      "high-end commercial photography"
    ],
    styleGuide: [
      "Premium product presentation",
      "Emotional lifestyle integration",
      "High-energy visual impact",
      "Professional studio quality",
      "Contemporary commercial aesthetic"
    ],
    technicalParams: {
      cfgScale: 9,
      steps: 40,
      samples: 1
    },
    restrictions: [
      "Avoid cluttered backgrounds",
      "No extreme close-ups of faces",
      "Maintain product scale accuracy",
      "Keep brand colors consistent"
    ]
  },

  "Banque et Finance": {
    promptModifiers: [
      "corporate photography",
      "professional business environment",
      "modern office setting",
      "clean geometric composition",
      "professional lighting",
      "corporate documentary style"
    ],
    styleGuide: [
      "Professional corporate atmosphere",
      "Modern business aesthetic",
      "Clear visual hierarchy",
      "Minimal precise design",
      "Corporate appropriate imagery"
    ],
    technicalParams: {
      cfgScale: 8.5,
      steps: 40,
      samples: 1
    },
    restrictions: [
      "No excessive luxury displays",
      "Avoid controversial symbols",
      "Maintain professional distance",
      "Follow financial advertising regulations"
    ]
  },

  "Hôtellerie, Restauration et Loisirs": {
    promptModifiers: [
      "hospitality photography",
      "warm ambient lighting",
      "lifestyle documentary",
      "natural authentic moments",
      "cinematic atmosphere",
      "editorial food photography"
    ],
    styleGuide: [
      "Inviting atmosphere capture",
      "Rich color treatment",
      "Authentic moment focus",
      "Natural lighting emphasis",
      "Editorial quality finish"
    ],
    technicalParams: {
      cfgScale: 7.5,
      steps: 40,
      samples: 1
    },
    restrictions: [
      "Maintain food safety standards in visuals",
      "Respect cultural sensitivities",
      "Ensure realistic portion sizes",
      "Follow hospitality regulations"
    ]
  },

  "Technologie et Innovation": {
    promptModifiers: [
      "tech product photography",
      "minimalist composition",
      "studio lighting setup",
      "clean background",
      "professional tech photography",
      "high-end product shot"
    ],
    styleGuide: [
      "Premium tech presentation",
      "Modern minimal aesthetic",
      "Professional studio quality",
      "Technical detail emphasis",
      "Innovation-focused imagery"
    ],
    technicalParams: {
      cfgScale: 8.5,
      steps: 40,
      samples: 1
    },
    restrictions: [
      "Avoid technical inaccuracies",
      "Maintain UI/UX best practices",
      "Respect patent and IP guidelines",
      "Keep technology representations current"
    ]
  },

  "Biens de consommation": {
    promptModifiers: [
      "lifestyle product photography",
      "natural lighting setup",
      "authentic environment",
      "editorial style",
      "commercial photography",
      "professional product shot"
    ],
    styleGuide: [
      "Natural product integration",
      "Lifestyle context focus",
      "Authentic environment capture",
      "Professional studio quality",
      "Contemporary styling"
    ],
    technicalParams: {
      cfgScale: 8,
      steps: 40,
      samples: 1
    },
    restrictions: [
      "Avoid misleading product features",
      "Maintain size accuracy",
      "Follow consumer protection guidelines",
      "Ensure realistic usage scenarios"
    ]
  },

  "Automobile": {
    promptModifiers: [
      "automotive photography",
      "professional car photography",
      "studio lighting setup",
      "dramatic angle",
      "commercial car shot",
      "professional automotive shoot"
    ],
    styleGuide: [
      "Premium automotive presentation",
      "Dynamic composition focus",
      "Professional studio quality",
      "Technical detail accuracy",
      "Commercial grade finish"
    ],
    technicalParams: {
      cfgScale: 9,
      steps: 40,
      samples: 1
    },
    restrictions: [
      "Maintain vehicle proportions",
      "Accurate brand details",
      "Follow safety regulations",
      "Realistic performance representation"
    ]
  },

  "Industrie Manufacturière": {
    promptModifiers: [
      "industrial photography",
      "professional facility shot",
      "technical photography",
      "commercial industrial photo",
      "professional manufacturing photography",
      "industrial documentary"
    ],
    styleGuide: [
      "Professional industrial capture",
      "Technical detail emphasis",
      "Safety compliance focus",
      "Quality process highlight",
      "Clean environment presentation"
    ],
    technicalParams: {
      cfgScale: 8.5,
      steps: 40,
      samples: 1
    },
    restrictions: [
      "Maintain safety standards",
      "Accurate technical details",
      "Follow industry regulations",
      "Proper PPE representation"
    ]
  }
};

export const getSectorConfig = (briefData: BriefData): SectorConfig => {
  const sector = briefData.sector as SectorType;
  return sectorConfigs[sector] || {
    promptModifiers: ["professional photography", "commercial quality", "studio lighting"],
    styleGuide: ["Professional presentation", "Clear communication", "Quality focus"],
    technicalParams: {
      cfgScale: 8,
      steps: 40,
      samples: 1
    },
    restrictions: ["Maintain professional standards"]
  };
};

export const generateSectorPrompt = (briefData: BriefData, basePrompt: string): string => {
  const config = getSectorConfig(briefData);
  
  // Optimisé pour SDXL
  return `${basePrompt}, ${config.promptModifiers.join(', ')}, professional photography, high-end commercial quality, detailed, sharp focus

Style Requirements:
${config.styleGuide.map(guide => `- ${guide}`).join('\n')}

Industry Context:
- Sector: ${briefData.sector}
- Market: ${briefData.targetAudience.demographic.join(', ')}
- Position: ${briefData.competitiveAnalysis.marketPosition}
- Key Features: ${briefData.competitiveAnalysis.differentiators.join(', ')}`;
};

export const adjustTechnicalParams = (
  briefData: BriefData,
  baseParams: StabilityParams
): StabilityParams => {
  const config = getSectorConfig(briefData);
  
  // Fusion des paramètres optimisée pour SDXL
  const adjustedParams: StabilityParams = {
    cfgScale: (baseParams.cfgScale + config.technicalParams.cfgScale) / 2,
    steps: Math.min(baseParams.steps, config.technicalParams.steps),
    samples: baseParams.samples
  };

  // Ajustements basés sur les contraintes légales
  if (briefData.legalConstraints.regulations.length > 0) {
    adjustedParams.cfgScale += 0.5;
    adjustedParams.steps = Math.min(adjustedParams.steps + 5, 40);
  }

  // Ajustements basés sur le budget
  const budgetAllocation = briefData.budget.allocation['Photo/Vidéo'] || 0;
  if (budgetAllocation > 30) {
    adjustedParams.steps = Math.min(adjustedParams.steps + 5, 40);
    adjustedParams.samples = 2;
  }

  // Limites de sécurité pour SDXL
  return {
    ...adjustedParams,
    cfgScale: Math.min(Math.max(adjustedParams.cfgScale, 7), 9),
    steps: Math.min(Math.max(adjustedParams.steps, 35), 40)
  };
};
