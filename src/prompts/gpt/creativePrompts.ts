import { BriefData } from '../../types/brief';

interface ThemeData {
  name: string;
  objective: string;
  approach: string;
  emotions: string;
  formats: string[];
  networks: string[];
}

export const generateCreativeBriefs = (briefData: BriefData, themes: ThemeData[], startIndex: number = 0, batchSize: number = 4): string => {
  const totalBriefs = 12; // Nombre total de briefs souhaités
  const defaultTheme: ThemeData = {
    name: "Moment de partage",
    objective: "Créer des moments de connexion authentiques",
    approach: "Mettre en avant les moments de partage quotidiens",
    emotions: "Joie, convivialité, authenticité",
    formats: ["Photos", "Vidéos", "Stories"],
    networks: ["Instagram", "Facebook", "TikTok"]
  };

  // S'assurer que nous avons assez de thèmes
  const extendedThemes = [...themes];
  while (extendedThemes.length < totalBriefs) {
    extendedThemes.push({
      ...defaultTheme,
      name: `${defaultTheme.name} ${extendedThemes.length + 1}`
    });
  }

  // Calculer les indices de début et de fin pour ce lot
  const endIndex = Math.min(startIndex + batchSize, totalBriefs);
  const selectedThemes = extendedThemes.slice(startIndex, endIndex);

  const currentBatchNumber = Math.floor(startIndex / batchSize) + 1;
  const totalBatches = Math.ceil(totalBriefs / batchSize);

  console.log(`Génération du lot ${currentBatchNumber}/${totalBatches} (briefs ${startIndex + 1} à ${endIndex}/${totalBriefs})`);

  return `En tant que directeur artistique expert spécialisé dans la création d'images photoréalistes avec l'IA, créez ${endIndex - startIndex} briefs créatifs ultra-professionnels pour ${briefData.companyName} (briefs ${startIndex + 1} à ${endIndex}/${totalBriefs}).

CONTEXTE ENTREPRISE
Nom : ${briefData.companyName}
Secteur : ${briefData.sector}
Style de communication : ${briefData.communicationStyle}
Points forts uniques : ${briefData.uniqueSellingPoints}
Description : ${briefData.companyDescription}
Photos produits disponibles : ${briefData.productPhotos.length > 0 ? 'Oui' : 'Non'}

${briefData.productPhotos.length > 0 ? `CONTEXTE PHOTO PRODUIT
- Nombre de photos disponibles : ${briefData.productPhotos.length}
- Objectif : Intégration naturelle dans 70% minimum des créatifs
- Contextes d'intégration recommandés :
  * Moments de partage (picnic, repas, soirée) : produit sur la table/nappe
  * Activités sportives/loisirs : produit dans le sac/équipement
  * Scènes de voyage : produit intégré naturellement dans le décor
  * Environnement professionnel : produit sur le bureau/espace de travail
  * Situations quotidiennes : placement contextuel adapté

INSTRUCTIONS SPÉCIALES PRODUIT :
- Privilégier les scènes permettant une intégration naturelle du produit
- Varier les contextes d'utilisation pour éviter la répétition
- Assurer une présence subtile mais visible du produit
- Adapter l'ambiance à l'identité de marque
- Maintenir l'authenticité des situations` : ''}

CONTRAINTES LÉGALES
Réglementations : ${briefData.legalConstraints.regulations.join(', ')}
Mentions obligatoires : ${briefData.legalConstraints.disclaimers.join(', ')}
Conformité : ${briefData.legalConstraints.compliance.join(', ')}

BUDGET ET RESSOURCES
Budget création : ${briefData.budget.allocation["Photo/Vidéo"] || "N/A"}% du budget total
Équipe créative : ${briefData.resources.internalTeam.join(', ')}
Outils disponibles : ${briefData.resources.tools.join(', ')}

APPRENTISSAGES PRÉCÉDENTS
${briefData.previousCampaigns.map(campaign => `
${campaign.name} (${campaign.period}):
- Résultats : ${campaign.results.join(', ')}
- Learnings : ${campaign.learnings.join(', ')}`).join('\n')}

ANALYSE CONCURRENTIELLE
Position marché : ${briefData.competitiveAnalysis.marketPosition}
Différenciateurs : ${briefData.competitiveAnalysis.differentiators.join(', ')}
Concurrents visuels :
${briefData.competitiveAnalysis.directCompetitors.map(competitor => `
- ${competitor.name}:
  Forces visuelles : ${competitor.strengths.join(', ')}
  Stratégies : ${competitor.strategies.join(', ')}`).join('\n')}

CIBLE
Démographique : ${briefData.targetAudience.demographic.join(', ')}
Comportement : ${briefData.targetAudience.behavioral.join(', ')}
Géographie : ${briefData.targetAudience.geographic.join(', ')}

THÈMES SÉLECTIONNÉS :
${selectedThemes.map((theme, index) => `
${startIndex + index + 1}/${totalBriefs} - ${theme.name}
Objectif : ${theme.objective}
Approche : ${theme.approach}
Émotions : ${theme.emotions}
Formats : ${theme.formats.join(', ')}
Réseaux : ${theme.networks.join(', ')}
`).join('\n')}

FORMAT DE RÉPONSE POUR CHAQUE BRIEF :

PROMPT STABILITY AI :
[Instructions anatomiques critiques]
RÈGLES ABSOLUES :
- Jamais de gros plans sur les mains ou les visages
- Pas de poses figées ou artificielles
- Éviter toute déformation anatomique
- Pas de positions non naturelles
- Pas de proportions incorrectes
- Respect des contraintes légales
- Conformité aux réglementations sectorielles

[Composition principale]
- Décrire la scène globale d'abord
- Définir l'ambiance générale
- Préciser le moment de la journée
- Indiquer le style architectural/décoratif
- Spécifier la palette de couleurs dominante
- Intégrer les mentions légales requises

[Éléments humains]
- Décrire la position générale des personnes
- Spécifier les activités en cours
- Indiquer les expressions émotionnelles
- Mentionner les tenues et styles
- Décrire les interactions sociales
- Respecter les contraintes démographiques

[Éléments produit]
- Placer le produit dans la scène naturellement
- Décrire son intégration dans l'action
- Préciser sa position relative
- Indiquer ses reflets et brillances
- Spécifier son échelle dans la scène
- Intégrer les mentions légales produit

[Éclairage détaillé]
- Source principale de lumière
- Sources secondaires
- Direction des ombres
- Qualité de la lumière (douce/dure)
- Effets atmosphériques
- Lisibilité des mentions légales

[Détails techniques]
- Point de vue et angle de prise de vue
- Distance focale suggérée
- Profondeur de champ
- Style de rendu photo
- Effets spéciaux subtils
- Optimisation pour les ressources disponibles

[Ambiance et style]
- Mood général
- Références stylistiques
- Influences artistiques
- Traitement colorimétrique
- Finition visuelle
- Différenciation concurrentielle

CONTENU MARKETING :
Texte principal : Message principal adapté au format et à la cible
Tagline : Slogan court et percutant
Hashtags : 5-7 hashtags pertinents et stratégiques
Call-to-action : Action claire et motivante
Question : Question d'engagement naturelle
Mentions légales : Intégration des mentions obligatoires

SPÉCIFICATIONS TECHNIQUES :
Format : [Carré/Portrait/Paysage/Story]
Dimensions : [Dimensions exactes en pixels]
Alt text : Description détaillée pour l'accessibilité
Contraintes légales : Zone dédiée aux mentions
Budget estimé : Coût de production
Ressources nécessaires : Équipe et outils requis

FORMATS STANDARDS :
- Feed Instagram : 1080x1080px (ratio 1:1)
- Portrait Instagram : 1080x1350px (ratio 4:5)
- Feed Facebook : 1200x630px (ratio 1.91:1)
- Story : 1080x1920px (ratio 9:16)
- Carousel : 1080x1080px (ratio 1:1)

INSTRUCTIONS SPÉCIALES POUR L'IA :
- Commencer chaque description par le plan large
- Construire la scène par couches successives
- Utiliser un vocabulaire précis et technique
- Inclure des détails sur la perspective
- Spécifier les proportions relatives
- Décrire les textures et matériaux
- Indiquer les points de focus visuels
- Mentionner les transitions de couleurs
- Préciser les contrastes et saturations
- Détailler les effets atmosphériques
- Intégrer les contraintes légales
- Optimiser pour le budget disponible
- Capitaliser sur les apprentissages passés
${briefData.productPhotos.length > 0 ? `- Indiquer explicitement si la scène permet l'intégration produit
- Spécifier le contexte de placement du produit
- Décrire la méthode d'intégration naturelle` : ''}

NOTES IMPORTANTES :
- Chaque prompt doit être extrêmement détaillé
- Privilégier les descriptions constructives
- Éviter les termes négatifs ou restrictifs
- Utiliser un langage orienté solution
- Penser en termes de photographie réelle
- Respecter toutes les contraintes légales
- Optimiser l'utilisation des ressources
- Se différencier de la concurrence
- Appliquer les learnings des campagnes passées

---`;
};

export const generateVisualAnalysis = (briefData: BriefData): string => {
  return `En tant que directeur artistique expert en IA générative, analysez les éléments visuels de la marque ${briefData.companyName} et générez des recommandations détaillées optimisées pour Stability AI :

ÉLÉMENTS ANALYSÉS
Logo : ${briefData.logo ? 'Fourni' : 'Non fourni'}
Photos produits : ${briefData.productPhotos.length} photos fournies
Style de communication : ${briefData.communicationStyle}
Contraintes légales : ${briefData.legalConstraints.regulations.join(', ')}
Budget création : ${briefData.budget.allocation["Photo/Vidéo"] || "N/A"}% du budget total
Ressources : ${briefData.resources.tools.join(', ')}

HISTORIQUE VISUEL
${briefData.previousCampaigns.map(campaign => `
${campaign.name}:
- Résultats visuels : ${campaign.results.join(', ')}
- Apprentissages : ${campaign.learnings.join(', ')}`).join('\n')}

ANALYSE CONCURRENTIELLE
${briefData.competitiveAnalysis.directCompetitors.map(competitor => `
${competitor.name}:
- Forces visuelles : ${competitor.strengths.join(', ')}
- Stratégies : ${competitor.strategies.join(', ')}`).join('\n')}

ANALYSE REQUISE :

1. IDENTITÉ VISUELLE
Couleurs
- Palette principale (codes hexadécimaux)
- Couleurs secondaires (codes hexadécimaux)
- Associations émotionnelles
- Gradients et transitions
- Harmonies colorées
- Conformité réglementaire

Typographie
- Familles de polices principales
- Polices secondaires
- Hiérarchie typographique
- Tailles et espacements
- Styles de caractères
- Lisibilité des mentions légales

Iconographie
- Style d'icônes
- Épaisseur des traits
- Angles et courbes
- Cohérence visuelle
- Système graphique
- Intégration des symboles réglementaires

2. COMPOSITION PHOTOGRAPHIQUE
Layouts
- Grilles de composition
- Points d'intérêt
- Règle des tiers
- Lignes de force
- Équilibre visuel
- Zones mentions légales

Profondeur
- Plans successifs
- Perspective
- Bokeh et flou
- Mise au point
- Échelle relative
- Lisibilité des informations légales

Dynamique
- Mouvements suggérés
- Tensions visuelles
- Rythmes
- Flow directionnel
- Points de fuite
- Hiérarchie informationnelle

3. ADAPTATIONS PAR RÉSEAU
${briefData.currentSocialNetworks.map(network => `
${network}:
- Formats optimaux
- Contraintes techniques
- Best practices visuelles
- Zones de texte
- Points d'attention
- Intégration mentions légales
- Budget alloué
- Ressources nécessaires
`).join('\n')}

4. RECOMMANDATIONS POUR L'IA
Palette
- Combinaisons précises (codes hex)
- Proportions exactes
- Contextes d'utilisation
- Transitions colorées
- Effets lumineux
- Conformité réglementaire

Rendu
- Style photographique
- Qualité d'image
- Netteté et détails
- Grain et texture
- Post-traitement
- Optimisation budgétaire

Composition
- Guides de cadrage
- Points focaux
- Distribution des masses
- Équilibre des éléments
- Hiérarchie visuelle
- Zones mentions légales

Éclairage
- Sources principales
- Lumières d'ambiance
- Ombres et reflets
- Atmosphère
- Effets spéciaux
- Lisibilité des informations

5. VALIDATION ET CONTRÔLE
Conformité
- Check-list réglementaire
- Points de contrôle
- Process de validation
- Documentation requise

Ressources
- Optimisation budget
- Allocation équipe
- Utilisation outils
- Formation nécessaire

Format de réponse :
- Structurez l'analyse par sections
- Utilisez des valeurs numériques précises
- Soyez spécifique et technique
- Pensez en termes d'IA générative
- Optimisez pour Stability AI
- Intégrez les contraintes légales
- Respectez le budget
- Capitalisez sur les apprentissages`;
};
