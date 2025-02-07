import { useState, useCallback } from 'react';
import { AIService } from '../services/ai';
import { BriefData, AIServiceResponse } from '../types/brief';

type GenerationStage = 'strategy' | 'themes' | 'briefs' | 'visuals' | 'execution';

export const useAIGeneration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<AIServiceResponse | null>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  const generateContent = useCallback(async (
    briefData: BriefData,
    onProgress?: (stage: GenerationStage) => void
  ) => {
    setLoading(true);
    setError(null);
    console.log('Début de la génération avec briefData:', briefData);

    try {
      const response = await AIService.generateContent(briefData, (stage) => {
        onProgress?.(stage);
        // Log de l'état actuel
        console.log(`Progression - ${stage}`);
      });
      
      console.log('Réponse du service AI:', response);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Erreur inconnue lors de la génération');
      }

      // Log détaillé du résultat
      console.log('Résultat de la génération:', {
        hasStrategy: !!response.data.strategy,
        strategyContent: response.data.strategy?.content?.slice(0, 100) + '...',
        hasThemes: !!response.data.strategy?.themes?.length,
        themesCount: response.data.strategy?.themes?.length || 0,
        hasBriefs: !!response.data.briefs,
        briefsCount: response.data.briefs?.briefs?.length || 0,
        hasExecutedBriefs: !!response.data.executedBriefs,
        executedBriefsCount: response.data.executedBriefs?.length || 0
      });

      // Mise à jour du résultat
      setResult(response.data);
      
      // Log après la mise à jour
      console.log('État final du résultat:', response.data);
    } catch (err) {
      console.error('Erreur lors de la génération:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    result,
    generateContent,
    reset
  };
};
