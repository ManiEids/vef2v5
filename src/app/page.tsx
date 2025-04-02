// F: Forsíða
import Link from 'next/link';
import { fetchHomePage, fetchAllCategories, fetchAllTestLocations, Category } from '@/lib/datocms';

export default async function HomePage() {
  try {
    // Log the API token in development mode for debugging
    if (process.env.NODE_ENV !== 'production') {
      console.log('Using DatoCMS API token:', 
        process.env.DATOCMS_API_TOKEN ? 
        `${process.env.DATOCMS_API_TOKEN.substring(0, 5)}...` : 
        'Missing token');
    }

    const homeData = await fetchHomePage();
    const categories = await fetchAllCategories();
    const testLocations = await fetchAllTestLocations();
    const fallbackImageUrl = 'https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=1200&auto=format&fit=crop';

    // F: hjálparfall til að fjarlægja leiðbeiningar
    const removeGuides = (content: string): string => {
      const guidePhrases = ['Leiðbeiningar:', '← Go to content editing', 'Edit model', 'Edit field', 'Search...'];
      for (const phrase of guidePhrases) {
        const index = content.indexOf(phrase);
        if (index !== -1) { return content.substring(0, index).trim(); }
      }
      return content;
    };

    return (
      <div>
        <header className="text-center mb-8">
          <h1 className="text-glow mb-2">{homeData?.title || 'Verkefni 5 - Vefforritun 2'}</h1>
          <p className="mb-6">{homeData?.subtitle || 'Spurningaleikur með DatoCMS'}</p>
          {/* Check both headerImage and headerimage since DatoCMS fields may vary */}
          {(homeData?.headerImage?.url || homeData?.headerimage?.url) ? (
            <div className="mb-6 flex flex-col items-center">
              <img 
                src={homeData.headerImage?.url || homeData.headerimage?.url} 
                alt={homeData.headerImage?.alt || homeData.headerimage?.alt || 'Mynd'} 
                className="rounded-lg shadow-lg max-w-full" 
                style={{ maxHeight: '400px', objectFit: 'contain' }} 
              />
            </div>
          ) : (
            <div className="mb-6 flex flex-col items-center">
              <img src={fallbackImageUrl} alt="Fallback space image" className="rounded-lg shadow-lg max-w-full mx-auto" style={{ maxHeight: '250px', objectFit: 'cover' }} />
            </div>
          )}
        </header>
        <div className="space-card">
          <div className="mb-6">
            <h2 className="mb-4">Spurningaflokkar</h2>
            {homeData?.description ? (
              <div dangerouslySetInnerHTML={{ __html: removeGuides(homeData.description) }} />
            ) : (
              <p>Veldu flokk að neðan til að taka þátt í spurningaleiknum</p>
            )}
          </div>
          {categories && categories.length > 0 ? (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category: Category) => (
                <li key={category.id} className="space-card">
                  <Link href={`/categories/${category.slug}`} className="block">
                    <h3 className="mb-2">{category.title}</h3>
                    {category.description && (
                      <div dangerouslySetInnerHTML={{ __html: category.description }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Engir flokkar fundust. Vinsamlegast bættu við flokkum í DatoCMS.</p>
          )}
        </div>
        {testLocations.length > 0 && (
          <div className="space-card mt-6">
            <div className="mb-4">
              <h2 className="mb-2">Staðsetningar</h2>
              <p>Hér eru staðsetningar sem hafa verið skráðar:</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testLocations.map((location) => (
                <div key={location.id} className="space-card">
                  <h3>{location.name}</h3>
                  <p className="text-sm text-gray-400">Hnit: {location.location.latitude.toFixed(4)}, {location.location.longitude.toFixed(4)}</p>
                  <Link href="/test-locations" className="text-sm text-blue-300 hover:text-blue-100 mt-2 inline-block">
                    Sjá nánar →
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link href="/test-locations" className="space-button">Skoða allar staðsetningar</Link>
            </div>
          </div>
        )}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/test-locations" className="space-button">
            Skoða staðsetningar
          </Link>
          <Link href="/screenshots" className="space-button">
            Skoða skjámyndasafn
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering homepage:", error);
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded">
        <h2 className="mb-2">Villa við að hlaða gögnum frá DatoCMS</h2>
        <p>Athugaðu API lykil og stillingar fyrir DatoCMS.</p>
        <pre className="mt-4 p-2 bg-red-50 rounded overflow-auto">
          {error instanceof Error ? error.message : "Óþekkt villa"}
        </pre>
      </div>
    );
  }
}
