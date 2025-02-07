export const config = {
  apiUrl: window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api'
    : '/api',
  staticUrl: window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '',
  stabilityApiKey: process.env.REACT_APP_STABILITY_API_KEY || '',
  getImageUrl: (path: string) => {
    // Si le chemin est déjà une URL complète ou une data URL, la retourner telle quelle
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }
    
    // Si le chemin commence par un slash, l'utiliser tel quel, sinon ajouter un slash
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    
    // Construire l'URL complète
    return `${config.staticUrl}${normalizedPath}`;
  }
};
