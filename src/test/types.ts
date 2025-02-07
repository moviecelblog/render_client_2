import { ValidationResult, ValidationDetail } from '../services/ai/imageValidationService';
import { BriefData } from '../types/brief';
import { PresetType } from '../prompts/stability/stylePresets';
import { StabilityParams } from '../prompts/stability/utils';

export interface MockValidationDetail extends ValidationDetail {
  criteriaName: string;
  score: number;
  feedback: string;
}

export interface MockValidationResult extends ValidationResult {
  score: number;
  quality: 'low' | 'medium' | 'high';
  details: MockValidationDetail[];
  suggestions: string[];
  technicalIssues: string[];
  styleIssues: string[];
  sectorIssues: string[];
}

export interface MockGenerationParams extends StabilityParams {
  width: number;
  height: number;
  cfgScale: number;
  steps: number;
  samples: number;
}

export interface MockImage {
  prompt: string;
  params: MockGenerationParams;
  url: string;
  score: number;
  quality?: 'low' | 'medium' | 'high';
  validationDetails: MockValidationResult;
  metadata: {
    purpose: string;
    timeOfDay?: string;
    sector: string;
    style: string;
    quality?: 'low' | 'medium' | 'high';
    createdAt?: number;
    lastUsed?: number;
    useCount?: number;
  };
}

export interface MockBriefData extends BriefData {
  preset: PresetType;
  validationThreshold: number;
}

export interface MockCacheResult {
  exists: boolean;
  image?: MockImage;
  similarityScore?: number;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCacheEntry {
  id: string;
  image: MockImage;
  similarityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MockCacheStats {
  totalEntries: number;
  averageScore: number;
  hitRate: number;
  cacheSize: number;
  sectorDistribution: Record<string, number>;
}

// Données de test par défaut
export const defaultMockParams: MockGenerationParams = {
  width: 1024,
  height: 1024,
  cfgScale: 7,
  steps: 30,
  samples: 1
};

export const defaultMockValidationResult: MockValidationResult = {
  score: 90,
  quality: 'high',
  details: [{
    criteriaName: 'Qualité globale',
    score: 90,
    feedback: 'Excellent'
  }],
  suggestions: [],
  technicalIssues: [],
  styleIssues: [],
  sectorIssues: []
};

export const defaultMockImage: MockImage = {
  prompt: 'test prompt',
  params: defaultMockParams,
  url: 'http://example.com/image.jpg',
  score: 90,
  quality: 'high',
  validationDetails: defaultMockValidationResult,
  metadata: {
    purpose: 'test',
    sector: 'test',
    style: 'premium',
    quality: 'high'
  }
};

export const defaultMockCacheEntry: MockCacheEntry = {
  id: 'test-id',
  image: defaultMockImage,
  similarityScore: 0.9,
  createdAt: new Date(),
  updatedAt: new Date()
};
