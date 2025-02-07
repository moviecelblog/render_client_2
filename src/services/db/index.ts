const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export class DBService {
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

  static async saveResult(briefId: string, data: any): Promise<any> {
    try {
      console.log('Sauvegarde des résultats pour briefId:', briefId);
      
      // Nettoyer les données avant l'envoi
      const cleanData = this.cleanDataForStorage(data);

      const response = await fetch(`${API_URL}/results`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          briefId,
          ...cleanData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
      }
      
      console.log('Résultats sauvegardés avec succès');
      return response.json();
    } catch (error: any) {
      console.error('Erreur détaillée lors de la sauvegarde:', {
        message: error.message,
        data: error.response?.data
      });
      throw new Error('Erreur lors de la sauvegarde du résultat');
    }
  }

  static async updateResult(briefId: string, data: any): Promise<any> {
    try {
      console.log('Mise à jour des résultats pour briefId:', briefId);
      console.log('Données de mise à jour:', JSON.stringify(data, null, 2));

      // Nettoyer les données avant l'envoi
      const cleanData = this.cleanDataForStorage(data);
      
      const response = await fetch(`${API_URL}/results/${briefId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(cleanData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
      }
      
      console.log('Résultats mis à jour avec succès');
      return response.json();
    } catch (error: any) {
      console.error('Erreur détaillée lors de la mise à jour:', {
        message: error.message,
        data: error.response?.data
      });
      throw new Error('Erreur lors de la mise à jour du résultat');
    }
  }

  static async getResult(briefId: string): Promise<any> {
    try {
      console.log('Récupération des résultats pour briefId:', briefId);
      
      const response = await fetch(`${API_URL}/results/${briefId}`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`HTTP error! status: ${response.status}, details: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      console.log('Résultats récupérés avec succès:', data);
      return data;
    } catch (error: any) {
      console.error('Erreur détaillée lors de la récupération:', {
        message: error.message,
        data: error.response?.data
      });
      throw new Error('Erreur lors de la récupération du résultat');
    }
  }

  private static cleanDataForStorage(data: any): any {
    // Fonction récursive pour nettoyer les objets
    const cleanObject = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      if (Array.isArray(obj)) {
        return obj.map(item => cleanObject(item));
      }

      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        // Nettoyer les chaînes de caractères
        if (typeof value === 'string') {
          // Augmenter la limite à 500 000 caractères pour les grands textes
          cleaned[key] = value.slice(0, 500000);
        }
        // Nettoyer récursivement les objets
        else if (typeof value === 'object') {
          cleaned[key] = cleanObject(value);
        }
        // Garder les autres types de données tels quels
        else {
          cleaned[key] = value;
        }
      }
      return cleaned;
    };

    // Nettoyer spécifiquement les briefs exécutés avec des limites plus élevées
    if (data.executedBriefs) {
      data.executedBriefs = data.executedBriefs.map((brief: any) => ({
        ...brief,
        visualPrompt: brief.visualPrompt?.slice(0, 5000), // Augmenter la limite du prompt
        content: {
          main: brief.content.main?.slice(0, 2000),
          tagline: brief.content.tagline?.slice(0, 500),
          hashtags: brief.content.hashtags?.slice(0, 20), // Augmenter le nombre de hashtags
          cta: brief.content.cta?.slice(0, 500),
          question: brief.content.question?.slice(0, 500)
        },
        specs: {
          format: brief.specs.format?.slice(0, 100),
          dimensions: brief.specs.dimensions?.slice(0, 100),
          altText: brief.specs.altText?.slice(0, 500)
        },
        image: brief.image
      }));
    }

    // Assurer que la stratégie est complètement sauvegardée
    if (data.strategy) {
      data.strategy = {
        ...data.strategy,
        content: data.strategy.content?.slice(0, 500000),
        analysis: {
          ...data.strategy.analysis,
          positioning: data.strategy.analysis?.positioning?.slice(0, 5000),
          strengths: data.strategy.analysis?.strengths?.map((s: string) => s.slice(0, 1000)),
          opportunities: data.strategy.analysis?.opportunities?.map((o: string) => o.slice(0, 1000))
        },
        recommendations: {
          ...data.strategy.recommendations,
          visualStyle: data.strategy.recommendations?.visualStyle?.slice(0, 5000),
          hashtags: data.strategy.recommendations?.hashtags?.map((h: string) => h.slice(0, 100)),
          engagement: data.strategy.recommendations?.engagement?.map((e: string) => e.slice(0, 1000))
        }
      };
    }

    return cleanObject(data);
  }
}
