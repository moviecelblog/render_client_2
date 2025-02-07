import { BriefData } from '../../../types/brief';

export interface ValidationCriteria {
  minPositioningLength: number;
  minStrengthLength: number;
  minOpportunityLength: number;
  requiredThemeElements: string[];
  minRecommendations: number;
}

export const DEFAULT_VALIDATION_CRITERIA: ValidationCriteria = {
  minPositioningLength: 50,
  minStrengthLength: 30,
  minOpportunityLength: 30,
  requiredThemeElements: ['objectif', 'angle', 'émotions', 'formats', 'réseaux'],
  minRecommendations: 3
};

export const generateValidationPrompt = (
  briefData: BriefData,
  criteria: ValidationCriteria = DEFAULT_VALIDATION_CRITERIA
): string => {
  return `Validation stratégie ${briefData.companyName}

LÉGAL
Règles: ${briefData.legalConstraints.regulations[0]}
Mentions: ${briefData.legalConstraints.disclaimers[0]}

CRITÈRES
Positionnement: min ${criteria.minPositioningLength} car
Forces: min ${criteria.minStrengthLength} car
Opportunités: min ${criteria.minOpportunityLength} car

THÈMES (12)
Requis: ${criteria.requiredThemeElements.join(', ')}

BUDGET
Total: ${briefData.budget.totalBudget}
Marketing: ${briefData.budget.allocation['Marketing']}%

RESSOURCES
Équipe: ${briefData.resources.internalTeam.slice(0, 2).join(', ')}
Outils: ${briefData.resources.tools.slice(0, 2).join(', ')}

FORMAT REQUIS:

1. CONFORMITÉ
- Légal ✓/✗
- Qualité /100
- Risques

2. CORRECTIONS
Si ✗:
- Actions
- Priorité
- Impact

3. VALIDATION
- Accepté/Refusé
- Score /100
- Points clés`;
};

export const validateStrategyContent = (
  content: string,
  criteria: ValidationCriteria = DEFAULT_VALIDATION_CRITERIA
): boolean => {
  // Validation du positionnement
  const positioningMatch = content.match(/Positionnement[^:]*:\s*([^\n]+)/i);
  if (!positioningMatch || positioningMatch[1].length < criteria.minPositioningLength) {
    return false;
  }

  // Validation des forces
  const strengthsSection = content.match(/Forces[^:]*:([\\s\\S]*?)(?=\\n\\n|$)/i);
  if (!strengthsSection) return false;
  const strengths = strengthsSection[1]
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
  if (strengths.some(strength => strength.length < criteria.minStrengthLength)) {
    return false;
  }

  // Validation des opportunités
  const opportunitiesSection = content.match(/Opportunités[^:]*:([\\s\\S]*?)(?=\\n\\n|$)/i);
  if (!opportunitiesSection) return false;
  const opportunities = opportunitiesSection[1]
    .split('\n')
    .map(line => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
  if (opportunities.some(opportunity => opportunity.length < criteria.minOpportunityLength)) {
    return false;
  }

  // Validation des thèmes
  const themeCount = (content.match(/\d+\/12/g) || []).length;
  if (themeCount !== 12) return false;

  // Validation des recommandations
  const recommendationSections = [
    'Style visuel',
    'Ton de voix',
    'Hashtags',
    'Tactiques'
  ];
  for (const section of recommendationSections) {
    const sectionMatch = content.match(new RegExp(`${section}[^:]*:([\\s\\S]*?)(?=\\n\\n|$)`, 'i'));
    if (!sectionMatch) return false;
    const recommendations = sectionMatch[1]
      .split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);
    if (recommendations.length < criteria.minRecommendations) {
      return false;
    }
  }

  return true;
};
