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
        const data = await getScreenshots();
        setScreenshots(data);
      } catch (err) {
        console.error('Failed to fetch screenshots:', err);
        setError('Failed to load screenshots. Please check DatoCMS configuration.');
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
        <p className="mb-4">No screenshots found. Please add screenshots in DatoCMS.</p>
        <div className="bg-blue-100 text-blue-800 p-4 rounded mt-4">
          <h3 className="font-bold mb-2">How to add screenshots:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to your DatoCMS admin panel</li>
            <li>Click on "Content" in the top navigation menu</li>
            <li>Select "Screenshot"</li>
            <li>Create a new record and upload images to the "myndir" field</li>
            <li>Click "Save" and then "Publish" to make it visible</li>
          </ol>
        </div>
        <Link href="/" className="inline-block mt-4 space-button">
          Go back home
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
      <h2 className="text-2xl font-bold">Screenshot Gallery</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {allImages.map((image, index) => (
          <div 
            key={`${image.screenshotId}-${image.id}`} 
            className="space-card overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative h-48">
              <Image
                src={image.responsiveImage?.src || image.url}
                alt={image.alt || 'Screenshot'}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
            </div>
            <div className="p-2">
              <p className="text-sm text-gray-400">
                {new Date(image.createdAt).toLocaleDateString()}
              </p>
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
            <div 
              className="relative" 
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={allImages[activeIndex].url} 
                alt={allImages[activeIndex].alt || 'Screenshot'} 
                className="max-h-[85vh] max-w-full object-contain mx-auto"
              />
              <button 
                className="absolute top-4 right-4 bg-white text-black p-2 rounded-full"
                onClick={closeLightbox}
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Link href="/" className="inline-block mt-4 space-button">
        Go back home
      </Link>
    </div>
  );
}
