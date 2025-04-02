'use client';

import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SafeImage({ src, alt, className = '', style = {} }: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError) {
    return (
      <div className={`bg-blue-900/30 rounded-lg p-4 flex items-center justify-center ${className}`} style={style}>
        <p className="text-center text-sm">Villa við að hlaða mynd</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <img 
        src={src}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={style}
        onError={() => {
          console.error("Failed to load image:", src);
          setHasError(true);
        }}
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-900/20 rounded-lg">
          <div className="animate-pulse">Hleð mynd...</div>
        </div>
      )}
    </div>
  );
}
