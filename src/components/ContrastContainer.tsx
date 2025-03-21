'use client';

import React from 'react';

type ContrastContainerProps = {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
};

export function ContrastContainer({ 
  children, 
  className = '', 
  dark = false 
}: ContrastContainerProps) {
  const baseClass = 'p-4 rounded-lg content-container';
  const textClass = dark ? 'text-light' : 'text-dark';
  
  return (
    <div className={`${baseClass} ${textClass} ${className}`}>
      {children}
    </div>
  );
}
