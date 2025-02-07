import { AIService } from '../services/ai';
import { BriefData } from '../types/brief';
import { generateBasePrompt } from '../prompts/stability/generatePrompts';
import { generateSectorPrompt } from '../prompts/stability/sectorPrompts';

// Ajout de la fonction generateSectorSpecificPrompt
export const generateSectorSpecificPrompt = (briefData: BriefData): string => {
  // Générer le prompt de base
  const basePrompt = generateBasePrompt(briefData);
  
  // Ajouter les spécificités du secteur
  const sectorPrompt = generateSectorPrompt(briefData, basePrompt);

  // Ajouter les contraintes légales si nécessaire
  const legalText = briefData.legalConstraints.regulations.length > 0
    ? `\n\nLegal Requirements:\n${briefData.legalConstraints.regulations.map(reg => `- ${reg}`).join('\n')}`
    : '';

  // Ajouter les considérations budgétaires
  const budgetText = `\n\nBudget Allocation:\n- Photo/Video: ${briefData.budget.allocation['Photo/Vidéo']}%`;

  // Ajouter les ressources disponibles
  const resourcesText = `\n\nAvailable Resources:\n- Team: ${briefData.resources.internalTeam.join(', ')}\n- Tools: ${briefData.resources.tools.join(', ')}`;

  // Ajouter les apprentissages des campagnes précédentes
  const learningsText = briefData.previousCampaigns.length > 0
    ? `\n\nPrevious Campaign Learnings:\n${briefData.previousCampaigns[0].learnings.map(learning => `- ${learning}`).join('\n')}`
    : '';

  // Ajouter l'analyse concurrentielle
  const competitiveText = `\n\nCompetitive Analysis:\n- Market Position: ${briefData.competitiveAnalysis.marketPosition}\n- Differentiators: ${briefData.competitiveAnalysis.differentiators.join(', ')}`;

  // Combiner tous les éléments
  return `${sectorPrompt}${legalText}${budgetText}${resourcesText}${learningsText}${competitiveText}`;
};

// Test pour une entreprise de produits physiques (Coca-Cola)
const physicalProductTest: BriefData = {
  companyName: "Coca-Cola",
  email: "contact@cocacola.com",
  sector: "FMCG (Fast-Moving Consumer Goods)",
  companyDescription: "Leader mondial des boissons rafraîchissantes",
  communicationStyle: "Décontracté",
  productPhotos: [
    new File([], "product1.jpg"),
    new File([], "product2.jpg")
  ],
  currentSocialNetworks: ["Instagram", "Facebook"],
  socialMediaGoals: ["Augmenter la visibilité"],
  contentTypes: ["Photos de produits"],
  targetAudience: {
    demographic: ["18-24 ans", "25-34 ans"],
    professional: ["Jeunes actifs"],
    behavioral: ["Consommateurs premium"],
    geographic: ["National"]
  },
  uniqueSellingPoints: "Rafraîchissement instantané, goût unique",
  customerBenefits: "Moments de partage et de bonheur",
  audienceNeeds: "Socialisation et plaisir",
  productSolution: "Boisson rafraîchissante pour tous les moments",
  competitors: "Pepsi, autres sodas",
  competitorStrategies: ["Influencers"],
  successMetrics: ["engagement_metrics"],
  roiExpectations: ["follower_growth"],
  specificThemes: "Été, fêtes, moments entre amis",
  additionalInfo: "",
  logo: null,
  brandGuidelines: null,
  legalConstraints: {
    regulations: ["Mentions nutritionnelles obligatoires", "Âge légal de consommation"],
    compliance: ["RGPD", "Directives publicitaires"],
    disclaimers: ["Consommer avec modération", "Dans le cadre d'une alimentation équilibrée"]
  },
  budget: {
    totalBudget: "500000€",
    allocation: {
      "Publicité": 40,
      "Influenceurs": 30,
      "Contenu": 20,
      "Analytics": 10
    },
    constraints: ["Budget trimestriel", "ROI minimum attendu"]
  },
  resources: {
    internalTeam: ["Chef de produit", "Community Manager", "Designer"],
    externalPartners: ["Agence créative", "Agence RP"],
    tools: ["Suite Adobe", "Hootsuite", "Google Analytics"]
  },
  previousCampaigns: [{
    name: "Summer Vibes 2023",
    period: "Juin-Août 2023",
    results: ["10M impressions", "+15% engagement", "2M nouveaux followers"],
    learnings: ["Meilleur engagement sur Instagram", "Vidéos courtes plus performantes"]
  }],
  competitiveAnalysis: {
    directCompetitors: [{
      name: "Pepsi",
      strengths: ["Marketing sportif fort", "Partenariats célèbres"],
      weaknesses: ["Moins de reconnaissance mondiale"],
      strategies: ["Sponsoring événementiel", "Marketing digital agressif"]
    }],
    marketPosition: "Leader mondial des sodas",
    differentiators: ["Heritage de marque", "Distribution mondiale"],
    opportunities: ["Marchés émergents", "Nouvelles saveurs"]
  }
};

// Test pour une entreprise de services purs (Banque)
const pureServiceTest: BriefData = {
  companyName: "BanqueDigitale",
  email: "contact@banquedigitale.com",
  sector: "Banque et Finance",
  companyDescription: "Services bancaires 100% en ligne",
  communicationStyle: "Professionnel",
  productPhotos: [],
  currentSocialNetworks: ["LinkedIn", "Twitter"],
  socialMediaGoals: ["Générer des leads"],
  contentTypes: ["Infographies"],
  targetAudience: {
    demographic: ["25-34 ans", "35-44 ans"],
    professional: ["Cadres", "Entrepreneurs"],
    behavioral: ["Early adopters"],
    geographic: ["National"]
  },
  uniqueSellingPoints: "Banking 100% digital, zéro paperasse",
  customerBenefits: "Gestion bancaire simplifiée",
  audienceNeeds: "Efficacité et rapidité",
  productSolution: "Services bancaires modernes et accessibles",
  competitors: "Banques traditionnelles",
  competitorStrategies: ["creative_campaigns"],
  successMetrics: ["lead_conversion"],
  roiExpectations: ["website_traffic"],
  specificThemes: "Innovation financière, sécurité",
  additionalInfo: "",
  logo: null,
  brandGuidelines: null,
  legalConstraints: {
    regulations: ["Réglementation bancaire", "KYC", "LCB-FT"],
    compliance: ["RGPD", "Directives bancaires européennes"],
    disclaimers: ["Investir comporte des risques", "Capital non garanti"]
  },
  budget: {
    totalBudget: "300000€",
    allocation: {
      "Marketing digital": 45,
      "Content": 25,
      "SEO": 20,
      "Analytics": 10
    },
    constraints: ["Budget annuel", "Conformité réglementaire"]
  },
  resources: {
    internalTeam: ["Responsable marketing", "Compliance officer", "Content manager"],
    externalPartners: ["Agence SEO", "Cabinet juridique"],
    tools: ["Salesforce", "HubSpot", "Tableau"]
  },
  previousCampaigns: [{
    name: "Digital Banking Revolution",
    period: "Q1 2023",
    results: ["5000 nouveaux comptes", "+25% trafic web", "3M€ dépôts"],
    learnings: ["Focus sur la sécurité rassurant", "LinkedIn plus performant"]
  }],
  competitiveAnalysis: {
    directCompetitors: [{
      name: "BanqueTraditionnelle",
      strengths: ["Réseau physique", "Confiance historique"],
      weaknesses: ["Processus lents", "Coûts élevés"],
      strategies: ["Transformation digitale", "Programme fidélité"]
    }],
    marketPosition: "Challenger digital",
    differentiators: ["100% mobile", "Zéro frais cachés"],
    opportunities: ["Méfiance banques traditionnelles", "Demande digital"]
  }
};

// Test pour une entreprise hybride (Restaurant)
const hybridTest: BriefData = {
  companyName: "FoodFusion",
  email: "contact@foodfusion.com",
  sector: "Hôtellerie, Restauration et Loisirs",
  companyDescription: "Restaurant fusion moderne avec service traiteur",
  communicationStyle: "Inspirant",
  productPhotos: [
    new File([], "dish1.jpg")
  ],
  currentSocialNetworks: ["Instagram", "Facebook"],
  socialMediaGoals: ["Augmenter la visibilité"],
  contentTypes: ["Photos de produits", "Behind the scenes"],
  targetAudience: {
    demographic: ["25-34 ans", "35-44 ans"],
    professional: ["Cadres"],
    behavioral: ["Consommateurs premium"],
    geographic: ["Urbain"]
  },
  uniqueSellingPoints: "Cuisine fusion créative, ambiance unique",
  customerBenefits: "Expérience culinaire mémorable",
  audienceNeeds: "Découverte gastronomique",
  productSolution: "Restaurant et service traiteur haut de gamme",
  competitors: "Restaurants gastronomiques",
  competitorStrategies: ["video_content"],
  successMetrics: ["engagement_metrics"],
  roiExpectations: ["engagement_improvement"],
  specificThemes: "Gastronomie, art culinaire",
  additionalInfo: "",
  logo: null,
  brandGuidelines: null,
  legalConstraints: {
    regulations: ["Normes HACCP", "Licence débit de boissons"],
    compliance: ["Réglementation alimentaire", "RGPD"],
    disclaimers: ["Allergènes", "Prix service compris"]
  },
  budget: {
    totalBudget: "100000€",
    allocation: {
      "Photo/Vidéo": 40,
      "Social Media": 30,
      "Événements": 20,
      "Influence": 10
    },
    constraints: ["Budget mensuel", "Saisonnalité"]
  },
  resources: {
    internalTeam: ["Chef", "Photographe culinaire", "Social media manager"],
    externalPartners: ["Agence événementielle", "Influenceurs food"],
    tools: ["Lightroom", "Later", "Canva Pro"]
  },
  previousCampaigns: [{
    name: "Festival des Saveurs",
    period: "Automne 2023",
    results: ["200 réservations", "+30% followers", "4.8/5 reviews"],
    learnings: ["Photos de plats très engageantes", "Stories efficaces"]
  }],
  competitiveAnalysis: {
    directCompetitors: [{
      name: "GastroClassic",
      strengths: ["Réputation établie", "Chef étoilé"],
      weaknesses: ["Prix élevés", "Image traditionnelle"],
      strategies: ["Menu dégustation", "Événements exclusifs"]
    }],
    marketPosition: "Innovation culinaire accessible",
    differentiators: ["Fusion unique", "Ambiance décontractée"],
    opportunities: ["Tendance food experience", "Marché événementiel"]
  }
};

async function runTests() {
  console.log("=== Test des différents types d'entreprises ===");

  // Test Produit Physique
  console.log("\n1. Test Entreprise Produits Physiques (Coca-Cola)");
  try {
    const physicalResult = await AIService.generateContent(physicalProductTest);
    console.log("Résultat:", physicalResult.success ? "Succès" : "Échec");
    if (!physicalResult.success) {
      console.error("Erreur:", physicalResult.error);
    }
  } catch (error) {
    console.error("Erreur lors du test produits physiques:", error);
  }

  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test Service Pur
  console.log("\n2. Test Entreprise Services Purs (BanqueDigitale)");
  try {
    const serviceResult = await AIService.generateContent(pureServiceTest);
    console.log("Résultat:", serviceResult.success ? "Succès" : "Échec");
    if (!serviceResult.success) {
      console.error("Erreur:", serviceResult.error);
    }
  } catch (error) {
    console.error("Erreur lors du test services purs:", error);
  }

  await new Promise(resolve => setTimeout(resolve, 5000));

  // Test Hybride
  console.log("\n3. Test Entreprise Hybride (FoodFusion)");
  try {
    const hybridResult = await AIService.generateContent(hybridTest);
    console.log("Résultat:", hybridResult.success ? "Succès" : "Échec");
    if (!hybridResult.success) {
      console.error("Erreur:", hybridResult.error);
    }
  } catch (error) {
    console.error("Erreur lors du test hybride:", error);
  }
}

// Exécuter les tests
runTests().then(() => {
  console.log("\n=== Tests terminés ===");
}).catch(error => {
  console.error("Erreur globale:", error);
});
