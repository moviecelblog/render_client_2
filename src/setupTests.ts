import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { config } from './config/env';

// Polyfills nécessaires pour Node.js
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Configuration fetch pour les tests
global.fetch = jest.fn();

// Configuration de l'environnement de test
process.env.REACT_APP_API_URL = 'http://localhost:5000/api';

// Mock des fonctions de l'API
const mockFetch = (global.fetch as jest.Mock);

// Helper pour simuler une réponse API
const mockApiResponse = (data: any) => {
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(data)
  });
};

// Mock des réponses API par défaut
beforeEach(() => {
  mockFetch.mockImplementation((url: string) => {
    if (url.includes('/ai/gpt')) {
      return mockApiResponse({
        choices: [{
          message: {
            content: `
1/12 "Innovation Élégante"
INSTRUCTIONS ANATOMIQUES CRITIQUES
[Composition principale]
- Scène urbaine moderne et élégante
- Éclairage doux et naturel
- Palette de couleurs premium

CONTENU MARKETING
Texte principal: Une fusion parfaite entre technologie et élégance. Notre nouvelle collection redéfinit le style urbain avec des vêtements intelligents qui s'adaptent à votre journée.
Tagline: L'avenir de la mode est ici
Hashtags: #TechStyle, #FashionInnovation, #SmartFashion, #PremiumStyle, #FutureFashion
Call-to-action: Découvrez la collection intelligente
Question: Prêt à révolutionner votre garde-robe ?

SPÉCIFICATIONS TECHNIQUES
Format: Carré
Dimensions: 1080x1080px
Alt text: Vêtement intelligent TechStyle en situation urbaine`
          }
        }]
      });
    }
    
    if (url.includes('/ai/stability/generate')) {
      return mockApiResponse({
        data: [{
          url: 'https://example.com/generated-image.jpg'
        }]
      });
    }

    if (url.includes('/results')) {
      return mockApiResponse({
        success: true,
        data: {
          id: '123',
          status: 'completed'
        }
      });
    }

    return mockApiResponse({});
  });
});

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});
