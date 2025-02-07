import { BriefData } from '../../types/brief';

interface GenerateOptions {
  width?: number;
  height?: number;
  steps?: number;
  cfgScale?: number;
  samples?: number;
}

export const generateBasePrompt = (briefData: BriefData): string => {
  // Extraction des apprentissages visuels
  const visualLearnings = briefData.previousCampaigns
    ?.map(campaign => campaign.learnings)
    .flat()
    .filter(learning => learning.toLowerCase().includes('visuel'))
    .slice(0, 2)
    .join('. ');

  // Analyse des différenciateurs visuels
  const visualDifferentiators = briefData.competitiveAnalysis.differentiators
    .filter(diff => diff.toLowerCase().includes('visuel'))
    .join(', ');

  // Construction du prompt de base
  let prompt = `Create a professional commercial photograph with these specific requirements:

[Brand Identity]
${briefData.logo ? '- Use brand logo colors and style as reference' : ''}
${briefData.brandGuidelines ? '- Follow provided brand guidelines for visual style' : ''}
${briefData.productPhotos.length > 0 ? '- Reference provided product photos for accurate representation' : ''}
- Company: ${briefData.companyName}
- Industry: ${briefData.sector}
- Style: ${briefData.communicationStyle}

[Visual Requirements]
- Professional studio lighting setup
- Perfect anatomical accuracy in all human elements
- Natural and ergonomic poses
- Balanced composition with clear focal points
- High-end commercial photography quality
- Sharp focus on key elements
- Professional color grading
- Cinematic lighting
- High dynamic range
- Clean and uncluttered background

[Brand Assets Integration]
${briefData.logo ? '- Respect brand color palette from logo' : ''}
${briefData.brandGuidelines ? '- Follow visual hierarchy from guidelines' : ''}
${briefData.productPhotos.length > 0 ? '- Match product details and finishes from reference photos' : ''}

[Previous Learnings]
${visualLearnings ? `Apply these learnings: ${visualLearnings}` : ''}

[Competitive Differentiation]
${visualDifferentiators ? `Differentiate through: ${visualDifferentiators}` : ''}`;

  return prompt.trim();
};

export const generateSocialMediaPrompt = (briefData: BriefData, platform: string): string => {
  const basePrompt = generateBasePrompt(briefData);
  const platformSpecs = getPlatformSpecs(platform);

  return `${basePrompt}

[Platform-Specific Requirements]
- Format: ${platformSpecs.format}
- Dimensions: ${platformSpecs.dimensions}
- Style: ${platformSpecs.style}
- Engagement focus: ${platformSpecs.engagement}`;
};

export const generateProductPrompt = (briefData: BriefData, productType: string): string => {
  const basePrompt = generateBasePrompt(briefData);

  return `${basePrompt}

[Product Photography Requirements]
- Product type: ${productType}
- Focus: Product details and features
- Lighting: Highlight product texture and materials
- Background: Clean and contextually appropriate
- Angle: Most flattering product angle
- Scale: Clear product size representation`;
};

export const generateLifestylePrompt = (briefData: BriefData, context: string): string => {
  const basePrompt = generateBasePrompt(briefData);

  return `${basePrompt}

[Lifestyle Scene Requirements]
- Context: ${context}
- Mood: Natural and authentic
- Interaction: Genuine human moments
- Environment: Real-world setting
- Lighting: Natural with professional enhancement
- Style: Aspirational but relatable`;
};

export const getGenerateOptions = (briefData: BriefData, purpose: 'social' | 'product' | 'lifestyle'): GenerateOptions => {
  // Base options
  const options: GenerateOptions = {
    steps: 50,
    cfgScale: 7,
    samples: 1
  };

  // Ajustements selon le secteur
  switch (briefData.sector) {
    case "FMCG (Fast-Moving Consumer Goods)":
    case "Biens de consommation":
      options.cfgScale = 8; // Plus de fidélité pour les produits
      break;
    case "Hôtellerie, Restauration et Loisirs":
      options.cfgScale = 6.5; // Plus de créativité pour l'ambiance
      break;
    default:
      options.cfgScale = 7;
  }

  // Ajustements selon l'utilisation
  switch (purpose) {
    case 'social':
      options.width = 1024;
      options.height = 1024;
      options.steps = 45;
      break;
    case 'product':
      options.width = 1024;
      options.height = 1280;
      options.steps = 55;
      options.cfgScale += 0.5; // Plus de détails
      break;
    case 'lifestyle':
      options.width = 1280;
      options.height = 1024;
      options.steps = 50;
      options.cfgScale -= 0.5; // Plus naturel
      break;
  }

  // Ajustements selon les contraintes légales
  if (briefData.legalConstraints.disclaimers.length > 0) {
    options.height = Math.floor(options.height * 1.2); // Espace pour le texte légal
  }

  return options;
};

const getPlatformSpecs = (platform: string): {
  format: string;
  dimensions: string;
  style: string;
  engagement: string;
} => {
  switch (platform.toLowerCase()) {
    case 'instagram':
      return {
        format: 'Square',
        dimensions: '1080x1080',
        style: 'Visual-first, lifestyle focused',
        engagement: 'Immediate visual impact'
      };
    case 'facebook':
      return {
        format: 'Landscape',
        dimensions: '1200x630',
        style: 'Clear and informative',
        engagement: 'Social sharing optimized'
      };
    case 'linkedin':
      return {
        format: 'Professional',
        dimensions: '1200x627',
        style: 'Corporate and polished',
        engagement: 'Business context focused'
      };
    default:
      return {
        format: 'Standard',
        dimensions: '1080x1080',
        style: 'Versatile',
        engagement: 'General audience'
      };
  }
};
