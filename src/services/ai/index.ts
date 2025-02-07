import { generateStrategicAnalysis } from '../../prompts/gpt/strategicAnalysis';
import { generateVisualAnalysis } from '../../prompts/gpt/creativePrompts';
import { BriefData, AIServiceResponse, AIError, Theme, CreativeBrief } from '../../types/brief';
import { DBService } from '../db';
import { EditorialThemeService } from './editorialThemeService';
import { BriefGenerationService } from './briefGenerationService';
import { ImageGenerationService } from './imageGenerationService';
import { config } from '../../config/env';
import { v4 as uuidv4 } from 'uuid';

interface AIResponse {
  success: boolean;
  data?: AIServiceResponse;
  error?: AIError;
}

interface GenerationError {
  message: string;
  code?: string;
}

interface FailedBrief {
  brief: CreativeBrief;
  error: GenerationError;
}

type ProgressCallback = (stage: 'strategy' | 'themes' | 'briefs' | 'visuals' | 'execution') => void;

export class AIService {
  private static readonly RETRY_DELAY = 8000;
  private static readonly MAX_RETRIES = 5;
  private static readonly STABILITY_DELAY = 5000;
  private static readonly STAGE_DELAY = 4000;

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

  private static async retryWithDelay<T>(
    operation: () => Promise<T>,
    retries: number = AIService.MAX_RETRIES,
    progressiveDelay: boolean = true
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      if (retries > 0) {
        const delay = progressiveDelay ? 
          AIService.RETRY_DELAY * (AIService.MAX_RETRIES - retries + 1) : 
          AIService.RETRY_DELAY;
        
        console.log(`Retry dans ${delay}ms (${retries} restants)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return AIService.retryWithDelay(operation, retries - 1, progressiveDelay);
      }
      throw error;
    }
  }

  static async generateContent(
    briefData: BriefData, 
    onProgress?: ProgressCallback
  ): Promise<AIResponse> {
    const briefId = uuidv4();
    let currentResult: AIServiceResponse = {
      briefId,
      strategy: {
        content: '',
        analysis: {
          positioning: '',
          strengths: [],
          opportunities: []
        },
        themes: [],
        calendar: {},
        recommendations: {
          visualStyle: '',
          toneOfVoice: {},
          hashtags: [],
          engagement: []
        }
      }
    };
    
    try {
      // Vérifier l'authentification avant de commencer
      const headers = this.getAuthHeaders();
      console.log("Démarrage de la génération de contenu...");
      
      // 1. Génération de la stratégie
      const strategyPrompt = generateStrategicAnalysis(briefData);
      const strategyResponse = await this.retryWithDelay(async () => {
        const response = await fetch(`${config.apiUrl}/ai/gpt`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            messages: [{ role: 'user', content: strategyPrompt }],
            maxTokens: 3000
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Erreur API GPT: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Transformer la réponse dans le format attendu par le frontend
        currentResult.strategy = {
          content: content,
          analysis: {
            positioning: this.extractPositioning(content),
            strengths: this.extractBulletPoints(content, "Forces"),
            opportunities: this.extractBulletPoints(content, "Opportunités")
          },
          themes: [],
          calendar: {},
          recommendations: {
            visualStyle: this.extractBulletPoints(content, "Style visuel").join(' '),
            toneOfVoice: {},
            hashtags: this.extractBulletPoints(content, "Hashtags"),
            engagement: this.extractBulletPoints(content, "Tactiques")
          }
        };

        // Sauvegarder la stratégie
        await DBService.saveResult(briefId, { strategy: currentResult.strategy });
        return currentResult.strategy;
      });

      onProgress?.('strategy');
      console.log("Stratégie générée et sauvegardée");
      
      await new Promise(resolve => setTimeout(resolve, this.STAGE_DELAY));

      // 2. Génération des thèmes éditoriaux
      console.log("Génération des thèmes éditoriaux...");
      const themes = await EditorialThemeService.generateEditorialThemes(briefData, strategyResponse);
      currentResult.strategy.themes = themes;
      onProgress?.('themes');
      console.log("Thèmes éditoriaux générés");

      await new Promise(resolve => setTimeout(resolve, this.STAGE_DELAY));
      
      // 3. Génération des briefs à partir des thèmes
      console.log("Génération des briefs...");
      const briefs = await BriefGenerationService.generateAllBriefs(
        briefData,
        themes,
        briefId,
        (count) => {
          console.log(`${count} briefs générés`);
          onProgress?.('briefs');
        }
      );

      currentResult.briefs = { briefs };
      await DBService.updateResult(briefId, { briefs: { briefs } });
      console.log("Briefs créatifs générés et sauvegardés");
      
      await new Promise(resolve => setTimeout(resolve, this.STAGE_DELAY));

      // 4. Analyse visuelle
      const visualAnalysisPrompt = generateVisualAnalysis(briefData);
      const visualAnalysis = await this.retryWithDelay(async () => {
        const response = await fetch(`${config.apiUrl}/ai/gpt`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            messages: [{ role: 'user', content: visualAnalysisPrompt }],
            maxTokens: 2000
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || `Erreur API GPT: ${response.status}`);
        }

        const data = await response.json();
        return this.parseVisualAnalysis(data.choices[0].message.content);
      });

      currentResult.visualAnalysis = visualAnalysis;
      await DBService.updateResult(briefId, { visualAnalysis });
      
      onProgress?.('visuals');
      console.log("Analyse visuelle générée et sauvegardée");
      
      await new Promise(resolve => setTimeout(resolve, this.STAGE_DELAY));

      // 5. Génération des images une par une
      const executedBriefs: CreativeBrief[] = [];
      const failedBriefs: FailedBrief[] = [];
      
      if (currentResult.briefs?.briefs) {
        for (const [index, brief] of currentResult.briefs.briefs.entries()) {
          const timeOfDay = brief.content.main.toLowerCase().includes('soir') ? 'sunset' :
                          brief.content.main.toLowerCase().includes('nuit') ? 'night' :
                          brief.content.main.toLowerCase().includes('matin') ? 'morning' : undefined;

          try {
            console.log(`Génération de l'image ${index + 1}/${currentResult.briefs.briefs.length}`);

            const { url: imageUrl } = await this.retryWithDelay(
              async () => ImageGenerationService.generateOptimizedImage(
                brief.visualPrompt || `A professional photo of a ${briefData.companyName} product with ${brief.content.main}`,
                briefData,
                {
                  purpose: 'social',
                  timeOfDay
                }
              ),
              3,
              true
            );

            const executedBrief = {
              visualPrompt: brief.visualPrompt,
              content: brief.content,
              specs: brief.specs,
              image: {
                url: imageUrl,
                alt: brief.specs.altText || brief.content.main,
                type: brief.specs.format,
                ratio: brief.specs.dimensions,
                quality: 'high'
              }
            };
            executedBriefs.push(executedBrief);
            await DBService.updateResult(briefId, { executedBriefs });
            
            if (index < currentResult.briefs.briefs.length - 1) {
              await new Promise(resolve => setTimeout(resolve, this.STABILITY_DELAY));
            }
          } catch (error) {
            console.error(`Erreur lors de la génération de l'image ${index + 1}:`, error);
            failedBriefs.push({ 
              brief, 
              error: { 
                message: error instanceof Error ? error.message : 'Erreur inconnue',
                code: error instanceof Error ? error.name : 'UNKNOWN_ERROR'
              } 
            });
            
            await DBService.updateResult(briefId, { 
              executedBriefs,
              failedBriefs: failedBriefs.map(f => ({
                visualPrompt: f.brief.visualPrompt,
                error: f.error.message
              }))
            });
            
            continue;
          }
        }
      }
      
      onProgress?.('execution');
      console.log("Briefs exécutés et sauvegardés");

      const finalResult = await DBService.getResult(briefId);
      console.log("Résultat final:", {
        totalBriefs: finalResult?.briefs?.briefs?.length || 0,
        executedBriefs: finalResult?.executedBriefs?.length || 0,
        failedBriefs: failedBriefs.length
      });
      
      if (!finalResult) {
        throw new Error('Échec de la récupération du contenu généré');
      }

      return {
        success: true,
        data: finalResult
      };
    } catch (error: any) {
      console.error('Erreur détaillée lors de la génération du contenu:', error);
      return {
        success: false,
        error: {
          code: error instanceof Error ? 'GENERATION_ERROR' : (error as AIError).code,
          message: error instanceof Error ? error.message : (error as AIError).message,
          service: (error as AIError).service
        }
      };
    }
  }

  private static extractPositioning(content: string): string {
    const positioningRegex = /Positionnement[^:]*:\s*([^\n]+)/i;
    const match = content.match(positioningRegex);
    return match ? match[1].trim() : '';
  }

  private static extractBulletPoints(content: string, section: string): string[] {
    const regex = new RegExp(`${section}[^:]*:([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
    const match = content.match(regex);
    if (!match) return [];
    
    return match[1]
      .split('\n')
      .map(line => line.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);
  }

  private static parseVisualAnalysis(content: string): any {
    return {
      identity: {
        colors: this.extractBulletPoints(content, 'Couleurs'),
        typography: this.extractBulletPoints(content, 'Typographie'),
        iconography: this.extractBulletPoints(content, 'Iconographie')
      },
      composition: {
        layouts: this.extractBulletPoints(content, 'Layouts'),
        grids: this.extractBulletPoints(content, 'Grilles'),
        hierarchy: this.extractBulletPoints(content, 'Hiérarchie')
      },
      recommendations: {
        palette: this.extractBulletPoints(content, 'Palette'),
        fonts: this.extractBulletPoints(content, 'Polices'),
        elements: this.extractBulletPoints(content, 'Éléments'),
        filters: this.extractBulletPoints(content, 'Filtres')
      }
    };
  }
}
