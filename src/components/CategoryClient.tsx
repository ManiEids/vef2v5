'use client';

import { useRouter } from 'next/navigation';
import QuestionList from '@/components/QuestionList';
import { Category, Question } from '@/lib/datocms';

interface CategoryClientProps {
  category: Category & { questions: Question[] };
}

export default function CategoryClient({ category }: CategoryClientProps) {
  const router = useRouter();
  
  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className="space-card">
      <div className="mb-6">
        <div className="mb-4">
          <button onClick={handleBackClick} className="space-button">← Til baka</button>
        </div>
        <h1 className="mb-2">{category.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: category.description }} />
      </div>
      
      {category.questions && category.questions.length > 0 ? (
        <QuestionList questions={category.questions} />
      ) : (
        <div className="space-card">
          <p>Engar spurningar eru til í þessum flokki enn.</p>
        </div>
      )}
    </div>
  );
}
