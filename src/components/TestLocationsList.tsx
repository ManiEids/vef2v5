'use client';

import React, { useState, useEffect } from 'react';
import { TestLocation } from '@/lib/datocms';
import { getTestLocations } from '@/services/clientApi';
import { ErrorMessage } from './ErrorMessage';
import Link from 'next/link';

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
    return (
      <div>
        <ErrorMessage message={error} />
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Troubleshooting:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Check that the "Stadur" model exists in your DatoCMS</li>
            <li>Make sure it has the required fields: name, description, location (geolocation)</li>
            <li>Verify your API token has read permissions</li>
          </ol>
          <Link href="/" className="inline-block mt-4 space-button">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="space-card p-6">
        <p className="mb-4">No test locations found. Please add locations in DatoCMS.</p>
        <div className="bg-blue-100 text-blue-800 p-4 rounded mt-4">
          <h3 className="font-bold mb-2">How to add test locations:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Go to your DatoCMS admin panel</li>
            <li>Navigate to the "Stadur" model</li>
            <li>Create new entries with name, description, and location data</li>
            <li>Publish the entries</li>
          </ol>
        </div>
        <Link href="/" className="inline-block mt-4 space-button">
          Go back home
        </Link>
      </div>
    );
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
              <p className="mt-1">Created: {new Date(location.createdAt).toLocaleDateString()}</p>
            </div>
            
            <a 
              href={`https://www.google.com/maps?q=${location.location.latitude},${location.location.longitude}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-500 hover:underline"
            >
              View on Google Maps
            </a>
          </li>
        ))}
      </ul>
      <Link href="/" className="inline-block mt-4 space-button">
        Go back home
      </Link>
    </div>
  );
}
