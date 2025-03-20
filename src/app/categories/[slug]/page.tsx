import { getCategory, getQuestionsByCategory } from '@/services/api';
import { Layout } from '@/components/Layout';
import { QuestionList } from '@/components/QuestionList';
import { notFound } from 'next/navigation';

interface CategoryPageProps {
  params: {
    slug: string;
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  try {
    const [category, questions] = await Promise.all([
      getCategory(params.slug),
      getQuestionsByCategory(params.slug)
    ]);

    return (
      <Layout>
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
          <p className="text-gray-600">Answer the questions below:</p>
        </div>
        
        <QuestionList questions={questions} />
      </Layout>
    );
  } catch (error) {
    notFound();
  }
}
