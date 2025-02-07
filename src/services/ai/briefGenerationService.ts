import { BriefData, CreativeBrief, Theme } from '../../types/brief';
import { DBService } from '../db';
import { config } from '../../config/env';

export class BriefGenerationService {
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2000;
  private static readonly TOKEN_LIMIT = 1500;

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

  static async generateBriefFromTheme(
    briefData: BriefData,
    theme: Theme,
    briefId: string
  ): Promise<CreativeBrief> {
    try {
      console.log(`Génération du brief pour le thème: ${theme.name}`);
      
      const prompt = this.generateBriefPrompt(briefData, theme);
      
      const response = await fetch(`${config.apiUrl}/ai/gpt`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          messages: [{ 
            role: 'user', 
            content: prompt
          }],
          maxTokens: this.TOKEN_LIMIT,
          type: 'briefs',
          temperature: 0.9,
          presencePenalty: 0.7,
          frequencyPenalty: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Erreur API GPT: ${response.status}`);
      }

      const data = await response.json();
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Réponse GPT invalide');
      }

      const brief = this.parseBrief(data.choices[0].message.content, theme);
      console.log('Brief généré avec succès');

      await this.saveBrief(briefId, brief);

      return brief;
    } catch (error) {
      console.error('Erreur génération brief:', error);
      throw error;
    }
  }

  static async generateAllBriefs(
    briefData: BriefData,
    themes: Theme[],
    briefId: string,
    onProgress?: (count: number) => void
  ): Promise<CreativeBrief[]> {
    const allBriefs: CreativeBrief[] = [];

    for (const theme of themes) {
      let retryCount = 0;
      let success = false;

      while (!success && retryCount < this.MAX_RETRIES) {
        try {
          const brief = await this.generateBriefFromTheme(briefData, theme, briefId);
          allBriefs.push(brief);
          onProgress?.(allBriefs.length);
          success = true;
        } catch (error) {
          console.log(`Retry ${retryCount + 1}/${this.MAX_RETRIES} pour le thème ${theme.name}`);
          retryCount++;
          
          if (retryCount === this.MAX_RETRIES) {
            console.log(`Échec de génération pour le thème ${theme.name} après ${this.MAX_RETRIES} tentatives`);
            const defaultBrief = this.generateDefaultBrief(briefData, theme);
            allBriefs.push(defaultBrief);
            onProgress?.(allBriefs.length);
          } else {
            await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          }
        }
      }
    }

    console.log(`${allBriefs.length} briefs générés`);
    return allBriefs;
  }

  private static generateBriefPrompt(briefData: BriefData, theme: Theme): string {
    return `En tant que copywriter créatif d'une agence de publicité primée, créez un brief créatif UNIQUE pour ${briefData.companyName}.

CONTEXTE CRÉATIF
Thème : "${theme.name}"
Objectif : ${theme.objective}
Émotions : ${theme.emotions}
Style : ${briefData.communicationStyle}
Cible : ${briefData.targetAudience.demographic.join(', ')}

INSPIRATION SOCIALE
Réseaux ciblés : ${theme.networks.join(', ')}
Ton de voix : ${briefData.communicationStyle}
Tendances : ${briefData.competitiveAnalysis.opportunities.join(', ')}

FORMAT DEMANDÉ :

### VISUEL ###
[Description détaillée et créative]
- Scène principale :
- Éléments clés :
- Direction artistique :
- Ambiance :
- Mood :

### MARKETING ###
[SOYEZ CRÉATIF ET UNIQUE - ÉVITEZ LES FORMULES GÉNÉRIQUES]

- Message principal (150 car) :
[Message percutant et mémorable qui capture l'essence du thème]
Exemples de style :
✓ "La révolution ne se murmure pas, elle se conduit" 
✗ "Découvrez notre nouveau produit"

- Tagline (50 car) :
[Phrase d'accroche créative et virale]
Exemples de style :
✓ "Le futur a un nouveau son : Silence." 
✗ "La qualité avant tout"

- Hashtags (5-7) :
[Mix créatif de hashtags]
- 2 hashtags de marque uniques
- 2 hashtags tendance du secteur
- 2 hashtags conversation/communauté
Exemples de style :
✓ #DreamBiggerDriveBetter #ElectricRevolution
✗ #car #automotive

- Call-to-action (30 car) :
[CTA innovant et engageant]
Exemples de style :
✓ "Électrisez votre quotidien" 
✗ "En savoir plus"

- Question engagement :
[Question provocante ou intrigante]
Exemples de style :
✓ "Et si le luxe n'était plus une question de bruit ?" 
✗ "Qu'en pensez-vous ?"

### SPECS ###
- Format : [Adapté au réseau]
- Dimensions : [Optimales]
- Alt text : [SEO]

CRITÈRES DE RÉUSSITE :
- Chaque élément doit être UNIQUE et MÉMORABLE
- Les textes doivent être VIRAUX et PARTAGEABLES
- Éviter absolument les formules génériques
- Créer du contenu digne des meilleures campagnes
- S'inspirer des tendances ${theme.networks.join(', ')}

VALIDATION :
✓ Est-ce suffisamment créatif et unique ?
✓ Est-ce viral et partageable ?
✓ Est-ce aligné avec le thème et la marque ?
✓ Est-ce adapté aux réseaux ciblés ?
✗ Est-ce trop générique ou déjà vu ?`;
  }

  private static parseBrief(content: string, theme: Theme): CreativeBrief {
    try {
      const sections = content.split('###').filter(Boolean);
      const visualSection = sections.find(s => s.includes('VISUEL'))?.trim() || '';
      const marketingSection = sections.find(s => s.includes('MARKETING'))?.trim() || '';
      const specsSection = sections.find(s => s.includes('SPECS'))?.trim() || '';

      const visualPrompt = this.extractVisualPrompt(visualSection);
      const marketing = this.extractMarketingContent(marketingSection);
      const specs = this.extractSpecs(specsSection);

      return {
        visualPrompt: `${theme.name}: ${visualPrompt}`,
        content: {
          main: marketing.main || theme.objective,
          tagline: marketing.tagline || theme.name,
          hashtags: marketing.hashtags,
          cta: marketing.cta || 'En savoir plus',
          question: marketing.question || 'Qu\'en pensez-vous ?'
        },
        specs: {
          format: specs.format || 'carré',
          dimensions: specs.dimensions || '1080x1080px',
          altText: specs.altText || `Image pour ${theme.name}`
        }
      };
    } catch (error) {
      console.error('Erreur parsing brief:', error);
      return this.generateDefaultBrief(null, theme);
    }
  }

  private static extractVisualPrompt(section: string): string {
    const lines = section.split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim());
    return lines.join(' ');
  }

  private static extractMarketingContent(section: string): any {
    const main = this.extractBetweenMarkers(section, 'Message principal', 'Tagline')?.trim();
    const tagline = this.extractBetweenMarkers(section, 'Tagline', 'Hashtags')?.trim();
    const hashtags = this.extractHashtags(this.extractBetweenMarkers(section, 'Hashtags', 'Call-to-action') || '');
    const cta = this.extractBetweenMarkers(section, 'Call-to-action', 'Question')?.trim();
    const question = this.extractBetweenMarkers(section, 'Question engagement', '###')?.trim();

    return { main, tagline, hashtags, cta, question };
  }

  private static extractSpecs(section: string): any {
    const format = this.extractAfterLabel(section, 'Format:')?.trim();
    const dimensions = this.extractAfterLabel(section, 'Dimensions:')?.trim();
    const altText = this.extractAfterLabel(section, 'Alt text:')?.trim();

    return { format, dimensions, altText };
  }

  private static extractBetweenMarkers(text: string, start: string, end: string): string {
    const regex = new RegExp(`${start}.*?:(.*?)(?=${end}|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private static extractAfterLabel(text: string, label: string): string {
    const regex = new RegExp(`${label}\\s*([^\\n]+)`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }

  private static extractHashtags(text: string): string[] {
    if (!text) return ['#business', '#professional', '#innovation'];

    const hashtags = text
      .split(/[,\s[\]]+/)
      .map(tag => {
        tag = tag.replace(/^#/, '').trim();
        return tag ? `#${tag}` : '';
      })
      .filter(tag => tag.length > 1);

    return hashtags.length >= 3 ? hashtags : ['#business', '#professional', '#innovation'];
  }

  private static generateDefaultBrief(briefData: BriefData | null, theme: Theme): CreativeBrief {
    return {
      visualPrompt: `${theme.name}: Une image professionnelle illustrant ${theme.objective}`,
      content: {
        main: theme.objective,
        tagline: theme.name,
        hashtags: ['#business', '#professional', '#innovation'],
        cta: 'En savoir plus',
        question: 'Qu\'en pensez-vous ?'
      },
      specs: {
        format: 'carré',
        dimensions: '1080x1080px',
        altText: `Image pour ${theme.name}`
      }
    };
  }

  private static async saveBrief(briefId: string, brief: CreativeBrief): Promise<void> {
    try {
      const response = await fetch(`${config.apiUrl}/results/${briefId}`, {
        headers: this.getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération du résultat: ${response.status}`);
      }
      
      const currentResult = await response.json();
      const briefs = currentResult.briefs?.briefs || [];
      briefs.push(brief);
      
      await DBService.updateResult(briefId, {
        briefs: { briefs }
      });
    } catch (error) {
      console.error('Erreur sauvegarde brief:', error);
      throw error;
    }
  }
}
