'use client';

import { SpaceCard } from '@/components/SpaceCard';
import { ContrastContainer } from '@/components/ContrastContainer';

export default function StyleTestPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-glow mb-6">Style Test Page</h1>
      
      <SpaceCard title="Space Card Example">
        <p>This text should be visible against the card background.</p>
        <button className="space-button mt-4 px-4 py-2 rounded">
          Space Button
        </button>
      </SpaceCard>
      
      <ContrastContainer>
        <h2 className="text-2xl font-bold mb-4">Light Container</h2>
        <p>This text should be dark for proper contrast.</p>
      </ContrastContainer>
      
      <ContrastContainer dark className="bg-gray-800">
        <h2 className="text-2xl font-bold mb-4">Dark Container</h2>
        <p>This text should be light for proper contrast.</p>
      </ContrastContainer>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg">
          <p className="text-dark">White background with dark text</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-light">Dark background with light text</p>
        </div>
      </div>
      
      <form className="space-card p-6">
        <h3 className="text-xl mb-4">Form Test</h3>
        <div className="mb-4">
          <label className="block mb-2">Input field:</label>
          <input 
            type="text" 
            className="w-full p-2 rounded border" 
            placeholder="This text should be visible"
          />
        </div>
        <button className="space-button px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
}
