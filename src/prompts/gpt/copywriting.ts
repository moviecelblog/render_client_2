import { BriefData } from '../../types/brief';

export const generateCopywriting = (briefData: BriefData): string => {
  return `En tant que copywriter, créez du contenu pour : ${briefData.currentSocialNetworks.join(', ')}.

ENTREPRISE :
${briefData.companyName} (${briefData.sector})
${briefData.companyDescription}
USP : ${briefData.uniqueSellingPoints}

CIBLE :
${briefData.targetAudience.demographic.join(', ')}
${briefData.targetAudience.professional.join(', ')}

STYLE :
- Ton : ${briefData.communicationStyle}
- Types : ${briefData.contentTypes.join(', ')}
- Objectifs : ${briefData.socialMediaGoals.join(', ')}

CONTRAINTES LÉGALES :
- Réglementations : ${briefData.legalConstraints.regulations.join(', ')}
- Mentions obligatoires : ${briefData.legalConstraints.disclaimers.join(', ')}

RESSOURCES :
- Budget alloué : ${briefData.budget.allocation["Contenu"]}% du budget total
- Équipe : ${briefData.resources.internalTeam.join(', ')}
- Outils : ${briefData.resources.tools.join(', ')}

APPRENTISSAGES PRÉCÉDENTS :
${briefData.previousCampaigns.map(campaign => `
- ${campaign.name}:
  Résultats : ${campaign.results.join(', ')}
  Learnings : ${campaign.learnings.join(', ')}`).join('\n')}

ANALYSE CONCURRENTIELLE :
- Notre position : ${briefData.competitiveAnalysis.marketPosition}
- Différenciation : ${briefData.competitiveAnalysis.differentiators.join(', ')}
- Opportunités : ${briefData.competitiveAnalysis.opportunities.join(', ')}

THÈMES : ${briefData.specificThemes}

Pour chaque réseau, créer (format strict) :

Post:
- Platform: [réseau]
- Content: [texte, max 280 car.]
- Call to Action: [CTA court]
- Hashtags: [3-5 max]
- Mentions légales: [mentions obligatoires requises]
- Validation: [points de contrôle légaux]

Variation:
- Short: [version courte avec mentions légales essentielles]
- Detailed: [version détaillée incluant toutes les mentions]
- Narrative: [version storytelling respectant les contraintes]

Engagement:
- Question: [1 question conforme aux régulations]
- Poll: [1 sondage respectant les contraintes]
- Response: [1 réponse type validée juridiquement]

Guidelines:
1. Respecter les limites de caractères par plateforme
2. Adapter le ton selon le réseau tout en maintenant la conformité
3. Utiliser des hashtags pertinents et conformes
4. Intégrer systématiquement les mentions légales requises
5. S'appuyer sur les apprentissages des campagnes précédentes
6. Se différencier de la concurrence
7. Optimiser pour les ressources disponibles

Validation requise:
- Conformité légale
- Mentions obligatoires
- Respect du budget
- Faisabilité avec ressources disponibles
- Cohérence avec positionnement concurrentiel

Pour chaque contenu, vérifier:
1. Conformité aux réglementations
2. Présence des mentions obligatoires
3. Respect des contraintes budgétaires
4. Faisabilité avec les ressources
5. Différenciation concurrentielle
6. Application des apprentissages passés`;
};
