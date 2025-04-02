// F: Staðsetningar síða fall
import Link from 'next/link';
import { fetchAllTestLocations, TestLocation } from '@/lib/datocms';

export default async function TestLocationsPage() {
  const testLocations = await fetchAllTestLocations();
  const locale = process.env.NEXT_PUBLIC_LOCALE || 'is-IS';
  const formatDate = (dateString: string): string => new Date(dateString).toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  function removeGuides(content: string): string {
    const guidePhrases = ['Hvernig á að bæta við', '← Go to content editing', 'Edit model', 'Edit field', 'Search...'];
    for (const phrase of guidePhrases) {
      const index = content.indexOf(phrase);
      if (index !== -1) { return content.substring(0, index).trim(); }
    }
    return content;
  }
  return (
    <div className="space-card">
      <h1 className="mb-6">Staðsetningar</h1>
      {testLocations.length > 0 ? (
        <div className="space-y-4">
          {testLocations.map((location: TestLocation) => (
            <div key={location.id} className="space-card">
              <h3 className="mb-2">{location.name}</h3>
              {location.description && (<p className="mb-3">{removeGuides(location.description)}</p>)}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <strong>Hnit:</strong>
                  <p>{location.location.latitude}, {location.location.longitude}</p>
                </div>
                <div>
                  <strong>Stofnað:</strong>
                  <p>{formatDate(location.createdAt)}</p>
                </div>
              </div>
              <a href={`https://www.google.com/maps?q=${location.location.latitude},${location.location.longitude}`} target="_blank" rel="noopener noreferrer" className="space-button">
                Skoða á korti
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-blue-900/30 rounded-lg text-center">
          <p className="mb-4">Engar staðsetningar fundust.</p>
          <Link href="/" className="space-button">Til baka á forsíðu</Link>
        </div>
      )}
    </div>
  );
}
