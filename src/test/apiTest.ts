import { BriefData } from '../types/brief';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const testAPIIntegration = async () => {
  const mockBriefData: BriefData = {
    companyName: 'Test Company',
    email: 'test@example.com',
    sector: 'Technology',
    companyDescription: 'A test company',
    logo: null,
    brandGuidelines: null,
    productPhotos: [],
    currentSocialNetworks: ['Facebook', 'Instagram'],
    socialMediaGoals: ['Increase brand awareness'],
    contentTypes: ['Photos', 'Videos'],
    communicationStyle: 'Professional',
    targetAudience: {
      demographic: ['25-34'],
      professional: ['Professionals'],
      behavioral: ['Tech-savvy'],
      geographic: ['Urban']
    },
    uniqueSellingPoints: 'Innovative solutions',
    customerBenefits: 'Improved efficiency',
    audienceNeeds: 'Better productivity',
    productSolution: 'Advanced software',
    competitors: 'Other tech companies',
    competitorStrategies: ['Digital marketing'],
    successMetrics: ['Engagement rate'],
    roiExpectations: ['Increased sales'],
    specificThemes: 'Innovation, Technology',
    additionalInfo: 'None',
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

  console.log('Starting API integration test...');

  try {
    // Test Strategy Generation
    console.log('Testing strategy generation...');
    const strategyResponse = await fetch(`${API_URL}/ai/gpt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: 'Generate strategy test'
        }]
      })
    });

    if (!strategyResponse.ok) {
      throw new Error(`Strategy API error: ${strategyResponse.status}`);
    }

    const strategyData = await strategyResponse.json();
    console.log('Strategy generation successful');
    console.log('Strategy analysis:', strategyData.choices[0].message.content);

    // Test Brief Generation
    console.log('Testing brief generation...');
    const briefResponse = await fetch(`${API_URL}/ai/gpt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: 'Generate brief test'
        }]
      })
    });

    if (!briefResponse.ok) {
      throw new Error(`Brief API error: ${briefResponse.status}`);
    }

    const briefData = await briefResponse.json();
    console.log('Brief generation successful');
    console.log('Brief content:', briefData.choices[0].message.content);

    // Test Visual Generation
    console.log('Testing visual generation...');
    const visualResponse = await fetch(`${API_URL}/ai/dalle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Test visual generation'
      })
    });

    if (!visualResponse.ok) {
      throw new Error(`Visual API error: ${visualResponse.status}`);
    }

    const visualData = await visualResponse.json();
    console.log('Visual generation successful');
    console.log('Generated image URL:', visualData.data[0].url);

    // Test Result Storage
    console.log('Testing result storage...');
    const resultResponse = await fetch(`${API_URL}/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        briefId: 'test-brief-id',
        strategy: {
          content: 'Test strategy content',
          analysis: {
            positioning: 'Test positioning',
            strengths: ['Strength 1', 'Strength 2'],
            opportunities: ['Opportunity 1', 'Opportunity 2']
          },
          themes: [{
            name: 'Test Theme',
            objective: 'Test objective',
            approach: 'Test approach',
            emotions: 'Test emotions',
            formats: ['Format 1'],
            networks: ['Network 1']
          }],
          calendar: {},
          recommendations: {
            visualStyle: 'Test style',
            toneOfVoice: {},
            hashtags: ['#test'],
            engagement: ['Engagement 1']
          }
        },
        briefs: {
          briefs: [{
            visualPrompt: 'Test prompt',
            content: {
              main: 'Test content',
              tagline: 'Test tagline',
              hashtags: ['#test'],
              cta: 'Test CTA',
              question: 'Test question'
            },
            specs: {
              format: 'Test format',
              dimensions: 'Test dimensions',
              altText: 'Test alt text'
            }
          }]
        },
        visualAnalysis: {
          identity: {
            colors: ['Color 1'],
            typography: ['Font 1'],
            iconography: ['Icon 1']
          },
          composition: {
            layouts: ['Layout 1'],
            grids: ['Grid 1'],
            hierarchy: ['Hierarchy 1']
          },
          recommendations: {
            palette: ['Palette 1'],
            fonts: ['Font 1'],
            elements: ['Element 1'],
            filters: ['Filter 1']
          }
        },
        executedBriefs: [{
          visualPrompt: 'Test prompt',
          content: {
            main: 'Test content',
            tagline: 'Test tagline',
            hashtags: ['#test'],
            cta: 'Test CTA',
            question: 'Test question'
          },
          specs: {
            format: 'Test format',
            dimensions: 'Test dimensions',
            altText: 'Test alt text'
          },
          image: {
            url: 'https://example.com/test.jpg',
            alt: 'Test alt',
            type: 'Test type',
            ratio: '1:1'
          }
        }]
      })
    });

    if (!resultResponse.ok) {
      throw new Error(`Result storage error: ${resultResponse.status}`);
    }

    console.log('Result storage successful');
    console.log('API integration test completed successfully');

  } catch (error) {
    console.error('API integration test failed:', error);
    throw error;
  }
};
