import { BriefData } from '../../types/brief';

export const generateSocialMediaContent = (briefData: BriefData): string => {
  return `En tant qu'expert en marketing digital, créez une stratégie de contenu social media concise et efficace basée sur ces informations :

ENTREPRISE :
${briefData.companyName} - ${briefData.sector}
${briefData.companyDescription}

CIBLE :
- Démographique/Pro : ${briefData.targetAudience.demographic.join(', ')}, ${briefData.targetAudience.professional.join(', ')}
- Comportement/Géo : ${briefData.targetAudience.behavioral.join(', ')}, ${briefData.targetAudience.geographic.join(', ')}

OBJECTIFS & CANAUX :
- Réseaux : ${briefData.currentSocialNetworks.join(', ')}
- Buts : ${briefData.socialMediaGoals.join(', ')}
- Types : ${briefData.contentTypes.join(', ')}
- Style : ${briefData.communicationStyle}

CONTRAINTES LÉGALES :
- Réglementations : ${briefData.legalConstraints.regulations.join(', ')}
- Conformité : ${briefData.legalConstraints.compliance.join(', ')}
- Mentions obligatoires : ${briefData.legalConstraints.disclaimers.join(', ')}

BUDGET ET RESSOURCES :
- Budget total : ${briefData.budget.totalBudget}
- Répartition : ${Object.entries(briefData.budget.allocation).map(([key, value]) => `${key}: ${value}%`).join(', ')}
- Contraintes : ${briefData.budget.constraints.join(', ')}
- Équipe interne : ${briefData.resources.internalTeam.join(', ')}
- Partenaires : ${briefData.resources.externalPartners.join(', ')}
- Outils : ${briefData.resources.tools.join(', ')}

HISTORIQUE CAMPAGNES :
${briefData.previousCampaigns.map(campaign => `
- ${campaign.name} (${campaign.period})
  Résultats : ${campaign.results.join(', ')}
  Apprentissages : ${campaign.learnings.join(', ')}`).join('\n')}

ANALYSE CONCURRENTIELLE :
- Position marché : ${briefData.competitiveAnalysis.marketPosition}
- Différenciateurs : ${briefData.competitiveAnalysis.differentiators.join(', ')}
- Opportunités : ${briefData.competitiveAnalysis.opportunities.join(', ')}

Concurrents principaux :
${briefData.competitiveAnalysis.directCompetitors.map(competitor => `
- ${competitor.name}
  Forces : ${competitor.strengths.join(', ')}
  Faiblesses : ${competitor.weaknesses.join(', ')}
  Stratégies : ${competitor.strategies.join(', ')}`).join('\n')}

KPIs : ${briefData.successMetrics.join(', ')}
THÈMES : ${briefData.specificThemes}

Fournir de manière structurée :

1. STRATÉGIE (max 300 mots) :
- Analyse situation et contexte concurrentiel
- Recommandations clés tenant compte des contraintes légales
- Positionnement différenciant basé sur l'analyse concurrentielle
- Ton de marque adapté aux réglementations
- Optimisation des ressources disponibles
- Capitalisation sur les apprentissages précédents

2. SUGGESTIONS (5-7 points) :
- Types de contenu prioritaires avec budget alloué
- Fréquence optimale selon ressources disponibles
- Tactiques d'engagement conformes aux réglementations
- Process de validation légale
- Utilisation optimale des outils disponibles
- Répartition des tâches entre équipe interne et partenaires

3. PLANNING :
- Thèmes mensuels avec budget associé
- Fréquence par réseau selon ressources
- Moments clés basés sur historique
- Process de validation légale
- Allocation des ressources
- Points de contrôle conformité

4. GESTION DES RISQUES :
- Protocole de conformité légale
- Suivi budgétaire
- Plan de contingence ressources
- Processus d'approbation
- Gestion de crise

Privilégier des recommandations :
- Concrètes et actionnables
- Conformes aux contraintes légales
- Dans les limites du budget
- Adaptées aux ressources disponibles
- Basées sur les apprentissages passés
- Différenciantes face à la concurrence`;
};
