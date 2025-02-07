// ... [Garder tout le contenu existant jusqu'à SECTORS]

// Nouvelle catégorisation des secteurs
export const SECTOR_CATEGORIES = {
  PHYSICAL_PRODUCTS: [
    "FMCG (Fast-Moving Consumer Goods)",
    "Biens de consommation",
    "Automobile",
    "Artisanat et Métiers d'art",
    "Chimie et Pharmaceutique",
    "Agriculture et Agroalimentaire"
  ],
  PURE_SERVICES: [
    "Banque et Finance",
    "Éducation et Formation",
    "Santé et Services sociaux",
    "Services B2B",
    "Services B2C",
    "Communication et Médias",
    "Immobilier"
  ],
  HYBRID: [
    "Hôtellerie, Restauration et Loisirs",
    "Transport et Logistique",
    "Informatique et Technologies",
    "Bâtiment et Construction",
    "Industrie Manufacturière"
  ]
};

export const SECTORS = [
  "Agriculture et Agroalimentaire",
  "Artisanat et Métiers d'art",
  "Automobile",
  "Banque et Finance",
  "Bâtiment et Construction",
  "Biens de consommation",
  "Chimie et Pharmaceutique",
  "Communication et Médias",
  "Éducation et Formation",
  "Énergie et Ressources",
  "Environnement et Développement durable",
  "FMCG (Fast-Moving Consumer Goods)",
  "Hôtellerie, Restauration et Loisirs",
  "Immobilier",
  "Industrie Manufacturière",
  "Informatique et Technologies",
  "Santé et Services sociaux",
  "Sécurité et Défense",
  "Services B2B",
  "Services B2C",
  "Transport et Logistique"
];

export interface SocialNetwork {
  name: string;
  features: string[];
}

export const SOCIAL_NETWORKS: SocialNetwork[] = [
  {
    name: "Facebook",
    features: ["Posts", "Stories", "Reels", "Groupes", "Événements"]
  },
  {
    name: "Instagram",
    features: ["Posts", "Stories", "Reels", "IGTV", "Guides"]
  },
  {
    name: "LinkedIn",
    features: ["Posts", "Articles", "Stories", "Événements", "Newsletters"]
  },
  {
    name: "Twitter",
    features: ["Tweets", "Threads", "Spaces", "Lists"]
  },
  {
    name: "TikTok",
    features: ["Vidéos", "Lives", "Stories", "Duos"]
  },
  {
    name: "YouTube",
    features: ["Vidéos", "Shorts", "Lives", "Community"]
  }
];

export interface ContentObjective {
  category: string;
  objectives: string[];
}

export const CONTENT_OBJECTIVES: ContentObjective[] = [
  {
    category: "Notoriété",
    objectives: [
      "Augmenter la visibilité de la marque",
      "Développer la communauté",
      "Améliorer la reconnaissance de marque",
      "Atteindre de nouvelles audiences"
    ]
  },
  {
    category: "Engagement",
    objectives: [
      "Augmenter les interactions",
      "Créer une communauté active",
      "Stimuler les conversations",
      "Améliorer le taux d'engagement"
    ]
  },
  {
    category: "Conversion",
    objectives: [
      "Générer des leads",
      "Augmenter les ventes",
      "Promouvoir des produits/services",
      "Diriger le trafic vers le site web"
    ]
  },
  {
    category: "Fidélisation",
    objectives: [
      "Renforcer la relation client",
      "Améliorer la satisfaction client",
      "Encourager les recommandations",
      "Développer la loyauté à la marque"
    ]
  }
];

export interface ContentType {
  category: string;
  types: string[];
}

export const CONTENT_TYPES: ContentType[] = [
  {
    category: "Visuels",
    types: [
      "Photos de produits",
      "Infographies",
      "Carrousels",
      "Stories",
      "Reels/Shorts"
    ]
  },
  {
    category: "Vidéos",
    types: [
      "Tutoriels",
      "Témoignages",
      "Behind the scenes",
      "Lives",
      "Animations"
    ]
  },
  {
    category: "Textuels",
    types: [
      "Articles de blog",
      "Posts informatifs",
      "Newsletters",
      "Études de cas",
      "Interviews"
    ]
  },
  {
    category: "Interactifs",
    types: [
      "Sondages",
      "Quiz",
      "Concours",
      "Questions/Réponses",
      "Challenges"
    ]
  }
];

export interface ToneOfVoice {
  style: string;
  description: string;
}

export const TONE_OF_VOICE: ToneOfVoice[] = [
  {
    style: "Professionnel",
    description: "Formel, expert et sérieux"
  },
  {
    style: "Décontracté",
    description: "Amical, accessible et naturel"
  },
  {
    style: "Inspirant",
    description: "Motivant, positif et énergique"
  },
  {
    style: "Éducatif",
    description: "Informatif, clair et pédagogique"
  },
  {
    style: "Humoristique",
    description: "Léger, divertissant et enjoué"
  },
  {
    style: "Premium",
    description: "Sophistiqué, élégant et exclusif"
  }
];

export const TARGET_AUDIENCES = {
  demographic: [
    "18-24 ans",
    "25-34 ans",
    "35-44 ans",
    "45-54 ans",
    "55+ ans",
    "Hommes",
    "Femmes"
  ],
  professional: [
    "Étudiants",
    "Jeunes actifs",
    "Cadres",
    "Entrepreneurs",
    "Décideurs",
    "Professionnels"
  ],
  behavioral: [
    "Early adopters",
    "Passionnés de technologie",
    "Éco-responsables",
    "Influenceurs",
    "Consommateurs premium"
  ],
  geographic: [
    "Urbain",
    "Périurbain",
    "Rural",
    "National",
    "International"
  ]
};

export const POSTING_FREQUENCY = [
  {
    network: "Facebook",
    recommendations: [
      "1-2 posts par jour",
      "Stories quotidiennes",
      "2-3 reels par semaine"
    ]
  },
  {
    network: "Instagram",
    recommendations: [
      "4-7 posts par semaine",
      "Stories quotidiennes",
      "2-3 reels par semaine"
    ]
  },
  {
    network: "LinkedIn",
    recommendations: [
      "3-5 posts par semaine",
      "1 article par semaine",
      "Stories occasionnelles"
    ]
  },
  {
    network: "Twitter",
    recommendations: [
      "3-5 tweets par jour",
      "1-2 threads par semaine",
      "Engagement quotidien"
    ]
  },
  {
    network: "TikTok",
    recommendations: [
      "1-3 vidéos par jour",
      "Lives hebdomadaires",
      "Participation aux trends"
    ]
  }
];

export interface CompetitorStrategy {
  id: string;
  label: string;
}

export const COMPETITOR_STRATEGIES: CompetitorStrategy[] = [
  {
    id: "influencers",
    label: "Utilisation efficace des influenceurs pour élargir la portée"
  },
  {
    id: "creative_campaigns",
    label: "Campagnes publicitaires créatives qui captent l'attention"
  },
  {
    id: "community_engagement",
    label: "Engagement actif avec la communauté (réponses rapides, jeux, enquêtes)"
  },
  {
    id: "video_content",
    label: "Contenu vidéo de haute qualité qui raconte une histoire"
  },
  {
    id: "promotions",
    label: "Utilisation stratégique de promotions et remises exclusives sur les réseaux sociaux"
  }
];

export interface SuccessMetric {
  id: string;
  label: string;
}

export const SUCCESS_METRICS: SuccessMetric[] = [
  {
    id: "engagement_metrics",
    label: "Nombre de likes, commentaires et partages"
  },
  {
    id: "follower_growth",
    label: "Taux de croissance des abonnés"
  },
  {
    id: "user_engagement",
    label: "Engagement des utilisateurs (temps passé sur la page, interactions)"
  },
  {
    id: "lead_conversion",
    label: "Conversion des leads en ventes"
  },
  {
    id: "campaign_roi",
    label: "Retour sur investissement des campagnes publicitaires"
  }
];

export interface RoiExpectation {
  id: string;
  label: string;
}

export const ROI_EXPECTATIONS: RoiExpectation[] = [
  {
    id: "follower_growth",
    label: "Augmentation du nombre de followers de 20% dans les six prochains mois"
  },
  {
    id: "engagement_improvement",
    label: "Amélioration de l'engagement de 30% sur tous les posts"
  },
  {
    id: "lead_generation",
    label: "Génération de 50 leads qualifiés par mois via les réseaux sociaux"
  },
  {
    id: "website_traffic",
    label: "Augmentation de 10% du trafic sur le site web provenant des réseaux sociaux"
  },
  {
    id: "campaign_roi",
    label: "Retour sur investissement de 5:1 pour les campagnes publicitaires sur les réseaux sociaux"
  }
];
