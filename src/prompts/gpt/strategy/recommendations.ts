import { BriefData } from '../../../types/brief';

export const generateRecommendations = (briefData: BriefData): string => {
  return `Recommandations social media ${briefData.companyName}

CONTEXTE
Budget: ${briefData.budget.totalBudget}
Équipe: ${briefData.resources.internalTeam.slice(0, 2).join(', ')}
Outils: ${briefData.resources.tools.slice(0, 2).join(', ')}
Légal: ${briefData.legalConstraints.regulations[0]}

FORMAT REQUIS:

1. VISUEL
- Style global
- Formats/dimensions
- Direction artistique
- Contraintes légales

2. CONTENU
- Ton par réseau
- Types de posts
- Hashtags clés
- Templates

3. ENGAGEMENT
- Interactions
- Moments clés
- Modération
- KPIs

4. TECHNIQUE
- Process
- Outils
- Ressources
- Budget

5. ACTIONS
Court terme (1-3m)
- Priorités
- Quick wins

Moyen terme (3-6m)
- Développement
- Optimisation

Long terme (6-12m)
- Scaling
- Évolution`;
};
