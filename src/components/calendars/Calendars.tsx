import React, { useState } from 'react';
import { config } from '../../config/env';
import { Link } from 'react-router-dom';
import GenerationProgress from '../loading/GenerationProgress';
import { countries } from '../../constants/countries';

type Status = 'draft' | 'active' | 'completed' | 'archived';

const STATUS_TRANSLATIONS: Record<Status, string> = {
  draft: 'Brouillon',
  active: 'En cours',
  completed: 'Terminé',
  archived: 'Archivé'
};

interface CalendarData {
  _id: string;
  name: string;
  brandId: {
    _id: string;
    name: string;
  };
  status: Status;
  startDate: string;
  endDate: string;
  progress?: number;
}

interface Brand {
  _id: string;
  name: string;
  sector: string;
  description?: string;
}

interface CalendarFormData {
  name: string;
  startDate: string;
  endDate: string;
  country: string;
  languages: string[];  // Changé de language à languages
  targetAudience: string;
  brandId: string;
  goals: string[];
  frequency: 'daily' | 'twice_daily' | 'three_per_week' | 'weekly';
  contentPlan: {
    frequency: {
      facebook: number;
      instagram: number;
      twitter: number;
      linkedin: number;
      tiktok: number;
    };
    preferredTimes: {
      facebook: string[];
      instagram: string[];
      twitter: string[];
      linkedin: string[];
      tiktok: string[];
    };
    contentMix: {
      type: string;
      percentage: number;
    }[];
  };
  generationSettings: {
    tone: string;
    themes: string[];
    keywords: string[];
    contentLength: {
      min: number;
      max: number;
    };
    imageStyle: string[];
  };
}

const LanguageSection: React.FC<{
  country: string;
  languages: string[];
  onChange: (languages: string[]) => void;
}> = ({ country, languages, onChange }) => {
  const selectedCountry = countries.find(c => c.code === country);
  if (!selectedCountry) return null;

  const allLanguages = [
    { code: selectedCountry.languages.primary, name: selectedCountry.languageNames.primary },
    ...(selectedCountry.languages.secondary?.map((code, index) => ({
      code,
      name: selectedCountry.languageNames.secondary?.[index] || code
    })) || [])
  ];

  return (
    <div className="space-y-2 glass-panel p-4">
      {allLanguages.map(lang => {
        const dialectInfo = selectedCountry.dialectInfo?.[lang.code];
        return (
          <label key={lang.code} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={languages.includes(lang.code)}
              onChange={(e) => {
                if (e.target.checked) {
                  onChange([...languages, lang.code]);
                } else {
                  onChange(languages.filter(l => l !== lang.code));
                }
              }}
              className="form-checkbox h-4 w-4 text-[#53dfb2] rounded focus:ring-[#53dfb2]"
            />
            <span className="text-white">
              {lang.name}
              {dialectInfo && (
                <span className="ml-2 text-sm text-white/60">
                  ({dialectInfo.description})
                </span>
              )}
            </span>
          </label>
        );
      })}
    </div>
  );
};

const Calendars: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [formData, setFormData] = useState<CalendarFormData>({
    name: '',
    startDate: '',
    endDate: '',
    country: '',
    languages: [],  // Initialisé comme un tableau vide
    targetAudience: '',
    brandId: '',
    goals: [],
    frequency: 'daily',
    contentPlan: {
      frequency: {
        facebook: 3,
        instagram: 3,
        twitter: 3,
        linkedin: 2,
        tiktok: 2
      },
      preferredTimes: {
        facebook: ['10:00', '15:00', '19:00'],
        instagram: ['9:00', '13:00', '18:00'],
        twitter: ['8:00', '12:00', '17:00'],
        linkedin: ['10:00', '14:00'],
        tiktok: ['11:00', '16:00']
      },
      contentMix: [
        { type: 'image', percentage: 60 },
        { type: 'video', percentage: 30 },
        { type: 'text', percentage: 10 }
      ]
    },
    generationSettings: {
      tone: 'professionnel',
      themes: ['produit', 'marque', 'lifestyle'],
      keywords: [],
      contentLength: {
        min: 100,
        max: 280
      },
      imageStyle: ['moderne', 'professionnel']
    }
  });

  const [calendars, setCalendars] = useState<CalendarData[]>([]);

  // Charger les marques et les calendriers au montage du composant
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les marques d'abord
        const brandsResponse = await fetch(`${config.apiUrl}/brands`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });

        if (!brandsResponse.ok) {
          throw new Error('Erreur lors de la récupération des marques');
        }

        const brandsResult = await brandsResponse.json();
        if (!brandsResult.success) {
          throw new Error(brandsResult.message || 'Erreur lors de la récupération des marques');
        }
        setBrands(brandsResult.data);
        
        // Si des marques sont disponibles, sélectionner la première par défaut
        if (brandsResult.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            brandId: brandsResult.data[0]._id
          }));
        }

        // Ensuite récupérer les calendriers
        const calendarsResponse = await fetch(`${config.apiUrl}/calendars`, {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });

        if (!calendarsResponse.ok) {
          throw new Error('Erreur lors de la récupération des calendriers');
        }

        const calendarsResult = await calendarsResponse.json();
        if (!calendarsResult.success) {
          throw new Error(calendarsResult.message || 'Erreur lors de la récupération des calendriers');
        }
        setCalendars(calendarsResult.data);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        alert('Erreur : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce calendrier ?')) {
      return;
    }

    try {
      const response = await fetch(`${config.apiUrl}/calendars/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du calendrier');
      }

      // Mettre à jour la liste des calendriers
      setCalendars(calendars.filter(calendar => calendar._id !== id));
    } catch (error) {
      alert('Erreur : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      validateForm();
      
      const response = await fetch(`${config.apiUrl}/calendars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du calendrier');
      }

      const calendar = await response.json();
      setShowForm(false);
      window.location.reload();
    } catch (error) {
      alert('Erreur : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  const validateForm = () => {
    if (!formData.brandId) {
      throw new Error('La marque est requise');
    }
    if (!formData.country) {
      throw new Error('Le pays cible est requis');
    }
    if (formData.languages.length === 0) {
      throw new Error('Au moins une langue est requise');
    }
    if (!formData.startDate || !formData.endDate) {
      throw new Error('Les dates de début et de fin sont requises');
    }
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (isNaN(start.getTime())) {
      throw new Error('La date de début est invalide');
    }
    if (isNaN(end.getTime())) {
      throw new Error('La date de fin est invalide');
    }
    if (start >= end) {
      throw new Error('La date de fin doit être postérieure à la date de début');
    }
    if (!formData.name.trim()) {
      throw new Error('Le nom du calendrier est requis');
    }
  };

  const handleGenerate = async () => {
    try {
      validateForm();

      if (!formData.brandId) {
        throw new Error('Veuillez sélectionner une marque');
      }

      const brand = brands.find(b => b._id === formData.brandId);
      if (!brand) {
        throw new Error('La marque sélectionnée est invalide');
      }

      setIsGenerating(true);
      setShowForm(false);

      const frequencyMultiplier = formData.frequency === 'daily' ? 1 
        : formData.frequency === 'twice_daily' ? 2 
        : formData.frequency === 'three_per_week' ? 3/7
        : 1/7;
      const calendarData = {
        ...formData,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        brandId: brand._id,
        targetCountry: formData.country,
        targetLanguages: formData.languages,  // Changé de targetLanguage à targetLanguages
        contentPlan: {
          ...formData.contentPlan,
          contentMix: formData.contentPlan.contentMix.map(mix => ({
            type: mix.type,
            percentage: mix.percentage
          })),
          frequency: Object.fromEntries(
            Object.entries(formData.contentPlan.frequency).map(([platform, value]) => [
              platform,
              value * frequencyMultiplier
            ])
          )
        }
      };

      const calendarResponse = await fetch(`${config.apiUrl}/calendars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        },
        body: JSON.stringify(calendarData)
      });

      if (!calendarResponse.ok) {
        const errorData = await calendarResponse.json();
        throw new Error(`Erreur lors de la création du calendrier: ${errorData.message || 'Erreur inconnue'}`);
      }

      const calendarResult = await calendarResponse.json();
      if (!calendarResult.success || !calendarResult.data || !calendarResult.data._id) {
        throw new Error('Réponse invalide du serveur lors de la création du calendrier');
      }

      const calendar = calendarResult.data;
      const generateResponse = await fetch(`${config.apiUrl}/calendars/${calendar._id}/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!generateResponse.ok) {
        throw new Error('Erreur lors de la génération du contenu');
      }

      const generateResult = await generateResponse.json();
      if (!generateResult.success) {
        throw new Error('Échec de la génération du contenu');
      }

      window.location.href = `/results/${calendar._id}`;
    } catch (error) {
      setIsGenerating(false);
      alert('Erreur : ' + (error instanceof Error ? error.message : 'Erreur inconnue'));
    }
  };

  if (isGenerating) {
    return <GenerationProgress />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent">
          Calendriers Éditoriaux
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="glass-button inline-flex items-center"
        >
          <svg
            className="-ml-1 mr-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Nouveau Calendrier
        </button>
      </div>

      {/* Liste des calendriers */}
      <div className="glass-panel overflow-hidden">
        <ul className="divide-y divide-white/10">
          {calendars.length === 0 ? (
            <li className="px-6 py-6 text-center text-white/60">
              Aucun calendrier trouvé. Créez-en un nouveau !
            </li>
          ) : (
            calendars.map((calendar) => (
              <li key={calendar._id}>
                <div className="px-6 py-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-[#53dfb2] truncate">
                        {calendar.name}
                      </p>
                      <p className="mt-2 text-sm text-white/60">
                        {calendar.brandId?.name || 'Marque inconnue'}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <div className="flex space-x-3">
                        <Link
                          to={`/results/${calendar._id}`}
                          className="glass-button text-xs py-2"
                        >
                          Voir le contenu
                        </Link>
                        <button
                          onClick={() => handleDelete(calendar._id)}
                          className="glass-button text-xs py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                          Supprimer
                        </button>
                        <p className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#53dfb2]/20 text-[#53dfb2]">
                          {STATUS_TRANSLATIONS[calendar.status]}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="relative w-full bg-white/10 rounded-full h-2">
                      <div
                        className="absolute h-2 bg-gradient-to-r from-[#53dfb2] to-[#3fa88a] rounded-full transition-all duration-500"
                        style={{ width: `${calendar.progress || 0}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/60 text-right">
                      {calendar.progress || 0}% complété
                    </p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Modal de création de calendrier */}
      {showForm && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-[#2d2d67]/80 backdrop-blur-sm"></div>
            </div>

            <div className="inline-block align-bottom glass-panel rounded-xl px-6 pt-6 pb-6 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <h3 className="text-xl leading-6 font-medium text-white mb-6">
                    Nouveau Calendrier Éditorial
                  </h3>
                  <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80">
                        Nom du calendrier
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="glass-input mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-white/80">
                          Date de début
                        </label>
                        <input
                          type="date"
                          name="startDate"
                          id="startDate"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="glass-input mt-1"
                        />
                      </div>
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-white/80">
                          Date de fin
                        </label>
                        <input
                          type="date"
                          name="endDate"
                          id="endDate"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="glass-input mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-white/80">
                          Marque
                        </label>
                        <select
                          id="brand"
                          name="brand"
                          value={formData.brandId}
                          onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
                          className="glass-input mt-1"
                        >
                          {brands.length === 0 ? (
                            <option value="">Aucune marque disponible</option>
                          ) : (
                            brands.map((brand) => (
                              <option key={brand._id} value={brand._id}>
                                {brand.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-white/80">
                          Pays cible
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={(e) => {
                            const selectedCountry = countries.find(c => c.code === e.target.value);
                            setFormData({
                              ...formData,
                              country: e.target.value,
                              languages: selectedCountry ? [selectedCountry.languages.primary] : []
                            });
                          }}
                          className="glass-input mt-1"
                        >
                          <option value="">Sélectionnez un pays</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Langues (sélection multiple)
                      </label>
                      <LanguageSection
                        country={formData.country}
                        languages={formData.languages}
                        onChange={(languages) => setFormData({ ...formData, languages })}
                      />
                    </div>

                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-white/80">
                        Fréquence de publication
                      </label>
                      <select
                        id="frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'twice_daily' | 'three_per_week' | 'weekly' })}
                        className="glass-input mt-1"
                      >
                        <option value="daily">Quotidienne (1 post par jour)</option>
                        <option value="twice_daily">Bi-quotidienne (2 posts par jour)</option>
                        <option value="three_per_week">3 posts par semaine</option>
                        <option value="weekly">1 post par semaine</option>
                      </select>
                    </div>

                    <div className="mt-8 sm:flex sm:flex-row-reverse space-x-3 space-x-reverse">
                      <button
                        type="submit"
                        className="glass-button w-full sm:w-auto sm:text-sm"
                      >
                        Créer
                      </button>
                      <button
                        type="button"
                        onClick={handleGenerate}
                        className="glass-button w-full sm:w-auto sm:text-sm mt-3 sm:mt-0"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                        </svg>
                        Générer
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="glass-button w-full sm:w-auto sm:text-sm mt-3 sm:mt-0 bg-white/10 hover:bg-white/20"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendars;
