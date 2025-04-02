'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DatoCMSImageProps {
  data: {
    url: string;
    alt?: string;
    blurUpThumb?: string;
    width?: number;
    height?: number;
  };
  className?: string;
  pictureClassName?: string;
}

export default function DatoCMSImage({
  data,
  className = '',
  pictureClassName = '',
}: DatoCMSImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!data) return null;

  const { url, alt = '', blurUpThumb, width, height } = data;
  
  const imageProps = {
    src: url,
    alt,
    width: width || 800,
    height: height || 400,
    className: `transition-opacity ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`,
    onLoadingComplete: () => setIsLoaded(true),
  };

  return (
    <div className={`relative ${pictureClassName} overflow-hidden rounded`}>
      {blurUpThumb && (
        <div
          className={`absolute inset-0 transform scale-105 blur-xl ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          } transition-opacity`}
          style={{
            backgroundImage: `url(${blurUpThumb})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}
      <Image {...imageProps} />
    </div>
  );
}
