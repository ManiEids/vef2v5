import { getCategories } from '@/services/api';
import { Layout } from '@/components/Layout';
import { CategoryList } from '@/components/CategoryList';

export default async function HomePage() {
  const categories = await getCategories();

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Quiz Categories</h1>
      <CategoryList categories={categories} />
    </Layout>
  );
}
