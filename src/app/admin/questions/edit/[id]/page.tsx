'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/Layout';
import { QuestionForm } from '@/components/forms/QuestionForm';
import { Category, Question, getQuestion, updateQuestion, getCategories } from '@/services/api';

interface EditQuestionPageProps {
  params: {
    id: string;
  }
}

export default function EditQuestionPage({ params }: EditQuestionPageProps) {
  const router = useRouter();
  const [question, setQuestion] = useState<Question | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [questionData, categoriesData] = await Promise.all([
          getQuestion(params.id),
          getCategories()
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

  const handleUpdateQuestion = async (text: string, answers: any[]) => {
    if (!question) return;
    
    try {
      await updateQuestion(
        question.id,
        text,
        answers.map(a => ({
          id: a.id,
          text: a.text,
          isCorrect: a.isCorrect
        }))
      );
      
      router.push('/admin/questions');
      return Promise.resolve();
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
      <h1 className="text-3xl font-bold mb-6">Breyta spurningu</h1>
      
      <QuestionForm
        categories={categories}
        initialText={question.text}
        initialAnswers={question.answers}
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
