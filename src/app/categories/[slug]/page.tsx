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
    const data = await fetchCategoryBySlug(params.slug);
    if (!data || !data.category) { notFound(); }
    const { category } = data;
    return <CategoryClient category={category} />;
  } catch (error) {
    console.error(`Error loading category ${params.slug}:`, error);
    return (
      <div className="bg-red-100 text-red-800 p-4 rounded">
        <h2 className="mb-2">Villa við að hlaða gögnum</h2>
        <p>Ekki tókst að hlaða spurningum fyrir þennan flokk. Vinsamlegast reyndu aftur síðar.</p>
        <Link href="/categories" className="space-button mt-4">Til baka í flokkasíðu</Link>
      </div>
    );
  }
}
