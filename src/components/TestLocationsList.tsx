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
        console.log('Sæki staðsetningar frá DatoCMS...');
        const data = await getTestLocations();
        console.log('Staðsetningar sóttar:', data);
        if (data.length === 0) {
          console.warn('Engar staðsetningar fundust');
        } else {
          console.log(
            `Sótti ${data.length} staðsetningar:`,
            data.map(
              (loc) =>
                `${loc.name} (${loc.location.latitude}, ${loc.location.longitude})`
            )
          );
        }
        setLocations(data);
      } catch (err) {
        console.error('Villa við að sækja staðsetningar:', err);
        setError(
          'Villa kom upp við að sækja staðsetningar. Athugaðu DatoCMS stillingar.'
        );
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
          <h3 className="text-lg font-semibold mb-2">Lausn vandamáls:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Athugaðu að "Stadur" módelið sé til í DatoCMS</li>
            <li>
              Gakktu úr skugga um að það séu til nauðsynlegir reitir: nafn, lýsing, staðsetning (hnit)
            </li>
            <li>Staðfestu að API-lykillin þinn hafi lesréttindi</li>
          </ol>
          <Link href="/" className="inline-block mt-4 space-button">
            Fara aftur á forsíðu
          </Link>
        </div>
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div>
        <p className="mt-2 text-sm">
          Athugið: Samkvæmt GraphQL-skema, þá er LocationTest einstök færsla með mörgum staðsetningarreitum.
        </p>
        <div className="bg-blue-100 text-blue-800 p-4 rounded mt-4">
          <h3 className="font-bold mb-2">Hvernig á að bæta við staðsetningum:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Farðu á DatoCMS stjórnborðið
              (https://vef2-v5-1467.admin.datocms.com/)
            </li>
            <li>Smelltu á "Content" í efsta valmynd</li>
            <li>Veldu "LocationTest"</li>
            <li>
              Búðu til færslu með annaðhvort:
              <ul className="ml-6 list-disc">
                <li>"Stadur" staðsetningarreit, eða</li>
                <li>"Berlin" staðsetningarreit</li>
              </ul>
            </li>
            <li>Smelltu á "Vista" og svo "Útgefa" til að gera það sýnilegt</li>
          </ol>
        </div>
        <Link href="/" className="inline-block mt-4 space-button">
          Fara aftur á forsíðu
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Staðsetningar</h2>
      {locations.length > 0 && (
        <div className="text-xs text-gray-400 mb-4">
          Sýni {locations.length} staðsetningu(ar)
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {locations.map((location) => (
          <div key={location.id} className="space-card p-4">
            <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
            {location.description && <p className="mb-2">{location.description}</p>}
            <div className="text-sm text-gray-400">
              <p>Hnit: {location.location.latitude}, {location.location.longitude}</p>
              <p className="mt-1">Búið til: {new Date(location.createdAt).toLocaleDateString('is-IS')}</p>
            </div>
            <a 
              href={`https://www.google.com/maps?q=${location.location.latitude},${location.location.longitude}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-3 text-blue-500 hover:underline"
            >
              Skoða á Google Maps
            </a>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-4">
        <Link href="/" className="space-button">
          Fara aftur á forsíðu
        </Link>
        <Link href="/screenshots" className="space-button">
          Skoða skjámyndasafn
        </Link>
      </div>
    </div>
  );
}
