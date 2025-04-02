import React from 'react';

interface RichContentProps {
  content: string;
}

export default function RichContent({ content }: RichContentProps) {
  if (!content) return null;

  // Replace any broken image paths if necessary
  const fixedContent = content
    .replace(/\.pn"/g, '.png"') // Fix potentially truncated PNG extensions
    .replace(/\.jp"/g, '.jpg"') // Fix potentially truncated JPG extensions
    .replace(/img src="([^"]+)"/g, (match, src) => {
      // Make sure image sources are absolute URLs
      if (src.startsWith('/')) {
        return `img src="https://www.datocms-assets.com${src}"`;
      }
      return match;
    });

  return (
    <div 
      className="rich-content structured-content"
      dangerouslySetInnerHTML={{ __html: fixedContent }}
    />
  );
}
