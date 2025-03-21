import { Layout } from '@/components/Layout';
import { CategoryQuestionsDisplay } from '@/components/CategoryQuestionsDisplay';

interface CategoryPageProps {
  params: {
    slug: string;
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Layout>
      <CategoryQuestionsDisplay slug={params.slug} />
    </Layout>
  );
}
