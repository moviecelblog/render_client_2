import React from 'react';
import Logo from '../common/Logo';

interface Feature {
  title: string;
  description: string;
  comingSoon?: boolean;
}

const upcomingFeatures: Feature[] = [
  {
    title: "Analyse de Performance",
    description: "Obtenez des insights détaillés sur l'engagement de vos posts",
    comingSoon: true
  },
  {
    title: "Multi-Plateformes",
    description: "Support pour LinkedIn, Instagram, et TikTok",
    comingSoon: true
  },
  {
    title: "Personnalisation Avancée",
    description: "Plus d'options pour adapter le contenu à votre marque"
  }
];

const GenerationProgress: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* Logo et Animation */}
      <div className="mb-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#53dfb2] to-[#2d2d67] rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Logo size="large" color="white" className="relative z-10" />
      </div>

      {/* Message Principal */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-[#53dfb2] bg-clip-text text-transparent mb-4">
          Génération de Contenu en Cours
        </h2>
        <p className="text-white/60 max-w-md">
          Notre IA travaille pour créer du contenu unique et engageant pour votre marque. 
          Cela peut prendre quelques minutes.
        </p>
      </div>

      {/* Animation de Chargement */}
      <div className="flex space-x-3 mb-16">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-[#53dfb2] animate-loading-bounce"
            style={{ animationDelay: `${i * 0.16}s` }}
          ></div>
        ))}
      </div>

      {/* Prochaines Fonctionnalités */}
      <div className="max-w-2xl w-full">
        <h3 className="text-xl font-semibold text-white/80 mb-6 text-center">
          Prochainement sur Social Media AI
        </h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingFeatures.map((feature, index) => (
            <div
              key={index}
              className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:scale-105 transition-transform duration-300"
            >
              {feature.comingSoon && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs rounded-full bg-[#53dfb2]/20 text-[#53dfb2] border border-[#53dfb2]/20">
                    Bientôt
                  </span>
                </div>
              )}
              <h4 className="text-lg font-medium text-white mb-2">{feature.title}</h4>
              <p className="text-white/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenerationProgress;
