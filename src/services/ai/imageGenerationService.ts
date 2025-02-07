import { BriefData } from '../../types/brief';
import { config } from '../../config/env';
import {
  formatPromptForStability,
  SectorType
} from '../../prompts/stability/utils';
import { generateSectorPrompt } from '../../prompts/stability/sectorPrompts';
import { getNegativePromptWithStyle } from '../../prompts/stability/negativePrompts';
import { getStylePreset, PresetType } from '../../prompts/stability/stylePresets';
import { ImageValidationService } from './imageValidationService';
import { ImageGenerationHistoryService } from './imageGenerationHistoryService';
import { ImageCacheService } from './imageCacheService';
import axios from 'axios';

const MAX_ATTEMPTS = 3;
const MIN_VALIDATION_SCORE = 85;
const SCORE_DECAY_PER_ATTEMPT = 5;
const MAX_PROMPT_LENGTH = 2000;

// Seuils de qualité
const QUALITY_THRESHOLDS = {
  HIGH: 90,
  MEDIUM: 80,
  LOW: 70
};

interface CompositionRule {
  name: string;
  description: string;
  prompt: string;
}

interface LightingSetup {
  name: string;
  description: string;
  prompt: string;
  timeOfDay?: string;
}

interface ColorScheme {
  name: string;
  description: string;
  colors: string[];
  prompt: string;
}

interface GenerationMetadata {
  purpose: string;
  timeOfDay?: string;
  attempt: number;
  quality: 'low' | 'medium' | 'high';
}

interface GenerationOptions {
  purpose?: 'social' | 'product' | 'lifestyle';
  timeOfDay?: string;
  attempt?: number;
  generationId?: string;
}

const COMPOSITION_RULES: CompositionRule[] = [
  {
    name: 'Règle des tiers',
    description: 'Divise l\'image en tiers pour une composition équilibrée',
    prompt: 'composition following rule of thirds, balanced layout, dynamic positioning, professional composition'
  },
  {
    name: 'Point focal',
    description: 'Crée un point d\'intérêt principal',
    prompt: 'strong focal point, eye-catching main subject, clear visual hierarchy, professional product placement'
  }
];

const LIGHTING_SETUPS: LightingSetup[] = [
  {
    name: 'Éclairage studio premium',
    description: 'Éclairage professionnel type studio photo',
    prompt: 'premium studio lighting, professional photography setup, perfect exposure, cinematic lighting, dramatic shadows',
    timeOfDay: 'studio'
  },
  {
    name: 'Lumière naturelle douce',
    description: 'Éclairage doux et diffus',
    prompt: 'soft natural lighting, gentle shadows, airy atmosphere, golden hour lighting, perfect exposure',
    timeOfDay: 'morning'
  }
];

const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: 'Premium moderne',
    description: 'Palette sophistiquée et contemporaine',
    colors: ['#1A1A1A', '#FFFFFF', '#C0C0C0', '#808080'],
    prompt: 'modern premium color palette, sophisticated tones, contemporary color scheme, professional color grading'
  }
];

export class ImageGenerationService {
  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Extraire uniquement la partie base64 en supprimant le préfixe data:image/...;base64,
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  }

  private static getAuthHeaders() {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
      throw new Error('Utilisateur non authentifié');
    }
    return {
      'Authorization': `Bearer ${userEmail}`,
      'Accept': 'application/json'
    };
  }

  private static getCompositionPrompt(brief: BriefData): string {
    const rule = brief.contentTypes.includes('Product') 
      ? COMPOSITION_RULES[1] // Point focal pour les produits
      : COMPOSITION_RULES[0]; // Règle des tiers pour le reste
    
    return rule.prompt;
  }

  private static getLightingPrompt(brief: BriefData, timeOfDay?: string): string {
    const setup = timeOfDay 
      ? LIGHTING_SETUPS.find(s => s.timeOfDay === timeOfDay)
      : brief.communicationStyle.toLowerCase().includes('premium')
        ? LIGHTING_SETUPS[0]
        : LIGHTING_SETUPS[1];
    
    return setup?.prompt || LIGHTING_SETUPS[0].prompt;
  }

  private static getColorPrompt(brief: BriefData): string {
    return COLOR_SCHEMES[0].prompt;
  }

  private static determineStylePreset(brief: BriefData, purpose: string): PresetType {
    if (brief.communicationStyle.toLowerCase().includes('premium')) {
      return 'premium';
    }

    switch (purpose) {
      case 'product':
        return 'product';
      case 'lifestyle':
        return 'lifestyle';
      case 'social':
        return brief.sector === 'Banque et Finance' ? 'corporate' : 'social';
      default:
        return 'editorial';
    }
  }

  private static determineQuality(score: number): 'low' | 'medium' | 'high' {
    if (score >= QUALITY_THRESHOLDS.HIGH) {
      return 'high';
    } else if (score >= QUALITY_THRESHOLDS.MEDIUM) {
      return 'medium';
    }
    return 'low';
  }

  private static getAspectRatioForPurpose(purpose: 'social' | 'product' | 'lifestyle'): string {
    switch (purpose) {
      case 'social':
        return '1:1';
      case 'product':
        return '3:4';
      case 'lifestyle':
        return '16:9';
      default:
        return '1:1';
    }
  }

  private static truncatePrompt(prompt: string): string {
    if (prompt.length <= MAX_PROMPT_LENGTH) {
      return prompt;
    }

    // Nettoyer le prompt des virgules vides et espaces
    const cleanPrompt = prompt
      .replace(/,\s*,/g, ',')
      .replace(/:\s*,/g, ':')
      .replace(/\s+/g, ' ')
      .trim();

    // Séparer le prompt en parties principales
    const parts = cleanPrompt.split('Style Requirements:');
    const mainPrompt = parts[0];
    const requirements = parts[1] || '';

    // Sélectionner les éléments principaux
    const mainElements = mainPrompt
      .split(',')
      .map(part => part.trim())
      .filter(part => part.length > 0)
      .slice(0, 10);

    // Reconstruire le prompt
    const truncatedPrompt = `${mainElements.join(', ')}${requirements ? ', Style Requirements:' + requirements : ''}`;
    
    // S'assurer que nous ne dépassons pas la limite
    return truncatedPrompt.slice(0, MAX_PROMPT_LENGTH);
  }

  private static async generateWithParams(
    prompt: string,
    negativePrompt: string,
    purpose: 'social' | 'product' | 'lifestyle',
    options?: {
      image?: string;
      strength?: number;
    }
  ): Promise<{ url: string; quality: 'low' | 'medium' | 'high' }> {
    try {
      // Tronquer le prompt si nécessaire
      const truncatedPrompt = this.truncatePrompt(prompt);
      console.log('Envoi du prompt à Stability:', truncatedPrompt);

      // Créer le payload selon la documentation de Stability Ultra
      const payload: any = {
        prompt: truncatedPrompt,
        negative_prompt: negativePrompt || undefined,
        aspect_ratio: this.getAspectRatioForPurpose(purpose),
        output_format: 'png'
      };

      // Ajouter l'image de référence si fournie
      if (options?.image) {
        payload.image = options.image;
        payload.strength = options.strength || 0.35;
      }

      // Utiliser axios.postForm comme recommandé dans la documentation
      const response = await axios.postForm(
        `${config.apiUrl}/ai/stability/generate`,
        payload,
        {
          headers: {
            ...this.getAuthHeaders(),
            'Accept': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.data || !response.data.data[0]) {
        throw new Error('Réponse invalide du serveur');
      }

      return {
        url: response.data.data[0].url,
        quality: 'high' // Ultra génère toujours des images de haute qualité
      };
    } catch (error: any) {
      console.error('Erreur lors de la génération:', error);
      throw error;
    }
  }

  static async generateOptimizedImage(
    description: string,
    briefData: BriefData,
    options: GenerationOptions = {}
  ): Promise<{ url: string; quality: 'low' | 'medium' | 'high' }> {
    // Analyser si la scène permet l'intégration du produit
    const shouldUseProduct = briefData.productPhotos.length > 0 && (
      description.toLowerCase().includes('table') ||
      description.toLowerCase().includes('picnic') ||
      description.toLowerCase().includes('bureau') ||
      description.toLowerCase().includes('sac') ||
      description.toLowerCase().includes('voyage') ||
      description.toLowerCase().includes('soirée')
    );

    const {
      purpose = 'social',
      timeOfDay,
      attempt = 1,
      generationId = `${briefData.companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    } = options;

    // Si on doit utiliser la photo produit
    let productOptions;
    if (shouldUseProduct && briefData.productPhotos.length > 0) {
      const base64Image = await this.fileToBase64(briefData.productPhotos[0]);
      productOptions = {
        image: base64Image,
        strength: 0.35 // Permet l'influence de la photo tout en gardant la créativité
      };
    }

    if (attempt > MAX_ATTEMPTS) {
      throw new Error(`Nombre maximum de tentatives (${MAX_ATTEMPTS}) atteint`);
    }

    // Construire le prompt enrichi
    const compositionPrompt = this.getCompositionPrompt(briefData);
    const lightingPrompt = this.getLightingPrompt(briefData, timeOfDay);
    const colorPrompt = this.getColorPrompt(briefData);
    const stylePreset = this.determineStylePreset(briefData, purpose);
    const preset = getStylePreset(stylePreset);
    const styleModifiers = preset.promptModifiers.join(', ');
    
    const basePrompt = `${description}, ${compositionPrompt}, ${lightingPrompt}, ${colorPrompt}, ${styleModifiers}`;
    const sectorPrompt = generateSectorPrompt(briefData, basePrompt);

    // Construire le negative prompt
    const negativePrompt = getNegativePromptWithStyle(briefData.sector as SectorType, briefData.communicationStyle);

    // Formater les prompts pour Stability
    const formattedPrompts = formatPromptForStability(sectorPrompt, negativePrompt);

    // Vérifier le cache avant de générer
    const cachedImage = await ImageCacheService.findInCache(
      formattedPrompts.prompt,
      { samples: 1 },
      {
        purpose,
        timeOfDay,
        sector: briefData.sector,
        style: briefData.communicationStyle
      }
    );

    if (cachedImage.found) {
      return {
        url: cachedImage.imageUrl!,
        quality: 'high'
      };
    }

    // Démarrer une nouvelle session de génération
    await ImageGenerationHistoryService.startSession(generationId);

    try {
      const result = await this.generateWithParams(
        formattedPrompts.prompt,
        formattedPrompts.negative_prompt || '',
        purpose,
        productOptions
      );
      
      // Validation et enregistrement
      const validation = await ImageValidationService.validateImage(result.url, briefData);
      
      const metadata: GenerationMetadata = {
        purpose,
        timeOfDay,
        attempt,
        quality: result.quality
      };

      await ImageGenerationHistoryService.recordAttempt(
        generationId,
        result.url,
        formattedPrompts.prompt,
        { cfgScale: 0, steps: 0, samples: 1 }, // Ultra gère ses propres paramètres
        validation.score,
        validation,
        metadata
      );

      // Si le score est suffisant, on réessaie avec un meilleur score requis
      if (validation.score < MIN_VALIDATION_SCORE - (attempt - 1) * SCORE_DECAY_PER_ATTEMPT) {
        await ImageGenerationHistoryService.completeSession(generationId, false);
        return this.generateOptimizedImage(description, briefData, {
          ...options,
          attempt: attempt + 1,
          generationId
        });
      }

      // Ajouter au cache si le score est bon
      await ImageCacheService.addToCache(
        formattedPrompts.prompt,
        generationId,
        { samples: 1 },
        result.url,
        validation.score,
        validation,
        {
          purpose,
          timeOfDay,
          sector: briefData.sector,
          style: briefData.communicationStyle,
          quality: result.quality
        }
      );

      await ImageGenerationHistoryService.completeSession(generationId, true);
      return result;

    } catch (error) {
      await ImageGenerationHistoryService.completeSession(generationId, false);
      throw error;
    }
  }

  static async resumeFailedGeneration(
    generationId: string,
    description: string,
    briefData: BriefData,
    options: GenerationOptions = {}
  ): Promise<{ url: string; quality: 'low' | 'medium' | 'high' }> {
    const history = await ImageGenerationHistoryService.resumeSession(generationId);
    
    if (!history.canResume) {
      throw new Error('Impossible de reprendre la génération');
    }

    const nextAttempt = history.lastAttempt ? history.lastAttempt.metadata.attempt + 1 : 1;
    
    if (nextAttempt > MAX_ATTEMPTS) {
      throw new Error(`Nombre maximum de tentatives (${MAX_ATTEMPTS}) atteint`);
    }

    return this.generateOptimizedImage(description, briefData, {
      ...options,
      attempt: nextAttempt,
      generationId
    });
  }
}
