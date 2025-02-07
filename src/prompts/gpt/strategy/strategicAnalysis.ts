import { BriefData } from '../../../types/brief';

export const generateStrategicAnalysis = (briefData: BriefData): string => {
  return `Stratégie social media ${briefData.companyName}

ENTREPRISE
Secteur: ${briefData.sector}
Style: ${briefData.communicationStyle}
Forces: ${briefData.uniqueSellingPoints}

CIBLE
Demo: ${briefData.targetAudience.demographic.slice(0, 2).join(', ')}
Pro: ${briefData.targetAudience.professional.slice(0, 2).join(', ')}
Geo: ${briefData.targetAudience.geographic[0]}

OBJECTIFS
${briefData.socialMediaGoals.slice(0, 3).join('\n')}

CONTRAINTES
Budget: ${briefData.budget.totalBudget}
Légal: ${briefData.legalConstraints.regulations[0]}

CONCURRENCE
${briefData.competitors}
Stratégies: ${briefData.competitorStrategies[0]}

FORMAT REQUIS:

1. MARCHÉ
- Position
- Opportunités
- Tendances

2. STRATÉGIE
- Valeur unique
- Différenciation
- Ton

3. ACTIONS
- Réseaux prioritaires
- Contenus clés
- KPIs

4. PLAN
- Priorités
- Calendrier
- Outils`;
};
