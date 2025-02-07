export interface DialectInfo {
  name: string;
  description: string;
}

export interface Country {
  code: string;
  name: string;
  languages: {
    primary: string;
    secondary?: string[];
  };
  languageNames: {
    primary: string;
    secondary?: string[];
  };
  dialectInfo?: {
    [key: string]: DialectInfo;
  };
}

export const countries: Country[] = [
  {
    code: 'AF',
    name: 'Afghanistan',
    languages: {
      primary: 'ps',
      secondary: ['fa', 'uz']
    },
    languageNames: {
      primary: 'Pashto',
      secondary: ['Dari', 'Uzbek']
    }
  },
  {
    code: 'AL',
    name: 'Albania',
    languages: {
      primary: 'sq'
    },
    languageNames: {
      primary: 'Albanian'
    }
  },
  {
    code: 'DZ',
    name: 'Algeria',
    languages: {
      primary: 'ar-dz',
      secondary: ['fr', 'ar']
    },
    languageNames: {
      primary: 'Algerian Arabic (Darija)',
      secondary: ['French', 'Modern Standard Arabic']
    },
    dialectInfo: {
      'ar-dz': {
        name: 'Darija',
        description: 'Dialecte arabe algérien, utilisé quotidiennement dans le pays'
      }
    }
  },
  {
    code: 'AD',
    name: 'Andorra',
    languages: {
      primary: 'ca',
      secondary: ['fr', 'es']
    },
    languageNames: {
      primary: 'Catalan',
      secondary: ['French', 'Spanish']
    }
  },
  {
    code: 'FR',
    name: 'France',
    languages: {
      primary: 'fr',
      secondary: ['en']
    },
    languageNames: {
      primary: 'French',
      secondary: ['English']
    }
  },
  {
    code: 'DE',
    name: 'Germany',
    languages: {
      primary: 'de',
      secondary: ['en']
    },
    languageNames: {
      primary: 'German',
      secondary: ['English']
    }
  },
  {
    code: 'IT',
    name: 'Italy',
    languages: {
      primary: 'it',
      secondary: ['en']
    },
    languageNames: {
      primary: 'Italian',
      secondary: ['English']
    }
  },
  {
    code: 'JP',
    name: 'Japan',
    languages: {
      primary: 'ja',
      secondary: ['en']
    },
    languageNames: {
      primary: 'Japanese',
      secondary: ['English']
    }
  },
  {
    code: 'MA',
    name: 'Morocco',
    languages: {
      primary: 'ar',
      secondary: ['fr', 'ber']
    },
    languageNames: {
      primary: 'Arabic',
      secondary: ['French', 'Berber']
    }
  },
  {
    code: 'ES',
    name: 'Spain',
    languages: {
      primary: 'es',
      secondary: ['ca', 'gl', 'eu']
    },
    languageNames: {
      primary: 'Spanish',
      secondary: ['Catalan', 'Galician', 'Basque']
    }
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    languages: {
      primary: 'en',
      secondary: ['cy', 'gd']
    },
    languageNames: {
      primary: 'English',
      secondary: ['Welsh', 'Scottish Gaelic']
    }
  },
  {
    code: 'US',
    name: 'United States',
    languages: {
      primary: 'en',
      secondary: ['es']
    },
    languageNames: {
      primary: 'English',
      secondary: ['Spanish']
    }
  }
  // Note: Ceci est un extrait. Dans la version finale, 
  // nous inclurons tous les pays du monde avec leurs langues respectives.
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

export const getCountryByName = (name: string): Country | undefined => {
  return countries.find(country => country.name === name);
};

export const getPrimaryLanguage = (countryCode: string): string => {
  const country = getCountryByCode(countryCode);
  return country?.languages.primary || 'en';
};

export const getAllLanguages = (countryCode: string): string[] => {
  const country = getCountryByCode(countryCode);
  if (!country) return ['en'];
  return [country.languages.primary, ...(country.languages.secondary || [])];
};

// Fonction utilitaire pour obtenir le nom complet de la langue
export const getLanguageName = (languageCode: string): string => {
  const languageNames: Record<string, string> = {
    ar: 'Arabic',
    en: 'English',
    fr: 'French',
    es: 'Spanish',
    de: 'German',
    it: 'Italian',
    pt: 'Portuguese',
    ru: 'Russian',
    zh: 'Chinese',
    ja: 'Japanese',
    ko: 'Korean',
    hi: 'Hindi',
    // Ajouter d'autres langues selon les besoins
  };
  return languageNames[languageCode] || languageCode;
};
