import { BriefData } from '../types/brief';
import { generateSectorSpecificPrompt } from './sectorTest';

describe('Sector-specific prompt generation', () => {
  const defaultLegalConstraints = {
    regulations: [],
    compliance: [],
    disclaimers: []
  };

  const defaultBudget = {
    totalBudget: '10000€',
    allocation: {
      "Photo/Vidéo": 30,
      "Social Media": 30,
      "Influence": 20,
      "Événementiel": 20
    },
    constraints: []
  };

  const defaultResources = {
    internalTeam: [
      'Social media manager',
      'Content manager'
    ],
    externalPartners: [
      'Agence créative'
    ],
    tools: [
      'Suite Adobe Creative',
      'Hootsuite'
    ]
  };

  const defaultPreviousCampaigns = [{
    name: 'Campagne Test',
    period: 'Q4 2023',
    results: [
      '1M impressions',
      '+20% engagement'
    ],
    learnings: [
      'Meilleure performance des vidéos courtes',
      'Engagement plus fort le weekend'
    ]
  }];

  const defaultCompetitiveAnalysis = {
    directCompetitors: [{
      name: 'Concurrent A',
      strengths: ['Présence digitale forte'],
      weaknesses: ['Prix élevés'],
      strategies: ['Marketing d\'influence']
    }],
    marketPosition: 'Leader',
    differentiators: ['Qualité premium'],
    opportunities: ['Expansion marché']
  };

  // Test pour une entreprise de produits physiques (Coca-Cola)
  const physicalProductTest: BriefData = {
    companyName: "Coca-Cola",
    email: "contact@cocacola.com",
    sector: "FMCG (Fast-Moving Consumer Goods)",
    companyDescription: "Leader mondial des boissons rafraîchissantes",
    communicationStyle: "Dynamique et jeune",
    productPhotos: [],
    currentSocialNetworks: ["Instagram", "Facebook", "TikTok"],
    socialMediaGoals: ["Engagement", "Brand awareness"],
    contentTypes: ["Photos", "Vidéos", "Stories"],
    targetAudience: {
      demographic: ["18-34"],
      professional: ["Étudiants"],
      behavioral: ["Lifestyle"],
      geographic: ["International"]
    },
    uniqueSellingPoints: "Goût unique, marque iconique",
    customerBenefits: "Rafraîchissement, partage",
    audienceNeeds: "Moments de plaisir",
    productSolution: "Boissons rafraîchissantes",
    competitors: "Pepsi, autres sodas",
    competitorStrategies: ["Marketing digital"],
    successMetrics: ["Engagement rate"],
    roiExpectations: ["Croissance followers"],
    specificThemes: "Lifestyle, jeunesse",
    additionalInfo: "Focus sur le digital",
    logo: null,
    brandGuidelines: null,
    legalConstraints: defaultLegalConstraints,
    budget: defaultBudget,
    resources: defaultResources,
    previousCampaigns: defaultPreviousCampaigns,
    competitiveAnalysis: defaultCompetitiveAnalysis
  };

  // Test pour une entreprise de services purs (Banque)
  const pureServiceTest: BriefData = {
    companyName: "BanqueDigitale",
    email: "contact@banquedigitale.com",
    sector: "Banque et Finance",
    companyDescription: "Banque 100% en ligne innovante",
    communicationStyle: "Professionnel et moderne",
    productPhotos: [],
    currentSocialNetworks: ["LinkedIn", "Twitter"],
    socialMediaGoals: ["Lead generation", "Crédibilité"],
    contentTypes: ["Articles", "Infographies"],
    targetAudience: {
      demographic: ["25-45"],
      professional: ["CSP+"],
      behavioral: ["Tech-savvy"],
      geographic: ["National"]
    },
    uniqueSellingPoints: "100% digital, frais réduits",
    customerBenefits: "Simplicité, rapidité",
    audienceNeeds: "Gestion financière simple",
    productSolution: "Services bancaires digitaux",
    competitors: "Banques traditionnelles",
    competitorStrategies: ["Content marketing"],
    successMetrics: ["Conversion rate"],
    roiExpectations: ["Nouveaux clients"],
    specificThemes: "Innovation, sécurité",
    additionalInfo: "Focus B2C",
    logo: null,
    brandGuidelines: null,
    legalConstraints: {
      ...defaultLegalConstraints,
      regulations: ['Réglementation bancaire', 'RGPD']
    },
    budget: defaultBudget,
    resources: defaultResources,
    previousCampaigns: defaultPreviousCampaigns,
    competitiveAnalysis: defaultCompetitiveAnalysis
  };

  // Test pour une entreprise hybride (Restaurant)
  const hybridTest: BriefData = {
    companyName: "FoodFusion",
    email: "contact@foodfusion.com",
    sector: "Hôtellerie, Restauration et Loisirs",
    companyDescription: "Restaurant fusion moderne",
    communicationStyle: "Créatif et chaleureux",
    productPhotos: [],
    currentSocialNetworks: ["Instagram", "Facebook"],
    socialMediaGoals: ["Visibilité locale", "Engagement"],
    contentTypes: ["Photos", "Stories"],
    targetAudience: {
      demographic: ["25-50"],
      professional: ["Urbains actifs"],
      behavioral: ["Foodies"],
      geographic: ["Local"]
    },
    uniqueSellingPoints: "Cuisine fusion créative",
    customerBenefits: "Expérience unique",
    audienceNeeds: "Découverte culinaire",
    productSolution: "Menu fusion innovant",
    competitors: "Restaurants locaux",
    competitorStrategies: ["Photo marketing"],
    successMetrics: ["Réservations"],
    roiExpectations: ["Nouveaux clients"],
    specificThemes: "Gastronomie, ambiance",
    additionalInfo: "Focus expérience",
    logo: null,
    brandGuidelines: null,
    legalConstraints: {
      ...defaultLegalConstraints,
      regulations: ['Normes sanitaires', 'Allergènes']
    },
    budget: defaultBudget,
    resources: defaultResources,
    previousCampaigns: defaultPreviousCampaigns,
    competitiveAnalysis: defaultCompetitiveAnalysis
  };

  test('Génère des prompts spécifiques pour les produits physiques', () => {
    const prompt = generateSectorSpecificPrompt(physicalProductTest);
    expect(prompt).toContain('product');
    expect(prompt).toContain('Coca-Cola');
  });

  test('Génère des prompts spécifiques pour les services purs', () => {
    const prompt = generateSectorSpecificPrompt(pureServiceTest);
    expect(prompt).toContain('digital');
    expect(prompt).toContain('banking');
  });

  test('Génère des prompts spécifiques pour les entreprises hybrides', () => {
    const prompt = generateSectorSpecificPrompt(hybridTest);
    expect(prompt).toContain('restaurant');
    expect(prompt).toContain('food');
  });
});
