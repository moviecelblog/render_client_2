import { BriefData } from '../../../types/brief';

export const generateMarketAnalysis = (briefData: BriefData): string => {
  return `Analyse marché pour ${briefData.companyName} (${briefData.sector})

CONTEXTE
Position: ${briefData.competitiveAnalysis.marketPosition}
Budget: ${briefData.budget.totalBudget}
Contraintes: ${briefData.legalConstraints.regulations.join(', ')}

CONCURRENTS
${briefData.competitiveAnalysis.directCompetitors.map(c => 
  `${c.name}:
- Forces: ${c.strengths[0]}
- Faiblesses: ${c.weaknesses[0]}
- Stratégie: ${c.strategies[0]}`
).join('\n')}

HISTORIQUE
${briefData.previousCampaigns.slice(0, 2).map(c => 
  `${c.name}: ${c.results[0]}`
).join('\n')}

RESSOURCES
Budget marketing: ${briefData.budget.allocation['Marketing']}%
Équipe: ${briefData.resources.internalTeam.slice(0, 3).join(', ')}

FORMAT REQUIS:

1. MARCHÉ
- Taille/potentiel
- Tendances
- Opportunités

2. POSITION
- Forces (3)
- Avantages
- Améliorations

3. RESSOURCES
- Budget/objectifs
- Capacités
- Besoins

4. ACTIONS
- Priorités
- Allocation
- KPIs`;
};
