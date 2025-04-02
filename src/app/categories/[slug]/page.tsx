// F: Síðuforrit fyrir flokk
import Link from 'next/link';
import { fetchCategoryBySlug, fetchAllCategories, fetchQuestionsByCategorySlug, Category, Question } from '@/lib/datocms';
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
    
    // Fetch category and questions separately since there's no direct relationship in DatoCMS
    const categoryData = await fetchCategoryBySlug(params.slug);
    
    if (!categoryData || !categoryData.category) {
      notFound();
    }
    
    // Fetch questions for this category
    const questions = await fetchQuestionsByCategorySlug(params.slug);
    console.log(`Found ${questions.length} questions for category ${params.slug}`);
    
    // Combine the data for the client component
    const category = {
      ...categoryData.category,
      questions: questions
    };
    
    return <CategoryClient category={category} />;
  } catch (error) {
    console.error(`Error loading category ${params.slug}:`, error);
    return (
      <div className="space-card bg-red-100 text-red-800 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">Villa við að hlaða gögnum</h2>
        <p className="mb-4">Ekki tókst að hlaða spurningum fyrir þennan flokk. Vinsamlegast reyndu aftur síðar.</p>
        <div className="flex flex-col space-y-2">
          <p className="text-sm">Villa: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <pre className="text-xs bg-red-50 p-2 mt-2 rounded overflow-auto">
            {error instanceof Error && error.stack ? error.stack : JSON.stringify(error, null, 2)}
          </pre>
          <Link href="/categories" className="space-button mt-4 inline-block">Til baka í flokkasíðu</Link>
        </div>
      </div>
    );
  }
}
