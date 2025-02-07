import React, { useState, useEffect } from 'react';
import { config } from '../../config/env';

interface ImageModalProps {
  imageUrl: string;
  alt: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, alt, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={config.getImageUrl(imageUrl)}
          alt={alt}
          className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          loading="eager"
          decoding="sync"
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 text-4xl transition-colors"
          aria-label="Fermer"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export interface OptimizedImageProps {
  imageUrl: string;
  alt: string;
  format?: 'square' | 'landscape' | 'portrait' | 'banner' | 'auto';
  className?: string;
  showModal?: boolean;
  quality?: 'low' | 'medium' | 'high';
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  imageUrl, 
  alt,
  format = 'auto',
  className = '',
  showModal = true,
  quality = 'high',
  priority = false
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);
  const maxRetries = 3;

  useEffect(() => {
    if (format === 'auto' && imageUrl) {
      const img = new Image();
      img.onload = () => {
        setNaturalDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.src = config.getImageUrl(imageUrl);
    }
  }, [imageUrl, format]);

  const getAspectRatio = () => {
    if (format !== 'auto' || !naturalDimensions) {
      return format;
    }

    const ratio = naturalDimensions.width / naturalDimensions.height;
    if (ratio === 1) return 'square';
    if (ratio > 1.2) return 'landscape';
    if (ratio < 0.8) return 'portrait';
    return 'square';
  };

  const aspectRatios = {
    square: 'aspect-square',
    landscape: 'aspect-[16/9]',
    portrait: 'aspect-[3/4]',
    banner: 'aspect-[21/9]',
    auto: ''
  };

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(false);
      const newUrl = `${config.getImageUrl(imageUrl)}${imageUrl.includes('?') ? '&' : '?'}retry=${retryCount + 1}`;
      const img = new Image();
      img.src = newUrl;
    } else {
      setError(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setError(false);
  };

  const currentFormat = getAspectRatio();
  const containerClasses = `relative overflow-hidden rounded-lg bg-gray-800/50 ${
    currentFormat !== 'auto' ? aspectRatios[currentFormat] : ''
  } ${className}`;

  return (
    <>
      <div 
        className={containerClasses}
        onClick={() => showModal && setShowFullscreen(true)}
      >
        {/* Placeholder/Skeleton */}
        {!isLoaded && !error && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-700 to-gray-600">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 border-3 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 text-white">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-gray-300">Erreur de chargement</span>
          </div>
        )}

        {/* Image */}
        <img
          src={config.getImageUrl(imageUrl)}
          alt={alt}
          className={`w-full h-full ${currentFormat === 'auto' ? 'object-contain' : 'object-cover'} transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${showModal ? 'cursor-zoom-in hover:opacity-90' : ''}`}
          onLoad={handleLoad}
          onError={handleImageError}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
        />

        {/* Overlay pour les images chargées */}
        {isLoaded && showModal && (
          <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity"></div>
        )}

        {/* Indicateur de qualité */}
        {quality !== 'high' && isLoaded && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {quality === 'low' ? 'Basse qualité' : 'Qualité moyenne'}
          </div>
        )}
      </div>

      {/* Modal de zoom */}
      {showFullscreen && showModal && (
        <ImageModal
          imageUrl={imageUrl}
          alt={alt}
          onClose={() => setShowFullscreen(false)}
        />
      )}
    </>
  );
};

export default OptimizedImage;
