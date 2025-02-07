import { ImageValidationService } from '../services/ai/imageValidationService';
import { ImageGenerationHistoryService } from '../services/ai/imageGenerationHistoryService';
import { ImageCacheService } from '../services/ai/imageCacheService';
import { ValidationDetails } from '../types/image';
import { BriefData } from '../types/brief';

// Mock des dépendances
jest.mock('../services/ai/imageValidationService');
jest.mock('../services/ai/imageGenerationHistoryService');
jest.mock('../services/ai/imageCacheService');

// Mock d'axios
const mockPost = jest.fn();
const mockCreate = jest.fn();

jest.doMock('axios', () => {
  return {
    __esModule: true,
    default: {
      post: mockPost,
      create: mockCreate
    }
  };
});

// Import ImageGenerationService après le mock d'axios
const { ImageGenerationService } = require('../services/ai/imageGenerationService');

const MockedImageValidationService = jest.mocked(ImageValidationService);
const MockedImageGenerationHistoryService = jest.mocked(ImageGenerationHistoryService);
const MockedImageCacheService = jest.mocked(ImageCacheService);

describe('ImageGenerationService', () => {
  const defaultMockValidationResult = {
    score: 85,
    quality: 'medium' as const,
    details: [
      {
        criteriaName: 'composition',
        score: 85,
        feedback: 'Très bon'
      }
    ],
    suggestions: [],
    technicalIssues: [],
    styleIssues: [],
    sectorIssues: []
  };

  const mockBriefData: BriefData = {
    companyName: 'test-company',
    email: 'test@company.com',
    sector: 'Technology',
    companyDescription: 'A test company',
    logo: null,
    brandGuidelines: null,
    productPhotos: [],
    currentSocialNetworks: ['LinkedIn', 'Twitter'],
    socialMediaGoals: ['Brand Awareness'],
    contentTypes: ['Product'],
    communicationStyle: 'Professional',
    targetAudience: {
      demographic: ['25-34', 'Professional'],
      professional: ['Technology'],
      behavioral: ['Early Adopters'],
      geographic: ['Global']
    },
    uniqueSellingPoints: 'Innovation and quality',
    customerBenefits: 'Improved productivity',
    audienceNeeds: 'Efficient solutions',
    productSolution: 'Advanced technology',
    competitors: 'Main competitors in tech',
    competitorStrategies: ['Digital Marketing'],
    successMetrics: ['Engagement Rate'],
    roiExpectations: ['Increased Sales'],
    specificThemes: 'Innovation',
    additionalInfo: '',
    legalConstraints: {
      regulations: [],
      compliance: [],
      disclaimers: []
    },
    budget: {
      totalBudget: 'Medium',
      allocation: { 'social media': 100 },
      constraints: []
    },
    resources: {
      internalTeam: [],
      externalPartners: [],
      tools: []
    },
    previousCampaigns: [],
    competitiveAnalysis: {
      directCompetitors: [],
      marketPosition: 'Leader',
      differentiators: ['Innovation'],
      opportunities: ['Market Growth']
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Simuler sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(() => 'test@thirdadvertising.dz'),
        setItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    // Reset les mocks d'axios
    mockPost.mockReset();
    mockCreate.mockReset();
    mockCreate.mockImplementation(() => ({
      post: mockPost
    }));

    // Configuration par défaut du mock d'axios
    mockPost.mockImplementation(() => Promise.resolve({
      data: {
        data: [{ url: '/images/generated.png' }],
        score: 85
      }
    }));

    // Configuration par défaut des autres mocks
    MockedImageValidationService.validateImage.mockResolvedValue({
      ...defaultMockValidationResult,
      quality: 'high' as const
    });
  });

  test('should handle French accented characters correctly', async () => {
    const generationId = 'test-company-1234567890';
    const accentedPrompt = 'Scène principale : Une voiture électrique élégante avec éclairage spécial';
    
    MockedImageCacheService.findInCache.mockResolvedValue({ found: false });
    MockedImageGenerationHistoryService.startSession.mockResolvedValue(generationId);

    const result = await ImageGenerationService.generateOptimizedImage(
      accentedPrompt,
      mockBriefData,
      { generationId }
    );

    expect(result).toEqual({
      url: '/images/generated.png',
      quality: 'high'
    });

    const postCalls = mockPost.mock.calls;
    expect(postCalls.length).toBe(1);
    
    const formDataSent = postCalls[0][1];
    expect(formDataSent instanceof FormData).toBe(true);
    expect(formDataSent.get('text_prompts[0][text]')).toContain('électrique');
    expect(formDataSent.get('text_prompts[0][text]')).toContain('élégante');
    expect(formDataSent.get('text_prompts[0][text]')).toContain('éclairage');
  });

  test('should use cached image if available', async () => {
    const mockCacheEntry = {
      found: true,
      imageUrl: '/images/cached.png',
      score: 85,
      validationDetails: defaultMockValidationResult
    };

    MockedImageCacheService.findInCache.mockResolvedValueOnce(mockCacheEntry);

    const result = await ImageGenerationService.generateOptimizedImage(
      'A product photo',
      mockBriefData
    );

    expect(result).toEqual({
      url: mockCacheEntry.imageUrl,
      quality: 'high'
    });
    expect(mockPost).not.toHaveBeenCalled();
  });

  test('should generate new image if not in cache', async () => {
    const generationId = 'test-company-1234567890';
    
    MockedImageCacheService.findInCache.mockResolvedValueOnce({ found: false });
    MockedImageGenerationHistoryService.startSession.mockResolvedValue(generationId);

    const result = await ImageGenerationService.generateOptimizedImage(
      'A product photo',
      mockBriefData,
      { generationId }
    );

    expect(result).toEqual({
      url: '/images/generated.png',
      quality: 'high'
    });
    expect(MockedImageValidationService.validateImage).toHaveBeenCalled();
    expect(MockedImageGenerationHistoryService.startSession).toHaveBeenCalled();
    expect(mockPost).toHaveBeenCalledTimes(1);
  });

  test('should retry generation if quality is low', async () => {
    const generationId = 'test-company-1234567890';
    
    MockedImageCacheService.findInCache.mockResolvedValue({ found: false });
    MockedImageGenerationHistoryService.startSession.mockResolvedValue(generationId);
    
    MockedImageValidationService.validateImage
      .mockResolvedValueOnce({
        ...defaultMockValidationResult,
        score: 65,
        quality: 'low' as const
      })
      .mockResolvedValueOnce({
        ...defaultMockValidationResult,
        score: 85,
        quality: 'high' as const
      });

    mockPost
      .mockResolvedValueOnce({
        data: {
          data: [{ url: '/images/generated-1.png' }],
          score: 65
        }
      })
      .mockResolvedValueOnce({
        data: {
          data: [{ url: '/images/generated-2.png' }],
          score: 85
        }
      });

    const result = await ImageGenerationService.generateOptimizedImage(
      'A product photo',
      mockBriefData,
      { generationId }
    );

    expect(result).toEqual({
      url: '/images/generated-2.png',
      quality: 'high'
    });
    expect(MockedImageValidationService.validateImage).toHaveBeenCalledTimes(2);
    expect(mockPost).toHaveBeenCalledTimes(2);
  });

  test('should handle API errors gracefully', async () => {
    const generationId = 'test-company-1234567890';
    
    MockedImageCacheService.findInCache.mockResolvedValue({ found: false });
    MockedImageGenerationHistoryService.startSession.mockResolvedValue(generationId);
    
    mockPost.mockRejectedValueOnce(new Error('API Error'));

    await expect(
      ImageGenerationService.generateOptimizedImage('A product photo', mockBriefData, { generationId })
    ).rejects.toThrow('API Error');

    expect(MockedImageGenerationHistoryService.completeSession).toHaveBeenCalledWith(
      generationId,
      false
    );
  });
});
