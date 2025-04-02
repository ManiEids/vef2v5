'use client';

import { useRouter } from 'next/navigation';
import QuestionList from '@/components/QuestionList';
import { Category, Question } from '@/lib/datocms';

interface CategoryClientProps {
  category: Category & { questions: Question[] };
}

// F: Sýnir spurningaflokk og spurningar hans
export default function CategoryClient({ category }: CategoryClientProps) {
  const router = useRouter();

  // F: Fer til baka á forsíðu
  const handleBackClick = () => {
    router.push('/');
  };

  const questions = category.questions || [];

  return (
    <div className="space-card">
      <div className="mb-6">
        <div className="mb-4">
          <button onClick={handleBackClick} className="space-button">← Til baka</button>
        </div>
        <h1 className="mb-2">{category.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: category.description || '' }} />
      </div>
      
      {questions && questions.length > 0 ? (
        <QuestionList questions={questions} />
      ) : (
        <div className="space-card bg-yellow-100 text-yellow-800 p-4">
          <p>Engar spurningar eru til í þessum flokki enn.</p>
          <p className="mt-2 text-sm">Það þarf að bæta við spurningum í þennan flokk í DatoCMS stjórnborðinu.</p>
        </div>
      )}
    </div>
  );
}
