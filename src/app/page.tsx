import { getCategories } from '@/services/api';
import { Layout } from '@/components/Layout';
import { CategoryList } from '@/components/CategoryList';
import { ErrorMessage } from '@/components/ErrorMessage';
import { Suspense } from 'react';

// Loading component to show while categories are loading
function CategoriesLoading() {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 h-16 rounded mb-4"></div>
      ))}
    </div>
  );
}

// Error boundary component
function CategoryErrorBoundary({ error }: { error: Error }) {
  console.error('Categories error:', error);
  
  return (
    <div className="my-8">
      <ErrorMessage message="Failed to load categories. The backend server may be starting up since it's on a free Render tier. Please wait a moment and refresh the page." />
      <button 
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Page
      </button>
    </div>
  );
}

// Categories component with error handling
async function Categories() {
  try {
    console.log('Fetching categories from:', process.env.NEXT_PUBLIC_API_BASE_URL);
    const categories = await getCategories();
    console.log('Categories fetched:', categories);
    
    if (!categories || categories.length === 0) {
      return <ErrorMessage message="No categories found. The backend server may still be starting up." />;
    }
    
    return <CategoryList categories={categories} />;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return <CategoryErrorBoundary error={error instanceof Error ? error : new Error('Unknown error')} />;
  }
}

export default function HomePage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Quiz Categories</h1>
      <Suspense fallback={<CategoriesLoading />}>
        <Categories />
      </Suspense>
    </Layout>
  );
}
