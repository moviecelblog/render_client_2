import { AIService } from '../services/ai';
import { BriefData } from '../types/brief';

describe('AIService', () => {
  const mockBriefData: BriefData = {
    companyName: 'Test Company',
    email: 'test@example.com',
    sector: 'Technology',
    companyDescription: 'A test company',
    communicationStyle: 'Professional',
    logo: null,
    brandGuidelines: null,
    productPhotos: [],
    currentSocialNetworks: ['Facebook', 'Instagram'],
    socialMediaGoals: ['Increase visibility'],
    contentTypes: ['Photos', 'Videos'],
    targetAudience: {
      demographic: ['25-34'],
      professional: ['Professionals'],
      behavioral: ['Tech-savvy'],
      geographic: ['Urban']
    },
    uniqueSellingPoints: 'Innovation',
    customerBenefits: 'Efficiency',
    audienceNeeds: 'Productivity',
    productSolution: 'Software solution',
    competitors: 'Other tech companies',
    competitorStrategies: ['Digital marketing'],
    successMetrics: ['Engagement rate'],
    roiExpectations: ['Growth'],
    specificThemes: 'Technology, Innovation',
    additionalInfo: '',
    legalConstraints: {
      regulations: ['GDPR', 'Data protection'],
      compliance: ['ISO standards'],
      disclaimers: ['Terms of use']
    },
    budget: {
      totalBudget: '100000€',
      allocation: {
        "Photo/Vidéo": 30,
        "Social Media": 30,
        "Influence": 20,
        "Événementiel": 20
      },
      constraints: ['Quarterly budget']
    },
    resources: {
      internalTeam: ['Marketing Manager', 'Content Creator'],
      externalPartners: ['Creative Agency'],
      tools: ['Adobe Suite', 'Social Media Tools']
    },
    previousCampaigns: [{
      name: 'Product Launch 2023',
      period: 'Q3 2023',
      results: ['1M impressions', '+20% engagement'],
      learnings: ['Video content performs better', 'Morning posts get more engagement']
    }],
    competitiveAnalysis: {
      directCompetitors: [{
        name: 'Competitor A',
        strengths: ['Market presence'],
        weaknesses: ['High prices'],
        strategies: ['Content marketing']
      }],
      marketPosition: 'Innovator',
      differentiators: ['Advanced technology'],
      opportunities: ['Market expansion']
    }
  };

  test('generateContent should return success', async () => {
    const result = await AIService.generateContent(mockBriefData);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  test('generateContent should handle errors', async () => {
    const invalidData = { ...mockBriefData, companyName: '' };
    const result = await AIService.generateContent(invalidData as BriefData);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
