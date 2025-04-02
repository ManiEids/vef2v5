// F: Síðuforrit fyrir flokk
import Link from 'next/link';
import { fetchCategoryBySlug, fetchAllCategories, Category } from '@/lib/datocms';
import { notFound } from 'next/navigation';
import CategoryClient from '@/components/CategoryClient';

export async function generateStaticParams() {
  const categories = await fetchAllCategories();
  return categories.map((category: Category) => ({ slug: category.slug }));
}

// F: CategoryPage fall
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  try {
    console.log(`Rendering category page for slug: ${params.slug}`);
    const data = await fetchCategoryBySlug(params.slug);
    
    if (!data || !data.category) { notFound(); }
    
    const { category } = data;
    
    // Check if we have questions data
    if (!category.questions || category.questions.length === 0) {
      console.log(`Warning: No questions found for category ${params.slug}`);
    }
    
    return <CategoryClient category={category} />;
  } catch (error) {
    console.error(`Error loading category ${params.slug}:`, error);
    return (
      <div className="space-card bg-red-100 text-red-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Villa við að hlaða gögnum</h2>
        <p className="mb-4">Ekki tókst að hlaða spurningum fyrir þennan flokk. Vinsamlegast reyndu aftur síðar.</p>
        <div className="flex flex-col space-y-2">
          <p className="text-sm">Villa: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <Link href="/categories" className="space-button mt-4 inline-block">Til baka í flokkasíðu</Link>
        </div>
      </div>
    );
  }
}
