'use client';

import React, { useState, useEffect } from 'react';
import { Screenshot } from '@/lib/datocms';
import { getScreenshots } from '@/services/clientApi';
import { ErrorMessage } from './ErrorMessage';
import Link from 'next/link';
import Image from 'next/image';

export function ScreenshotGallery() {
  const [screenshots, setScreenshots] = useState<Screenshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    async function loadScreenshots() {
      setLoading(true);
      setError(null);
      try {
        console.log('Sæki skjámyndir frá DatoCMS...');
        const data = await getScreenshots();
        console.log(`Sótti ${data.length} skjámyndir`);
        setScreenshots(data);
      } catch (err) {
        console.error('Villa við að sækja skjámyndir:', err);
        setError('Villa kom upp við að sækja skjámyndir. Athugaðu DatoCMS stillingar.');
      } finally {
        setLoading(false);
      }
    }

    loadScreenshots();
  }, []);

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveIndex(-1);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-200 h-48 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!screenshots || screenshots.length === 0) {
    return (
      <div className="space-card p-6">
        <p className="mb-4">Engar skjámyndir fundust. Vinsamlegast bættu við skjámyndum í DatoCMS.</p>
        <div className="bg-blue-100 text-blue-800 p-4 rounded mt-4">
          <h3 className="font-bold mb-2">Hvernig á að bæta við skjámyndum:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Farðu á DatoCMS stjórnborðið</li>
            <li>Smelltu á "Content" í efsta valmynd</li>
            <li>Veldu "Screenshot"</li>
            <li>Búðu til nýja færslu og settu myndir í "myndir" reitinn</li>
            <li>Smelltu á "Vista" og svo "Útgefa" til að gera það sýnilegt</li>
          </ol>
        </div>
        <Link href="/" className="inline-block mt-4 space-button">
          Fara aftur á forsíðu
        </Link>
      </div>
    );
  }

  // Flatten all images from all screenshots into a single array
  const allImages = screenshots.flatMap(screenshot => 
    screenshot.myndir.map(image => ({
      ...image,
      screenshotId: screenshot.id,
      createdAt: screenshot._createdAt
    }))
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Skjámyndasafn</h2>
      {allImages.length > 0 && (
        <p className="text-gray-400 mb-4">Sýni {allImages.length} skjámynd(ir)</p>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allImages.map((image, index) => (
          <div 
            key={`${image.screenshotId}-${image.id}`} 
            className="space-card p-2 overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => openLightbox(index)}
          >
            <div className="relative aspect-[4/3] w-full">
              {/* Use next/image with objectFit="contain" to prevent skewing */}
              <Image
                src={image.responsiveImage?.src || image.url}
                alt={image.alt || 'Skjámynd'}
                fill
                className="object-contain bg-gray-900"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                placeholder={image.responsiveImage?.base64 ? "blur" : "empty"}
                blurDataURL={image.responsiveImage?.base64}
              />
            </div>
            <div className="p-2 mt-2">
              <p className="text-sm text-gray-400">
                {new Date(image.createdAt).toLocaleDateString('is-IS')}
              </p>
              {image.title && <p className="text-sm font-medium mt-1">{image.title}</p>}
            </div>
          </div>
        ))}
      </div>

      {activeIndex !== -1 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <div className="max-w-6xl max-h-screen p-4">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <img 
                src={allImages[activeIndex].url} 
                alt={allImages[activeIndex].alt || 'Skjámynd'} 
                className="max-h-[85vh] max-w-full object-contain mx-auto"
              />
              <button 
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full"
                onClick={closeLightbox}
              >
                ✕
              </button>
              {allImages[activeIndex].title && (
                <div className="bg-black bg-opacity-50 text-white p-2 absolute bottom-0 left-0 right-0 text-center">
                  {allImages[activeIndex].title}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <Link href="/" className="space-button">
          Fara aftur á forsíðu
        </Link>
      </div>
    </div>
  );
}
