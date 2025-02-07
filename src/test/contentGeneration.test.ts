import { ImageCacheService } from '../services/ai/imageCacheService';
import { ValidationDetails } from '../types/image';

jest.mock('../services/ai/imageCacheService');

describe('ImageCacheService', () => {
  const mockBriefId = 'test-brief-123';
  const mockImage = {
    url: '/images/test.png',
    params: {
      cfgScale: 7,
      steps: 30,
      samples: 1
    },
    score: 85,
    validationDetails: {
      score: 85,
      quality: 'medium',
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
    } as ValidationDetails,
    metadata: {
      purpose: 'social',
      quality: 'high'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should add image to cache', async () => {
    await ImageCacheService.addToCache(
      'test prompt',
      mockBriefId,
      mockImage.params,
      mockImage.url,
      mockImage.score,
      mockImage.validationDetails,
      mockImage.metadata
    );

    const result = await ImageCacheService.findInCache(
      'test prompt',
      mockImage.params,
      mockImage.metadata
    );

    expect(result.found).toBe(true);
    expect(result.imageUrl).toBe(mockImage.url);
    expect(result.score).toBe(mockImage.score);
  });

  test('should find similar images', async () => {
    await ImageCacheService.addToCache(
      'test prompt with similar words',
      mockBriefId,
      mockImage.params,
      mockImage.url,
      mockImage.score,
      mockImage.validationDetails,
      mockImage.metadata
    );

    const result = await ImageCacheService.findInCache(
      'test prompt with similar words',
      mockImage.params,
      mockImage.metadata
    );

    expect(result.found).toBe(true);
    expect(result.imageUrl).toBe(mockImage.url);
  });

  test('should get cache statistics', async () => {
    await ImageCacheService.addToCache(
      'test prompt',
      mockBriefId,
      mockImage.params,
      mockImage.url,
      mockImage.score,
      mockImage.validationDetails,
      mockImage.metadata
    );

    const stats = await ImageCacheService.getStats();
    expect(stats.totalImages).toBe(1);
    expect(stats.averageScore).toBe(mockImage.score);
  });

  test('should clear cache', async () => {
    await ImageCacheService.addToCache(
      'test prompt',
      mockBriefId,
      mockImage.params,
      mockImage.url,
      mockImage.score,
      mockImage.validationDetails,
      mockImage.metadata
    );

    await ImageCacheService.clearCache(30);

    const result = await ImageCacheService.findInCache(
      'test prompt',
      mockImage.params,
      mockImage.metadata
    );
    expect(result.found).toBe(false);
  });

  test('should handle multiple cache entries', async () => {
    const prompts = Array.from({ length: 5 }, (_, i) => `test prompt ${i}`);
    const promises = prompts.map(prompt =>
      ImageCacheService.addToCache(
        prompt,
        mockBriefId,
        mockImage.params,
        mockImage.url,
        mockImage.score,
        mockImage.validationDetails,
        mockImage.metadata
      )
    );

    await Promise.all(promises);

    const stats = await ImageCacheService.getStats();
    expect(stats.totalImages).toBe(5);
  });

  test('should handle cache miss gracefully', async () => {
    const result = await ImageCacheService.findInCache(
      'non-existent prompt',
      mockImage.params,
      mockImage.metadata
    );

    expect(result.found).toBe(false);
  });

  test('should handle invalid cache operations', async () => {
    await expect(ImageCacheService.clearCache(-1)).rejects.toThrow();
  });

  test('should handle different quality levels', async () => {
    const qualities = ['low', 'medium', 'high'] as const;

    for (const quality of qualities) {
      await ImageCacheService.addToCache(
        `test prompt ${quality}`,
        mockBriefId,
        mockImage.params,
        mockImage.url,
        mockImage.score,
        {
          ...mockImage.validationDetails,
          quality
        },
        {
          ...mockImage.metadata,
          quality
        }
      );

      const result = await ImageCacheService.findInCache(
        `test prompt ${quality}`,
        mockImage.params,
        {
          ...mockImage.metadata,
          quality
        }
      );

      expect(result.found).toBe(true);
      if (result.found) {
        expect(result.validationDetails?.quality).toBe(quality);
      }
    }
  });
});
