'use client';

import React from 'react';

type SpaceCardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export function SpaceCard({ children, title, className = '' }: SpaceCardProps) {
  return (
    <div className={`space-card rounded-lg p-5 mb-6 ${className}`}>
      {title && (
        <h3 className="text-xl font-bold mb-4 text-glow">{title}</h3>
      )}
      <div className="text-light">
        {children}
      </div>
    </div>
  );
}
