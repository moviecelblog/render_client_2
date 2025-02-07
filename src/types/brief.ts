export interface BriefData {
  companyName: string;
  email: string;
  sector: string;
  companyDescription: string;
  logo: File | null;
  brandGuidelines: File | null;
  productPhotos: File[];
  currentSocialNetworks: string[];
  socialMediaGoals: string[];
  contentTypes: string[];
  communicationStyle: string;
  targetAudience: {
    demographic: string[];
    professional: string[];
    behavioral: string[];
    geographic: string[];
  };
  uniqueSellingPoints: string;
  customerBenefits: string;
  audienceNeeds: string;
  productSolution: string;
  competitors: string;
  competitorStrategies: string[];
  successMetrics: string[];
  roiExpectations: string[];
  specificThemes: string;
  additionalInfo: string;
  // Nouveaux champs
  legalConstraints: {
    regulations: string[];
    compliance: string[];
    disclaimers: string[];
  };
  budget: {
    totalBudget: string;
    allocation: Record<string, number>;
    constraints: string[];
  };
  resources: {
    internalTeam: string[];
    externalPartners: string[];
    tools: string[];
  };
  previousCampaigns: {
    name: string;
    period: string;
    results: string[];
    learnings: string[];
  }[];
  competitiveAnalysis: {
    directCompetitors: {
      name: string;
      strengths: string[];
      weaknesses: string[];
      strategies: string[];
    }[];
    marketPosition: string;
    differentiators: string[];
    opportunities: string[];
  };
}

export interface AIError {
  code: string;
  message: string;
  service?: string;
}

export interface Theme {
  name: string;
  objective: string;
  approach: string;
  emotions: string;
  formats: string[];
  networks: string[];
}

export interface SocialMediaPost {
  platform: string;
  content: string;
  callToAction: string;
  hashtags: string[];
}

export interface ContentVariations {
  short: string;
  detailed: string;
  narrative: string;
}

export interface Engagement {
  questions: string[];
  polls: string[];
  responses: string[];
}

export interface Image {
  url: string;
  alt: string;
  type: string;
  ratio: string;
  quality?: 'low' | 'medium' | 'high';
}

export interface VisualVariations {
  withText: string;
  withoutText: string;
  abTesting: string[];
}

export interface Strategy {
  content: string;
  analysis: {
    positioning: string;
    strengths: string[];
    opportunities: string[];
  };
  themes: Theme[];
  calendar: Record<string, any>;
  recommendations: {
    visualStyle: string;
    toneOfVoice: Record<string, string>;
    hashtags: string[];
    engagement: string[];
  };
}

export interface CreativeBrief {
  visualPrompt?: string;
  content: {
    main: string;
    tagline: string;
    hashtags: string[];
    cta: string;
    question: string;
  };
  specs: {
    format: string;
    dimensions: string;
    altText: string;
  };
}

export interface ExecutedBrief extends CreativeBrief {
  image: {
    url: string;
    alt: string;
    type: string;
    ratio: string;
    quality?: 'low' | 'medium' | 'high';
  };
}

export interface VisualAnalysis {
  identity: {
    colors: string[];
    typography: string[];
    iconography: string[];
  };
  composition: {
    layouts: string[];
    grids: string[];
    hierarchy: string[];
  };
  recommendations: {
    palette: string[];
    fonts: string[];
    elements: string[];
    filters: string[];
  };
}

export interface AIServiceResponse {
  briefId: string;
  strategy: Strategy;
  briefs?: {
    briefs: CreativeBrief[];
  };
  visualAnalysis?: VisualAnalysis;
  executedBriefs?: ExecutedBrief[];
  createdAt?: string;
  updatedAt?: string;
}
