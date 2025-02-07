import { BriefData } from '../../types/brief';
import { config } from '../../config/env';

export interface ValidationDetail {
  criteriaName: string;
  score: number;
  feedback: string;
}

export interface ValidationResult {
  score: number;
  quality: 'low' | 'medium' | 'high';
  details: ValidationDetail[];
  suggestions: string[];
  technicalIssues: string[];
  styleIssues: string[];
  sectorIssues: string[];
}

export class ImageValidationService {
  private static readonly CRITERIA_WEIGHTS = {
    composition: 0.3,
    lighting: 0.2,
    color: 0.2,
    sharpness: 0.15,
    style: 0.15
  };

  private static readonly QUALITY_THRESHOLDS = {
    HIGH: 90,
    MEDIUM: 80,
    LOW: 70
  };

  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000;

  private static getAuthHeaders() {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
      throw new Error('Utilisateur non authentifié');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userEmail}`
    };
  }

  private static determineQuality(score: number): 'low' | 'medium' | 'high' {
    if (score >= this.QUALITY_THRESHOLDS.HIGH) return 'high';
    if (score >= this.QUALITY_THRESHOLDS.MEDIUM) return 'medium';
    return 'low';
  }

  static async validateImage(
    imageUrl: string,
    briefData: BriefData
  ): Promise<ValidationResult> {
    let retryCount = 0;

    while (retryCount < this.MAX_RETRIES) {
      try {
        const response = await fetch(`${config.apiUrl}/ai/validate-image`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            imageUrl,
            briefData,
            criteria: Object.keys(this.CRITERIA_WEIGHTS)
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(`Erreur validation: ${response.status}, details: ${JSON.stringify(errorData)}`);
        }

        const result = await response.json();
        return this.processValidationResult(result, briefData);

      } catch (error) {
        console.error(`Erreur validation image (tentative ${retryCount + 1}):`, error);
        retryCount++;
        if (retryCount < this.MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
        }
      }
    }

    console.warn('Utilisation de la validation par défaut après échec des tentatives');
    return this.getDefaultValidationResult();
  }

  private static processValidationResult(
    rawResult: any,
    briefData: BriefData
  ): ValidationResult {
    try {
      const details: ValidationDetail[] = [];
      let totalScore = 0;

      // Évaluer chaque critère
      Object.entries(this.CRITERIA_WEIGHTS).forEach(([criteria, weight]) => {
        const criteriaScore = this.evaluateCriteria(criteria, rawResult, briefData);
        totalScore += criteriaScore * weight;
        details.push({
          criteriaName: criteria,
          score: criteriaScore,
          feedback: this.getFeedback(criteria, criteriaScore)
        });
      });

      const finalScore = Math.round(totalScore);
      const quality = this.determineQuality(finalScore);

      return {
        score: finalScore,
        quality,
        details,
        suggestions: this.generateSuggestions(details),
        technicalIssues: this.identifyTechnicalIssues(rawResult),
        styleIssues: this.identifyStyleIssues(rawResult, briefData),
        sectorIssues: this.identifySectorIssues(rawResult, briefData)
      };
    } catch (error) {
      console.error('Erreur lors du traitement du résultat de validation:', error);
      return this.getDefaultValidationResult();
    }
  }

  private static evaluateCriteria(
    criteria: string,
    result: any,
    briefData: BriefData
  ): number {
    try {
      // Logique d'évaluation spécifique à chaque critère
      switch (criteria) {
        case 'composition':
          return this.evaluateComposition(result);
        case 'lighting':
          return this.evaluateLighting(result);
        case 'color':
          return this.evaluateColor(result, briefData);
        case 'sharpness':
          return this.evaluateSharpness(result);
        case 'style':
          return this.evaluateStyle(result, briefData);
        default:
          return 70; // Score par défaut acceptable
      }
    } catch (error) {
      console.warn(`Erreur lors de l'évaluation du critère ${criteria}:`, error);
      return 70; // Score par défaut en cas d'erreur
    }
  }

  private static evaluateComposition(result: any): number {
    return result?.composition?.score || 85;
  }

  private static evaluateLighting(result: any): number {
    return result?.lighting?.score || 80;
  }

  private static evaluateColor(result: any, briefData: BriefData): number {
    return result?.color?.score || 90;
  }

  private static evaluateSharpness(result: any): number {
    return result?.sharpness?.score || 85;
  }

  private static evaluateStyle(result: any, briefData: BriefData): number {
    return result?.style?.score || 85;
  }

  private static getFeedback(criteria: string, score: number): string {
    if (score >= this.QUALITY_THRESHOLDS.HIGH) return 'Excellent';
    if (score >= this.QUALITY_THRESHOLDS.MEDIUM) return 'Très bon';
    if (score >= this.QUALITY_THRESHOLDS.LOW) return 'Bon';
    if (score >= 60) return 'Acceptable';
    return 'À améliorer';
  }

  private static generateSuggestions(details: ValidationDetail[]): string[] {
    const suggestions: string[] = [];
    details.forEach(detail => {
      if (detail.score < this.QUALITY_THRESHOLDS.LOW) {
        suggestions.push(`Améliorer ${detail.criteriaName}: ${detail.feedback}`);
      }
    });
    return suggestions;
  }

  private static identifyTechnicalIssues(result: any): string[] {
    const issues: string[] = [];
    if (result?.technicalIssues?.length > 0) {
      issues.push(...result.technicalIssues);
    }
    return issues;
  }

  private static identifyStyleIssues(result: any, briefData: BriefData): string[] {
    const issues: string[] = [];
    if (result?.styleIssues?.length > 0) {
      issues.push(...result.styleIssues);
    }
    return issues;
  }

  private static identifySectorIssues(result: any, briefData: BriefData): string[] {
    const issues: string[] = [];
    if (result?.sectorIssues?.length > 0) {
      issues.push(...result.sectorIssues);
    }
    return issues;
  }

  private static getDefaultValidationResult(): ValidationResult {
    const defaultScore = this.QUALITY_THRESHOLDS.LOW;
    return {
      score: defaultScore,
      quality: this.determineQuality(defaultScore),
      details: Object.keys(this.CRITERIA_WEIGHTS).map(criteria => ({
        criteriaName: criteria,
        score: defaultScore,
        feedback: 'Score par défaut'
      })),
      suggestions: ['Validation automatique indisponible'],
      technicalIssues: [],
      styleIssues: [],
      sectorIssues: []
    };
  }
}
