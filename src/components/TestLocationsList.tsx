'use client';

import React, { useState, useEffect } from 'react';
import { TestLocation } from '@/lib/datocms';
import { getTestLocations } from '@/services/clientApi';
import { ErrorMessage } from './ErrorMessage';

export function TestLocationsList() {
  const [locations, setLocations] = useState<TestLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLocations() {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching test locations from DatoCMS');
        const data = await getTestLocations();
        console.log('Test locations fetched:', data);
        setLocations(data);
      } catch (err) {
        console.error('Failed to fetch test locations:', err);
        setError('Failed to load test locations. Please check DatoCMS configuration.');
      } finally {
        setLoading(false);
      }
    }

    loadLocations();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-16 rounded mb-4"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!locations || locations.length === 0) {
    return <p>No test locations found. Please add locations in DatoCMS.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Test Locations</h2>
      <ul className="space-y-4">
        {locations.map((location) => (
          <li key={location.id} className="space-card p-4">
            <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
            {location.description && <p className="mb-2">{location.description}</p>}
            <div className="text-sm text-gray-400">
              <p>Coordinates: {location.location.latitude}, {location.location.longitude}</p>
              <p>Created: {new Date(location.createdAt).toLocaleDateString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
