import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAIGeneration } from '../../hooks/useAIGeneration';
import { BriefData } from '../../types/brief';
import OptimizedImage from '../common/OptimizedImage';

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loading, error, result, generateContent, reset } = useAIGeneration();
  const [progress, setProgress] = useState({
    strategy: false,
    themes: false,
    briefs: false,
    visuals: false,
    execution: false
  });
  const generationAttempted = useRef(false);

  useEffect(() => {
    const briefData = location.state?.briefData as BriefData;
    
    if (!briefData) {
      navigate('/brief');
      return;
    }

    const generateResults = async () => {
      if (generationAttempted.current) return;
      generationAttempted.current = true;

      try {
        setProgress({ strategy: false, themes: false, briefs: false, visuals: false, execution: false });
        await generateContent(briefData, (stage) => {
          console.log(`Mise à jour du progrès: ${stage}`);
          setProgress(prev => ({ ...prev, [stage]: true }));
        });
      } catch (error) {
        console.error('Erreur lors de la génération:', error);
      }
    };

    generateResults();

    return () => {
      reset();
    };
  }, [location.state, navigate, generateContent, reset]);

  const handleRetry = async () => {
    generationAttempted.current = false;
    const briefData = location.state?.briefData as BriefData;
    if (briefData) {
      try {
        setProgress({ strategy: false, themes: false, briefs: false, visuals: false, execution: false });
        await generateContent(briefData, (stage) => {
          setProgress(prev => ({ ...prev, [stage]: true }));
        });
      } catch (error) {
        console.error('Erreur lors de la nouvelle tentative:', error);
      }
    }
  };

  const handleGenerateMore = async () => {
    const briefData = location.state?.briefData as BriefData;
    if (briefData) {
      try {
        setProgress(prev => ({ ...prev, briefs: false, execution: false }));
        await generateContent(briefData, (stage) => {
          setProgress(prev => ({ ...prev, [stage]: true }));
        });
      } catch (error) {
        console.error('Erreur lors de la génération:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-8">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-pink-500 mx-auto"></div>
          <h2 className="text-xl font-semibold text-white">Génération du contenu en cours...</h2>
          
          <div className="space-y-4 max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${progress.strategy ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-white">Génération de la stratégie</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${progress.themes ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-white">Génération des thèmes</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${progress.briefs ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-white">Création des briefs</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${progress.visuals ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-white">Analyse visuelle</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${progress.execution ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-white">Génération des visuels</span>
            </div>
          </div>
          
          <p className="text-white/60">Cette opération peut prendre quelques minutes</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white">Une erreur est survenue</h2>
          <p className="text-white/60">{error.message}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
            >
              Réessayer
            </button>
            <button
              onClick={() => navigate('/brief')}
              className="px-4 py-2 border border-pink-500 text-white rounded-md hover:bg-pink-500/10 transition-colors"
            >
              Retour au formulaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    console.log('Pas de résultat disponible');
    return null;
  }

  return (
    <div className="space-y-8 p-6">
      {/* Stratégie */}
      {result.strategy?.content && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Stratégie de Contenu</h2>
          <div className="glass-panel p-6">
            <div className="prose prose-invert">
              <div dangerouslySetInnerHTML={{ __html: result.strategy.content.replace(/\n/g, '<br/>') }} />
            </div>
            
            {result.strategy.analysis?.strengths?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Points Forts</h3>
                <ul className="list-disc list-inside space-y-2">
                  {result.strategy.analysis.strengths.map((strength: string, index: number) => (
                    <li key={index} className="text-white/80">{strength}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Briefs Créatifs avec Visuels */}
      {result.briefs?.briefs && result.briefs.briefs.length > 0 && (
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Briefs Créatifs & Visuels ({result.briefs.briefs.length}/12)</h2>
            <button
              onClick={handleGenerateMore}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors"
            >
              Générer Plus
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.briefs.briefs.map((brief, index) => {
              const executedBrief = result.executedBriefs?.find(eb => eb.visualPrompt === brief.visualPrompt);
              const isFirstImage = index === 0;
              
              return (
                <div key={index} className="glass-panel p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Brief {index + 1}/12</h3>
                  
                  {/* Image Container - Optimisé */}
                  {executedBrief?.image?.url && (
                    <div className="relative w-full">
                      <OptimizedImage
                        imageUrl={executedBrief.image.url}
                        alt={executedBrief.image.alt || `Image générée pour le brief ${index + 1}`}
                        format="auto"
                        className="mb-4 hover:shadow-xl transition-shadow duration-300 w-full"
                        priority={isFirstImage}
                        quality={executedBrief.image.quality || 'high'}
                        showModal={true}
                      />
                    </div>
                  )}
                  
                  {/* Brief Content */}
                  <div className="prose prose-invert">
                    {brief.content?.main && <p className="text-lg font-medium">{brief.content.main}</p>}
                    {brief.content?.tagline && (
                      <div className="mt-4">
                        <p className="font-semibold">Tagline:</p>
                        <p>{brief.content.tagline}</p>
                      </div>
                    )}
                    {brief.content?.cta && (
                      <div className="mt-4">
                        <p className="font-semibold">Call to Action:</p>
                        <p>{brief.content.cta}</p>
                      </div>
                    )}
                    {brief.content?.hashtags?.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold">Hashtags:</p>
                        <p className="text-pink-400">{brief.content.hashtags.join(' ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Actions */}
      <section className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/brief')}
          className="px-4 py-2 text-white border border-white/30 rounded-md hover:bg-white/10 transition-colors"
        >
          Modifier le brief
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-md hover:from-pink-600 hover:to-purple-700 transition-colors"
        >
          Exporter les résultats
        </button>
      </section>
    </div>
  );
};

export default ResultsPage;
