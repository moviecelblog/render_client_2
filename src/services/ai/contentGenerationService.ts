import { BriefData, Strategy, Theme, CreativeBrief, AIServiceResponse, ExecutedBrief } from '../../types/brief';
import { StrategyGenerationService } from './strategyGenerationService';
import { EditorialThemeService } from './editorialThemeService';
import { BriefGenerationService } from './briefGenerationService';
import { ImageGenerationService } from './imageGenerationService';
import { DBService } from '../db';

interface GeneratedImageResult {
  url: string | { url: string };
  quality: 'low' | 'medium' | 'high';
}

export class ContentGenerationService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2000;
  private static readonly IMAGE_GENERATION_DELAY = 5000;

  static async generateContent(
    briefData: BriefData,
    briefId: string,
    onProgress?: (phase: string, progress: number) => void
  ): Promise<AIServiceResponse> {
    try {
      // Phase 1: Génération de la stratégie
      onProgress?.('strategy', 0);
      console.log('Phase 1: Génération de la stratégie');
      
      // Initialiser avec une stratégie par défaut
      let strategy: Strategy = this.createDefaultStrategy(briefData);
      let retryCount = 0;
      
      // Tenter de générer une meilleure stratégie
      while (retryCount < this.MAX_RETRIES) {
        try {
          const { result: strategyResult } = await StrategyGenerationService.generateStrategy(briefData);
          strategy = this.createStrategy(strategyResult);
          await DBService.updateResult(briefId, { strategy });
          break;
        } catch (error) {
          console.error(`Erreur génération stratégie (tentative ${retryCount + 1}):`, error);
          retryCount++;
          if (retryCount < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          }
        }
      }

      // Si toutes les tentatives ont échoué, on garde la stratégie par défaut
      if (retryCount === this.MAX_RETRIES) {
        console.warn('Utilisation de la stratégie par défaut après échec des tentatives');
        await DBService.updateResult(briefId, { strategy });
      }

      onProgress?.('strategy', 100);

      // Phase 2: Génération des thèmes éditoriaux
      onProgress?.('themes', 0);
      console.log('Phase 2: Génération des thèmes éditoriaux');
      
      let themes: Theme[] = this.createDefaultThemes(briefData);
      retryCount = 0;
      
      while (retryCount < this.MAX_RETRIES) {
        try {
          const generatedThemes = await EditorialThemeService.generateEditorialThemes(briefData, strategy);
          if (generatedThemes.length > 0) {
            themes = generatedThemes;
            break;
          }
          throw new Error('Aucun thème généré');
        } catch (error) {
          console.error(`Erreur génération thèmes (tentative ${retryCount + 1}):`, error);
          retryCount++;
          if (retryCount < this.MAX_RETRIES) {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          }
        }
      }

      onProgress?.('themes', 100);
      
      // Phase 3: Génération des briefs
      onProgress?.('briefs', 0);
      console.log('Phase 3: Génération des briefs');
      
      const briefs = await BriefGenerationService.generateAllBriefs(
        briefData,
        themes,
        briefId,
        (count) => {
          console.log(`${count} briefs générés`);
          onProgress?.('briefs', Math.round((count / themes.length) * 100));
        }
      );

      await DBService.updateResult(briefId, { briefs: { briefs } });
      onProgress?.('briefs', 100);

      // Phase 4: Génération des visuels
      onProgress?.('visuals', 0);
      console.log('Phase 4: Génération des visuels');

      const executedBriefs: ExecutedBrief[] = [];

      for (let i = 0; i < briefs.length; i++) {
        retryCount = 0;
        let success = false;

        while (!success && retryCount < this.MAX_RETRIES) {
          try {
            const brief = briefs[i];
            const timeOfDay = this.determineTimeOfDay(brief.content.main);

            const generatedImage = await ImageGenerationService.generateOptimizedImage(
              this.createVisualPrompt(brief, briefData),
              briefData,
              {
                purpose: 'social',
                timeOfDay
              }
            ) as GeneratedImageResult;

            // Extraire l'URL correctement
            const imageUrl = typeof generatedImage.url === 'string' 
              ? generatedImage.url 
              : generatedImage.url.url;

            const executedBrief: ExecutedBrief = {
              ...brief,
              image: {
                url: imageUrl,
                alt: brief.specs.altText || brief.content.main,
                type: brief.specs.format,
                ratio: brief.specs.dimensions,
                quality: generatedImage.quality
              }
            };

            executedBriefs.push(executedBrief);
            await DBService.updateResult(briefId, { executedBriefs });
            onProgress?.('visuals', Math.round((i + 1) / briefs.length * 100));
            success = true;

          } catch (error) {
            console.error(`Erreur génération visuel ${i + 1} (tentative ${retryCount + 1}):`, error);
            retryCount++;
            if (retryCount < this.MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
            }
          }
        }

        if (!success) {
          console.warn(`Échec de la génération du visuel ${i + 1} après ${this.MAX_RETRIES} tentatives`);
        }

        // Attendre entre chaque génération d'image
        if (i < briefs.length - 1) {
          await new Promise(resolve => setTimeout(resolve, this.IMAGE_GENERATION_DELAY));
        }
      }

      // Sauvegarder le résultat final
      const result: AIServiceResponse = {
        briefId,
        strategy,
        briefs: { briefs },
        executedBriefs,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await DBService.updateResult(briefId, result);
      return result;

    } catch (error) {
      console.error('Erreur génération contenu:', error);
      throw error;
    }
  }

  private static createDefaultStrategy(briefData: BriefData): Strategy {
    return {
      content: `Stratégie marketing pour ${briefData.companyName}`,
      analysis: {
        positioning: `${briefData.companyName} se positionne comme un acteur majeur dans ${briefData.sector}`,
        strengths: ['Expertise reconnue', 'Innovation continue', 'Service client premium'],
        opportunities: ['Développement digital', 'Expansion marché', 'Nouveaux segments']
      },
      themes: [],
      calendar: {},
      recommendations: {
        visualStyle: 'Style professionnel et moderne',
        toneOfVoice: { default: 'Professionnel et engageant' },
        hashtags: ['#business', '#innovation', '#excellence'],
        engagement: ['Posts réguliers', 'Interaction avec la communauté']
      }
    };
  }

  private static createDefaultThemes(briefData: BriefData): Theme[] {
    return [
      {
        name: 'Expertise Professionnelle',
        objective: `Mettre en avant l'expertise de ${briefData.companyName}`,
        approach: 'Contenu informatif et professionnel',
        emotions: 'Confiance, Expertise',
        formats: ['Photos', 'Articles'],
        networks: briefData.currentSocialNetworks
      },
      {
        name: 'Innovation et Technologie',
        objective: 'Démontrer notre capacité d\'innovation',
        approach: 'Présentation des solutions innovantes',
        emotions: 'Surprise, Intérêt',
        formats: ['Vidéos', 'Infographies'],
        networks: briefData.currentSocialNetworks
      }
    ];
  }

  private static createStrategy(strategyResult: any): Strategy {
    return {
      content: this.validateContent(strategyResult.marketAnalysis),
      analysis: {
        positioning: this.extractPositioning(strategyResult.strategicAnalysis),
        strengths: this.extractStrengths(strategyResult.strategicAnalysis),
        opportunities: this.extractOpportunities(strategyResult.strategicAnalysis)
      },
      themes: [],
      calendar: {},
      recommendations: {
        visualStyle: this.extractVisualStyle(strategyResult.recommendations),
        toneOfVoice: this.extractToneOfVoice(strategyResult.recommendations),
        hashtags: this.extractHashtags(strategyResult.recommendations),
        engagement: this.extractEngagement(strategyResult.recommendations)
      }
    };
  }

  private static validateContent(content: string): string {
    if (!content || content.length < 10) {
      return 'Contenu par défaut';
    }
    return content.trim();
  }

  private static determineTimeOfDay(text: string): string | undefined {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('soir')) return 'sunset';
    if (lowerText.includes('nuit')) return 'night';
    if (lowerText.includes('matin')) return 'morning';
    return undefined;
  }

  private static createVisualPrompt(brief: CreativeBrief, briefData: BriefData): string {
    return brief.visualPrompt || 
           `Une image professionnelle pour ${briefData.companyName} illustrant ${brief.content.main}`;
  }

  private static extractPositioning(content: string): string {
    const match = content.match(/Positionnement[^\n]*:\s*([^\n]+)/i);
    return this.validateContent(match?.[1] || 'Positionnement par défaut');
  }

  private static extractStrengths(content: string): string[] {
    const match = content.match(/Forces[^\n]*:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (!match?.[1]) return ['Force par défaut'];
    const strengths = match[1].split('\n')
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0);
    return strengths.length > 0 ? strengths : ['Force par défaut'];
  }

  private static extractOpportunities(content: string): string[] {
    const match = content.match(/Opportunités[^\n]*:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (!match?.[1]) return ['Opportunité par défaut'];
    const opportunities = match[1].split('\n')
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0);
    return opportunities.length > 0 ? opportunities : ['Opportunité par défaut'];
  }

  private static extractVisualStyle(content: string): string {
    const match = content.match(/Style visuel[^\n]*:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    return this.validateContent(match?.[1] || 'Style visuel par défaut');
  }

  private static extractToneOfVoice(content: string): Record<string, string> {
    const match = content.match(/Ton de voix[^\n]*:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (!match?.[1]) return { default: 'Ton par défaut' };

    const tones: Record<string, string> = {};
    const lines = match[1].split('\n')
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      return { default: 'Ton par défaut' };
    }

    lines.forEach((line, index) => {
      tones[`tone${index + 1}`] = line;
    });

    return tones;
  }

  private static extractHashtags(content: string): string[] {
    const match = content.match(/Hashtags[^\n]*:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (!match?.[1]) return ['#default'];
    const hashtags = match[1].split(/[,\n]/)
      .map(tag => tag.trim().replace(/^#*/, '#'))
      .filter(tag => tag.length > 1);
    return hashtags.length > 0 ? hashtags : ['#default'];
  }

  private static extractEngagement(content: string): string[] {
    const match = content.match(/Tactiques d'engagement[^\n]*:([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (!match?.[1]) return ['Tactique par défaut'];
    const tactics = match[1].split('\n')
      .map(line => line.replace(/^[-•]\s*/, '').trim())
      .filter(line => line.length > 0);
    return tactics.length > 0 ? tactics : ['Tactique par défaut'];
  }
}
