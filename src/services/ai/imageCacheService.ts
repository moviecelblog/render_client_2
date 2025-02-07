import { config } from '../../config/env';
import { ValidationDetails } from '../../types';

interface GenerationParams {
  cfgScale?: number;
  steps?: number;
  samples?: number;
  width?: number;
  height?: number;
}

interface CacheMetadata {
  purpose?: string;
  timeOfDay?: string;
  sector?: string;
  style?: string;
  quality?: string;
}

export class ImageCacheService {
  private static getAuthHeaders() {
    const userEmail = sessionStorage.getItem('userEmail');
    if (!userEmail) {
      throw new Error('Utilisateur non authentifié');
    }
    return {
      'Authorization': `Bearer ${userEmail}`
    };
  }

  private static async fetchWithRetry(
    url: string,
    options: RequestInit,
    retries: number = 3
  ): Promise<Response> {
    let lastError: Error | null = null;
    
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Tentative ${i + 1}/${retries} pour ${url}`);
        console.log('Options:', JSON.stringify(options, null, 2));

        const response = await fetch(url, options);
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const details = await response.text();
          console.error('Response error details:', details);
          throw new Error(`HTTP error! status: ${response.status}, details: ${details}`);
        }
        return response;
      } catch (error) {
        console.error(`Erreur (tentative ${i + 1}/${retries}):`, error);
        lastError = error as Error;
        if (i < retries - 1) {
          const delay = 1000 * (i + 1);
          console.log(`Attente de ${delay}ms avant la prochaine tentative`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }

  private static getFullUrl(imageUrl: string): string {
    console.log('Conversion de l\'URL:', imageUrl);

    try {
      // Si l'URL est déjà absolue, la retourner telle quelle
      if (imageUrl.startsWith('http')) {
        console.log('URL absolue détectée');
        return imageUrl;
      }

      // Si l'URL est relative au serveur API
      if (imageUrl.startsWith('/api/')) {
        const fullUrl = `${config.apiUrl}${imageUrl.substring(4)}`;
        console.log('URL API convertie:', fullUrl);
        return fullUrl;
      }

      // Si l'URL est relative au serveur
      if (imageUrl.startsWith('/')) {
        const apiUrl = new URL(config.apiUrl);
        const fullUrl = `${apiUrl.protocol}//${apiUrl.host}${imageUrl}`;
        console.log('URL serveur convertie:', fullUrl);
        return fullUrl;
      }

      // Si l'URL est relative au chemin actuel
      const currentUrl = window.location.href;
      const baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
      const fullUrl = new URL(imageUrl, baseUrl).href;
      console.log('URL relative convertie:', fullUrl);
      return fullUrl;
    } catch (error) {
      console.error('Erreur lors de la conversion de l\'URL:', error);
      throw error;
    }
  }

  static async addToCache(
    prompt: string,
    briefId: string,
    params: GenerationParams = {},
    imageUrl: string,
    score: number,
    validationDetails: ValidationDetails,
    metadata: CacheMetadata = {}
  ): Promise<void> {
    try {
      console.log('Début de l\'ajout au cache');
      console.log('URL de l\'image:', imageUrl);
      console.log('Paramètres:', { prompt, briefId, params, score, metadata });

      if (!imageUrl) {
        throw new Error('URL de l\'image manquante');
      }

      const imageData = {
        prompt,
        briefId,
        params,
        score,
        validation: validationDetails,
        metadata
      };

      // Obtenir l'URL complète de l'image
      const fullImageUrl = this.getFullUrl(imageUrl);
      console.log('URL complète:', fullImageUrl);

      // Créer un FormData
      const formData = new FormData();
      formData.append('imageUrl', fullImageUrl);
      formData.append('imageData', JSON.stringify(imageData));

      // Envoyer au serveur avec fetch
      const response = await this.fetchWithRetry(
        `${config.apiUrl}/image-cache`,
        {
          method: 'POST',
          headers: {
            ...this.getAuthHeaders()
          },
          body: formData
        }
      );

      const result = await response.json();
      console.log('Résultat de l\'ajout au cache:', result);

      if (!result.success) {
        throw new Error(result.error || 'Erreur inconnue lors de l\'ajout au cache');
      }

      console.log('Ajout au cache réussi');
    } catch (error) {
      console.error('Erreur lors de l\'ajout au cache:', error);
      throw error;
    }
  }

  static async findInCache(
    prompt: string,
    params: GenerationParams,
    metadata?: CacheMetadata
  ): Promise<{
    found: boolean;
    imageUrl?: string;
    score?: number;
    validationDetails?: ValidationDetails;
  }> {
    try {
      console.log('Recherche dans le cache');
      console.log('Paramètres:', { prompt, params, metadata });

      const queryParams = new URLSearchParams({
        prompt,
        params: JSON.stringify(params)
      });

      if (metadata) {
        queryParams.append('metadata', JSON.stringify(metadata));
      }

      const response = await this.fetchWithRetry(
        `${config.apiUrl}/image-cache?${queryParams}`,
        {
          method: 'GET',
          headers: {
            ...this.getAuthHeaders(),
            'Accept': 'application/json'
          }
        }
      );

      const result = await response.json();
      console.log('Résultat de la recherche:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors de la recherche dans le cache:', error);
      return { found: false };
    }
  }

  static async clearCache(olderThanDays: number): Promise<void> {
    try {
      console.log('Nettoyage du cache');
      console.log('Jours:', olderThanDays);

      const response = await this.fetchWithRetry(
        `${config.apiUrl}/image-cache/cleanup`,
        {
          method: 'POST',
          headers: {
            ...this.getAuthHeaders(),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ olderThanDays })
        }
      );

      const result = await response.json();
      console.log('Résultat du nettoyage:', result);

      if (!result.success) {
        throw new Error(result.error || 'Erreur inconnue lors du nettoyage du cache');
      }

      console.log('Nettoyage réussi');
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
      throw error;
    }
  }

  static async getStats(): Promise<{
    totalImages: number;
    totalSize: number;
    averageScore: number;
  }> {
    try {
      console.log('Récupération des statistiques');

      const response = await this.fetchWithRetry(
        `${config.apiUrl}/image-cache/stats`,
        {
          method: 'GET',
          headers: {
            ...this.getAuthHeaders(),
            'Accept': 'application/json'
          }
        }
      );

      const stats = await response.json();
      console.log('Statistiques récupérées:', stats);
      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }
}
