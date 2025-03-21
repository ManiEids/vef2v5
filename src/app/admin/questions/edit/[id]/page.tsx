'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { QuestionForm } from '@/components/forms/QuestionForm';
import { Category, Question, Answer } from '@/services/api-types';

// Extend the Answer type to include the 'text' property if it is missing
interface AnswerWithText extends Answer {
  text: string;
}

// Extend the Question type to include the 'text' property if it is missing
interface QuestionWithText extends Question {
  text: string;
}
import { api } from '@/services/simpleApi'; // Use the simplified API

interface EditQuestionPageProps {
  params: {
    id: string;
  };
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const router = useRouter();
  const [question, setQuestion] = useState<QuestionWithText | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Use the simplified API
        const [questionData, categoriesData] = await Promise.all([
          api.questions.getById(params.id),
          api.categories.getAll()
        ]);
        
        setQuestion(questionData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError('Villa við að sækja spurningu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [params.id]);

  const handleUpdateQuestion = async (categoryId: number, text: string, answers: any[]) => {
    if (!question) return;
    
    try {
      // Use the simplified API helper which handles field mapping
      await api.questions.update(question.id, text, categoryId, answers);
      
      router.push('/admin/questions');
      return Promise.resolve(); // Fixed errant "t," that was causing the build error
    } catch (error) {
      return Promise.reject(error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p>Sæki spurningu...</p>
      </Layout>
    );
  }

  if (error || !question) {
    return (
      <Layout>
        <div className="bg-red-100 text-red-800 p-3 rounded">
          {error || 'Spurning fannst ekki'}
        </div>
        <button
          onClick={() => router.push('/admin/questions')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Til baka
        </button>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Edit Question</h1>
      <QuestionForm
        categories={categories}
        initialAnswers={(question.answers as AnswerWithText[]).map(a => ({
          id: a.id,
          text: a.text || '',
          correct: a.correct
        }))}
        onSubmit={handleUpdateQuestion}
      />
      
      <button
        onClick={() => router.push('/admin/questions')}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        Hætta við
      </button>
    </Layout>
  );
}
