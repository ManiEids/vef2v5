import { Layout } from '@/components/Layout';
import { CategoryListWithRefresh } from '@/components/CategoryListWithRefresh';

export default function HomePage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Quiz Categories</h1>
      <CategoryListWithRefresh />
    </Layout>
  );
}
