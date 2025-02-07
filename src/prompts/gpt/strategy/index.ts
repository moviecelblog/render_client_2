import { BriefData } from '../../../types/brief';
import { generateMarketAnalysis } from './marketAnalysis';
import { generateStrategicAnalysis } from './strategicAnalysis';
import { generateRecommendations } from './recommendations';
import { generateValidationPrompt, validateStrategyContent, ValidationCriteria } from './validation';

export interface StrategyGenerationResult {
  marketAnalysis: string;
  strategicAnalysis: string;
  recommendations: string;
  validation: {
    isValid: boolean;
    score: number;
    feedback: string[];
  };
}

export interface StrategyGenerationOptions {
  validationCriteria?: ValidationCriteria;
  maxRetries?: number;
  includeValidation?: boolean;
}

const DEFAULT_OPTIONS: StrategyGenerationOptions = {
  maxRetries: 3,
  includeValidation: true
};

export const generateCompleteStrategy = async (
  briefData: BriefData,
  options: StrategyGenerationOptions = DEFAULT_OPTIONS
): Promise<StrategyGenerationResult> => {
  const result: StrategyGenerationResult = {
    marketAnalysis: '',
    strategicAnalysis: '',
    recommendations: '',
    validation: {
      isValid: false,
      score: 0,
      feedback: []
    }
  };

  try {
    // 1. Générer l'analyse de marché
    result.marketAnalysis = generateMarketAnalysis(briefData);

    // 2. Générer l'analyse stratégique
    result.strategicAnalysis = generateStrategicAnalysis(briefData);

    // 3. Générer les recommandations
    result.recommendations = generateRecommendations(briefData);

    // 4. Valider si nécessaire
    if (options.includeValidation) {
      const validationPrompt = generateValidationPrompt(briefData, options.validationCriteria);
      const isValid = validateStrategyContent(
        `${result.marketAnalysis}\n\n${result.strategicAnalysis}\n\n${result.recommendations}`,
        options.validationCriteria
      );

      result.validation = {
        isValid,
        score: isValid ? 100 : 0,
        feedback: isValid ? ['Stratégie validée'] : ['Des corrections sont nécessaires']
      };
    }

    return result;
  } catch (error) {
    console.error('Erreur lors de la génération de la stratégie:', error);
    throw error;
  }
};

export const formatStrategyForPrompt = (strategy: StrategyGenerationResult): string => {
  return `ANALYSE DE MARCHÉ
${strategy.marketAnalysis}

ANALYSE STRATÉGIQUE
${strategy.strategicAnalysis}

RECOMMANDATIONS
${strategy.recommendations}`;
};

export {
  generateMarketAnalysis,
  generateStrategicAnalysis,
  generateRecommendations,
  generateValidationPrompt,
  validateStrategyContent,
  type ValidationCriteria
};
