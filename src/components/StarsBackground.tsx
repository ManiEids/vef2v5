'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  size: number;
  top: number;
  left: number;
  animationDelay: string;
}

export function StarsBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 100; 
      const newStars: Star[] = [];
      
      for (let i = 0; i < starCount; i++) {
        newStars.push({
          id: i,
          size: Math.random() * 2.5, 
          top: Math.random() * 100,
          left: Math.random() * 100,
          animationDelay: `${Math.random() * 4}s`
        });
      }
      
      setStars(newStars);
    };
    
    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: star.animationDelay
          }}
        />
      ))}
    </div>
  );
}
