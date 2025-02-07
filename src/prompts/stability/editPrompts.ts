import { BriefData } from '../../types/brief';
import { StabilityParams, SectorType } from './utils';

export const generateEditPrompt = (briefData: BriefData, baseDescription: string): string => {
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

  return `Edit this image while maintaining perfect anatomical accuracy and natural interactions:

[Legal Requirements]
${briefData.legalConstraints.regulations.map(reg => `- Comply with: ${reg}`).join('\n')}
${briefData.legalConstraints.disclaimers.map(disc => `- Include space for: ${disc}`).join('\n')}

[Anatomical Precision]
- Keep all hand proportions 100% realistic
- Maintain natural finger positions and joint angles
- Ensure ergonomic and comfortable grip positions
- Preserve realistic muscle tension in hands and arms

[Product Interaction]
- Respect physical properties of the product
- Show natural weight distribution
- Maintain realistic contact points
- Keep proper scale relationships

[Professional Enhancement]
- Optimize lighting while preserving original shadows
- Enhance product details and textures
- Maintain consistent perspective
- Keep all modifications physically plausible
${visualLearnings ? `- Apply learnings: ${visualLearnings}` : ''}

[Environment Integration]
- Preserve natural depth of field
- Maintain realistic environmental reflections
- Keep consistent light direction
- Ensure proper ground/surface contact
${visualDifferentiators ? `- Emphasize differentiators: ${visualDifferentiators}` : ''}

[Resource Optimization]
- Tools available: ${briefData.resources.tools.join(', ')}
- Budget allocation: ${briefData.budget.allocation['Photo/Vidéo']}% of total
- Team capabilities: ${briefData.resources.internalTeam.join(', ')}

Base edit description: ${baseDescription}

Additional context:
- Brand: ${briefData.companyName}
- Style: ${briefData.communicationStyle}
- Industry: ${briefData.sector}
- Target audience: ${briefData.targetAudience.demographic.join(', ')}`;
};

export const getEditStrength = (briefData: BriefData): number => {
  let baseStrength = 0.3; // Force de base conservative

  // Ajustement selon le secteur
  switch (briefData.sector as SectorType) {
    case "FMCG (Fast-Moving Consumer Goods)":
    case "Biens de consommation":
    case "Automobile":
      // Produits physiques : édition plus légère pour préserver les détails
      baseStrength += 0;
      break;
    case "Hôtellerie, Restauration et Loisirs":
    case "Industrie Manufacturière":
      // Secteurs hybrides : édition modérée
      baseStrength += 0.1;
      break;
    default:
      // Services et autres : édition plus forte
      baseStrength += 0.2;
  }

  // Ajustement selon les contraintes légales
  if (briefData.legalConstraints.regulations.length > 0) {
    baseStrength -= 0.1; // Plus conservateur avec des contraintes légales
  }

  // Ajustement selon les apprentissages précédents
  const hasVisualLearnings = briefData.previousCampaigns.some(
    campaign => campaign.learnings.some(
      learning => learning.toLowerCase().includes('visuel')
    )
  );
  if (hasVisualLearnings) {
    baseStrength += 0.1; // Plus confiant avec des apprentissages
  }

  // Limites de sécurité
  return Math.max(0.2, Math.min(0.8, baseStrength));
};

export const getEditParams = (briefData: BriefData): StabilityParams => {
  const baseParams: StabilityParams = {
    cfgScale: 7.5,
    steps: 50,
    samples: 1,
    clipGuidancePreset: 'FAST_BLUE'
  };

  // Ajustements selon le secteur
  switch (briefData.sector as SectorType) {
    case 'FMCG (Fast-Moving Consumer Goods)':
      baseParams.cfgScale = 8;
      baseParams.clipGuidancePreset = 'FAST_GREEN';
      break;
    case 'Banque et Finance':
      baseParams.cfgScale = 7.5;
      baseParams.clipGuidancePreset = 'FAST_BLUE';
      break;
    case 'Hôtellerie, Restauration et Loisirs':
      baseParams.cfgScale = 6.5;
      baseParams.clipGuidancePreset = 'FAST_GREEN';
      break;
  }

  // Ajustements selon les contraintes légales
  if (briefData.legalConstraints.regulations.length > 0) {
    baseParams.cfgScale += 0.5;
    baseParams.steps += 5;
  }

  // Ajustements selon le budget
  const budgetAllocation = briefData.budget.allocation['Photo/Vidéo'] || 0;
  if (budgetAllocation > 30) {
    baseParams.steps += 10;
    baseParams.samples = 2;
  }

  return baseParams;
};

export const getNegativePromptForEdit = (briefData: BriefData): string => {
  const baseNegative = 'blurry, low quality, low resolution, oversaturated, undersaturated, distorted proportions, unrealistic anatomy, deformed hands, extra fingers, missing fingers, bad composition';

  // Ajouter les restrictions spécifiques au secteur
  const sectorRestrictions: Record<SectorType, string> = {
    'FMCG (Fast-Moving Consumer Goods)': 'unrealistic product appearance, incorrect branding, misleading product representation',
    'Banque et Finance': 'unprofessional appearance, excessive luxury, controversial symbols',
    'Hôtellerie, Restauration et Loisirs': 'unsanitary conditions, unrealistic portions, poor ambiance',
    'Technologie et Innovation': 'outdated technology, technical inaccuracies, unrealistic interfaces',
    'Biens de consommation': 'unrealistic product appearance, incorrect branding, misleading product representation',
    'Automobile': 'unrealistic vehicle proportions, incorrect brand details, misleading features',
    'Industrie Manufacturière': 'unsafe conditions, unrealistic machinery, incorrect technical details'
  };

  const sectorNegative = briefData.sector in sectorRestrictions 
    ? sectorRestrictions[briefData.sector as SectorType]
    : '';

  // Ajouter les restrictions légales
  const legalNegative = briefData.legalConstraints.regulations
    .map(reg => reg.toLowerCase())
    .join(', ');

  return [baseNegative, sectorNegative, legalNegative]
    .filter(Boolean)
    .join(', ');
};
