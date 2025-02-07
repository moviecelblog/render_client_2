export interface ValidationDetail {
  criteriaName: string;
  score: number;
  feedback: string;
}

export interface ValidationDetails {
  score: number;
  quality: string;
  details: ValidationDetail[];
  suggestions: string[];
  technicalIssues: string[];
  styleIssues: string[];
  sectorIssues: string[];
}

export interface GenerationParams {
  cfgScale?: number;
  steps?: number;
  samples?: number;
  width?: number;
  height?: number;
}

export interface CacheMetadata {
  purpose?: string;
  timeOfDay?: string;
  sector?: string;
  style?: string;
  quality?: string;
}

export interface ImageCacheEntry {
  found: boolean;
  imageUrl?: string;
  score?: number;
  validationDetails?: ValidationDetails;
}

export interface CacheStats {
  totalImages: number;
  totalSize: number;
  averageScore: number;
}

export interface ImageGenerationResult {
  url: string;
  quality: 'low' | 'medium' | 'high';
}

export interface ImageValidationResult {
  score: number;
  quality: 'low' | 'medium' | 'high';
  details: ValidationDetail[];
  suggestions: string[];
  technicalIssues: string[];
  styleIssues: string[];
  sectorIssues: string[];
}

// Re-export all types
export * from './image';
