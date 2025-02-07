import { BriefData } from '../../types/brief';

export const generateStrategicAnalysis = (briefData: BriefData): string => {
  return `En tant que stratège en marketing digital pour ${briefData.companyName}, analysez ces informations et créez une stratégie de contenu cohérente :

CRITÈRES DE VALIDATION OBLIGATOIRES :
- Chaque section doit être clairement identifiée et complète
- Le positionnement recommandé doit faire au minimum 50 caractères
- Chaque force et opportunité doit faire au minimum 30 caractères
- Les recommandations doivent inclure au minimum 3 éléments par catégorie
- Toutes les contraintes légales doivent être respectées et mentionnées

CONTEXTE MARQUE
${briefData.companyName} (${briefData.sector})
Description : ${briefData.companyDescription}
USP : ${briefData.uniqueSellingPoints}
Bénéfices clients : ${briefData.customerBenefits}

CIBLE & BESOINS
Démographique : ${briefData.targetAudience.demographic.join(', ')}
Professionnel : ${briefData.targetAudience.professional.join(', ')}
Comportemental : ${briefData.targetAudience.behavioral.join(', ')}
Géographique : ${briefData.targetAudience.geographic.join(', ')}
Besoins identifiés : ${briefData.audienceNeeds}

OBJECTIFS & CANAUX
Réseaux actifs : ${briefData.currentSocialNetworks.join(', ')}
Objectifs : ${briefData.socialMediaGoals.join(', ')}
KPIs : ${briefData.successMetrics.join(', ')}
ROI attendu : ${briefData.roiExpectations.join(', ')}

CONTENU & TON
Style : ${briefData.communicationStyle}
Formats : ${briefData.contentTypes.join(', ')}

CONTRAINTES LÉGALES
Réglementations : ${briefData.legalConstraints.regulations.join(', ')}
Conformité : ${briefData.legalConstraints.compliance.join(', ')}
Mentions obligatoires : ${briefData.legalConstraints.disclaimers.join(', ')}

BUDGET & RESSOURCES
Budget total : ${briefData.budget.totalBudget}
Allocation : ${Object.entries(briefData.budget.allocation).map(([key, value]) => `${key}: ${value}%`).join(', ')}
Contraintes budgétaires : ${briefData.budget.constraints.join(', ')}

Équipe interne : ${briefData.resources.internalTeam.join(', ')}
Partenaires externes : ${briefData.resources.externalPartners.join(', ')}
Outils disponibles : ${briefData.resources.tools.join(', ')}

HISTORIQUE CAMPAGNES
${briefData.previousCampaigns.map(campaign => `
Campagne : ${campaign.name}
Période : ${campaign.period}
Résultats : ${campaign.results.join(', ')}
Apprentissages : ${campaign.learnings.join(', ')}`).join('\n')}

ANALYSE CONCURRENTIELLE
Position sur le marché : ${briefData.competitiveAnalysis.marketPosition}
Différenciateurs : ${briefData.competitiveAnalysis.differentiators.join(', ')}
Opportunités marché : ${briefData.competitiveAnalysis.opportunities.join(', ')}

Concurrents directs :
${briefData.competitiveAnalysis.directCompetitors.map(competitor => `
- ${competitor.name}
  Forces : ${competitor.strengths.join(', ')}
  Faiblesses : ${competitor.weaknesses.join(', ')}
  Stratégies : ${competitor.strategies.join(', ')}`).join('\n')}

Générez une stratégie détaillée structurée comme suit :

1. ANALYSE STRATÉGIQUE

Positionnement recommandé (minimum 50 caractères)
- Définissez clairement le positionnement de la marque sur les réseaux sociaux
- Une phrase concise et impactante
- Intégrez les contraintes légales et budgétaires

Forces à exploiter (minimum 30 caractères par force)
- Listez 3-5 forces clés
- Chaque force doit être actionnable sur les réseaux sociaux
- Considérez les ressources disponibles

Opportunités à saisir (minimum 30 caractères par opportunité)
- Identifiez 3-5 opportunités concrètes
- Liez-les aux objectifs de la marque
- Basez-vous sur l'analyse concurrentielle

2. RECOMMANDATIONS

Style visuel global (minimum 3 recommandations)
- Directives visuelles claires
- Cohérence cross-plateforme
- Éléments distinctifs
- Conformité légale des visuels

Ton de voix par réseau (minimum 3 recommandations)
- Adaptations selon la plateforme
- Vocabulaire recommandé
- Style d'écriture
- Mentions légales obligatoires

Hashtags stratégiques (minimum 3 hashtags)
- 5-7 hashtags principaux
- Catégories de hashtags
- Usage recommandé
- Conformité réglementaire

Tactiques d'engagement (minimum 3 tactiques)
- Actions concrètes
- Mécaniques d'interaction
- Réponses types
- Gestion des contraintes légales
- Optimisation des ressources

3. PLANNING & RESSOURCES

Fréquence par réseau
- Détaillez pour chaque réseau
- Moments optimaux de publication
- Types de contenus par créneau
- Contraintes légales par type de contenu

Allocation budgétaire
- Répartition par réseau
- Seuils d'alerte
- Mécanismes d'ajustement
- KPIs de performance

Ressources et capacités
- Plan de contingence
- Formation nécessaire
- Support externe requis

4. GESTION DES RISQUES

Conformité légale
- Process de validation
- Points de contrôle
- Documentation requise

Format de réponse :
- Utilisez des tirets pour les listes
- Soyez précis et actionnable
- Séparez clairement les sections
- Intégrez systématiquement les aspects légaux et budgétaires

VALIDATION FINALE :
- Vérifiez que le positionnement fait au moins 50 caractères
- Confirmez que chaque force et opportunité fait au moins 30 caractères
- Vérifiez que chaque section de recommandations contient au moins 3 éléments
- Validez que toutes les contraintes légales sont respectées et mentionnées`;
};
