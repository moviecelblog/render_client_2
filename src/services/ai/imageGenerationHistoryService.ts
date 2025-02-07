import { BriefData } from '../../types/brief';
import { DBService } from '../db';

interface GenerationHistory {
  briefId: string;
  timestamp: number;
  imageUrl: string;
  prompt: string;
  params: any;
  score: number;
  validationDetails: any;
  metadata: {
    purpose: string;
    timeOfDay?: string;
    attempt: number;
  };
}

interface GenerationSession {
  briefId: string;
  startTime: number;
  endTime?: number;
  totalAttempts: number;
  bestScore: number;
  bestImageUrl: string;
  history: GenerationHistory[];
  status: 'in_progress' | 'completed' | 'failed';
}

export class ImageGenerationHistoryService {
  private static readonly COLLECTION = 'image_generation_history';

  static async startSession(briefId: string): Promise<string> {
    const session: GenerationSession = {
      briefId,
      startTime: Date.now(),
      totalAttempts: 0,
      bestScore: 0,
      bestImageUrl: '',
      history: [],
      status: 'in_progress'
    };

    await DBService.saveResult(briefId, { imageGenerationSession: session });
    return briefId;
  }

  static async recordAttempt(
    briefId: string,
    imageUrl: string,
    prompt: string,
    params: any,
    score: number,
    validationDetails: any,
    metadata: {
      purpose: string;
      timeOfDay?: string;
      attempt: number;
    }
  ): Promise<void> {
    const history: GenerationHistory = {
      briefId,
      timestamp: Date.now(),
      imageUrl,
      prompt,
      params,
      score,
      validationDetails,
      metadata
    };

    // Récupérer la session existante
    const result = await DBService.getResult(briefId);
    const session = result?.imageGenerationSession as GenerationSession;

    if (!session) {
      throw new Error('Session de génération non trouvée');
    }

    // Mettre à jour les statistiques de la session
    session.totalAttempts++;
    if (score > session.bestScore) {
      session.bestScore = score;
      session.bestImageUrl = imageUrl;
    }

    // Ajouter l'historique
    session.history.push(history);

    // Sauvegarder les mises à jour
    await DBService.updateResult(briefId, { imageGenerationSession: session });
  }

  static async completeSession(briefId: string, success: boolean): Promise<void> {
    const result = await DBService.getResult(briefId);
    const session = result?.imageGenerationSession as GenerationSession;

    if (!session) {
      throw new Error('Session de génération non trouvée');
    }

    session.endTime = Date.now();
    session.status = success ? 'completed' : 'failed';

    await DBService.updateResult(briefId, { imageGenerationSession: session });
  }

  static async getLastSuccessfulGeneration(
    briefId: string,
    purpose: string
  ): Promise<GenerationHistory | null> {
    const result = await DBService.getResult(briefId);
    const session = result?.imageGenerationSession as GenerationSession;

    if (!session || !session.history.length) {
      return null;
    }

    // Filtrer par purpose et trier par score
    const relevantHistory = session.history
      .filter(h => h.metadata.purpose === purpose)
      .sort((a, b) => b.score - a.score);

    return relevantHistory[0] || null;
  }

  static async getGenerationStats(briefId: string): Promise<{
    totalAttempts: number;
    averageScore: number;
    bestScore: number;
    successRate: number;
    timeSpent: number;
  }> {
    const result = await DBService.getResult(briefId);
    const session = result?.imageGenerationSession as GenerationSession;

    if (!session) {
      throw new Error('Session de génération non trouvée');
    }

    const scores = session.history.map(h => h.score);
    const successfulAttempts = session.history.filter(h => h.score >= 85).length;

    return {
      totalAttempts: session.totalAttempts,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      bestScore: session.bestScore,
      successRate: (successfulAttempts / session.totalAttempts) * 100,
      timeSpent: (session.endTime || Date.now()) - session.startTime
    };
  }

  static async resumeSession(briefId: string): Promise<{
    canResume: boolean;
    lastAttempt?: GenerationHistory;
    remainingAttempts: number;
  }> {
    const result = await DBService.getResult(briefId);
    const session = result?.imageGenerationSession as GenerationSession;

    if (!session) {
      return {
        canResume: false,
        remainingAttempts: 0
      };
    }

    const lastAttempt = session.history[session.history.length - 1];
    const maxAttempts = 10; // Nombre maximum de tentatives autorisées

    return {
      canResume: session.status === 'in_progress' && session.totalAttempts < maxAttempts,
      lastAttempt,
      remainingAttempts: maxAttempts - session.totalAttempts
    };
  }
}
