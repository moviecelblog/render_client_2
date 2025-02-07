import { BriefData } from '../../types/brief';
import {
  generateCompleteStrategy,
  StrategyGenerationResult,
  StrategyGenerationOptions
} from '../../prompts/gpt/strategy';
import { config } from '../../config/env';

interface StrategyMetrics {
  executionTime: number;
  tokenCount: number;
  retryCount: number;
  validationScore: number;
  cacheMiss: boolean;
}

interface GenerationResponse {
  success: boolean;
  result?: StrategyGenerationResult;
  metrics?: StrategyMetrics;
  error?: string;
}

export class StrategyGenerationService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2000;
  private static readonly TOKEN_LIMIT = 1500; // Réduit pour éviter les dépassements
  private static readonly CACHE_TTL = 3600; // 1 heure en secondes
  private static readonly MAX_SECTION_LENGTH = 1000; // Limite la taille des sections

  static async generateStrategy(
    briefData: BriefData,
    options: StrategyGenerationOptions = {}
  ): Promise<{
    result: StrategyGenerationResult;
    metrics: StrategyMetrics;
  }> {
    const startTime = Date.now();
    let retryCount = 0;

    try {
      // 1. Vérifier le cache
      const cachedStrategy = await this.checkCache(briefData);
      if (cachedStrategy) {
        return {
          result: cachedStrategy,
          metrics: {
            executionTime: 0,
            tokenCount: this.estimateTokenCount(cachedStrategy),
            retryCount: 0,
            validationScore: cachedStrategy.validation.score,
            cacheMiss: false
          }
        };
      }

      // 2. Générer la stratégie
      let result: StrategyGenerationResult | null = null;
      let error: Error | null = null;

      while (retryCount < this.MAX_RETRIES && !result) {
        try {
          const response = await fetch(`${config.apiUrl}/ai/gpt`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${sessionStorage.getItem('userEmail')}`
            },
            body: JSON.stringify({
              messages: [{ 
                role: 'user', 
                content: generateCompleteStrategy(briefData)
              }],
              maxTokens: this.TOKEN_LIMIT,
              type: 'strategy',
              temperature: 0.7,
              presencePenalty: 0.3,
              frequencyPenalty: 0.3,
              options: {
                ...options,
                validationCriteria: {
                  minPositioningLength: 30,
                  minStrengthLength: 20,
                  minOpportunityLength: 20,
                  requiredThemeElements: ['objectif', 'angle', 'émotions'],
                  minRecommendations: 2
                }
              }
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
          }

          const data: GenerationResponse = await response.json();
          
          if (data.success && data.result) {
            result = this.validateAndCleanStrategy(data.result);
            if (result.validation.isValid) {
              break;
            }
          }

          console.log(`Tentative ${retryCount + 1}: Validation échouée`);
          retryCount++;
          if (retryCount < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          }
        } catch (e) {
          error = e as Error;
          console.error(`Erreur tentative ${retryCount + 1}:`, error);
          retryCount++;
          if (retryCount < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          }
        }
      }

      if (!result) {
        throw error || new Error('Échec de la génération de stratégie après plusieurs tentatives');
      }

      // 3. Calculer les métriques
      const metrics: StrategyMetrics = {
        executionTime: Date.now() - startTime,
        tokenCount: this.estimateTokenCount(result),
        retryCount,
        validationScore: result.validation.score,
        cacheMiss: true
      };

      // 4. Mettre en cache et sauvegarder les métriques
      await Promise.all([
        this.cacheStrategy(briefData, result),
        this.saveMetrics(briefData, metrics, result.validation.isValid)
      ]);

      return { result, metrics };
    } catch (error) {
      console.error('Erreur lors de la génération de la stratégie:', error);
      throw error;
    }
  }

  private static async checkCache(briefData: BriefData): Promise<StrategyGenerationResult | null> {
    try {
      const response = await fetch(`${config.apiUrl}/ai/strategy/cache`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('userEmail')}`
        },
        body: JSON.stringify({ briefData })
      });

      if (response.ok) {
        const data = await response.json();
        return data.result || null;
      }
      return null;
    } catch (error) {
      console.warn('Erreur lors de la vérification du cache:', error);
      return null;
    }
  }

  private static async cacheStrategy(briefData: BriefData, result: StrategyGenerationResult): Promise<void> {
    try {
      await fetch(`${config.apiUrl}/ai/strategy/cache`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('userEmail')}`
        },
        body: JSON.stringify({
          briefData,
          result,
          ttl: this.CACHE_TTL
        })
      });
    } catch (error) {
      console.warn('Erreur lors de la mise en cache:', error);
    }
  }

  private static async saveMetrics(
    briefData: BriefData,
    metrics: StrategyMetrics,
    success: boolean
  ): Promise<void> {
    try {
      await fetch(`${config.apiUrl}/ai/strategy/metrics`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('userEmail')}`
        },
        body: JSON.stringify({
          briefData,
          metrics,
          success
        })
      });
    } catch (error) {
      console.warn('Erreur lors de la sauvegarde des métriques:', error);
    }
  }

  private static validateAndCleanStrategy(result: StrategyGenerationResult): StrategyGenerationResult {
    // Nettoyer et valider chaque section
    const cleanResult = {
      ...result,
      marketAnalysis: this.cleanText(result.marketAnalysis),
      strategicAnalysis: this.cleanText(result.strategicAnalysis),
      recommendations: this.cleanText(result.recommendations)
    };

    // Générer le feedback et le score de validation
    const { score, feedback } = this.calculateValidationScore(cleanResult);
    
    return {
      ...cleanResult,
      validation: {
        isValid: score >= 70,
        score,
        feedback
      }
    };
  }

  private static cleanText(text: string): string {
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n')
      .slice(0, this.MAX_SECTION_LENGTH); // Limite de taille par section
  }

  private static calculateValidationScore(result: StrategyGenerationResult): { score: number; feedback: string[] } {
    let score = 100;
    const feedback: string[] = [];

    // Vérifier la longueur minimale des sections principales
    if (result.marketAnalysis.length < 100) {
      score -= 20;
      feedback.push('Analyse de marché trop courte');
    }
    if (result.strategicAnalysis.length < 100) {
      score -= 20;
      feedback.push('Analyse stratégique trop courte');
    }
    if (result.recommendations.length < 100) {
      score -= 20;
      feedback.push('Recommandations trop courtes');
    }

    // Vérifier la présence de mots-clés importants
    const keywords = ['objectif', 'stratégie', 'cible', 'action'];
    const missingKeywords: string[] = [];
    
    keywords.forEach(keyword => {
      const content = [
        result.marketAnalysis,
        result.strategicAnalysis,
        result.recommendations
      ].join(' ').toLowerCase();
      
      if (!content.includes(keyword)) {
        score -= 5;
        missingKeywords.push(keyword);
      }
    });

    if (missingKeywords.length > 0) {
      feedback.push(`Mots-clés manquants : ${missingKeywords.join(', ')}`);
    }

    return {
      score: Math.max(0, score),
      feedback: feedback.length > 0 ? feedback : ['Stratégie validée avec succès']
    };
  }

  private static estimateTokenCount(result: StrategyGenerationResult): number {
    const totalText = [
      result.marketAnalysis,
      result.strategicAnalysis,
      result.recommendations
    ].join(' ');

    // Estimation plus précise : ~1.3 tokens par mot en moyenne
    const wordCount = totalText.split(/\s+/).length;
    return Math.ceil(wordCount * 1.3);
  }
}
