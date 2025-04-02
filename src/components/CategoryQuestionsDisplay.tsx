'use client';

import React, { useState, useEffect } from 'react';
import { ErrorMessage } from '@/components/ErrorMessage';
import QuestionList from '@/components/QuestionList';
import { getCategory, getQuestionsByCategory } from '@/services/clientApi';
import { Category as ApiCategory, Question as ApiQuestion } from '@/services/api-types';
import { Question as DatoCMSQuestion } from '@/lib/datocms';

export function CategoryQuestionsDisplay({ slug }: { slug: string }) {
  const [category, setCategory] = useState<ApiCategory | null>(null);
  const [questions, setQuestions] = useState<DatoCMSQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      
      try {
        const [categoryData, questionsData] = await Promise.all([
          getCategory(slug),
          getQuestionsByCategory(slug)
        ]);
        
        setCategory(categoryData);
        
        // Transform questions to match DatoCMSQuestion type
        const transformedQuestions = questionsData.map((q: ApiQuestion) => ({
          ...q,
          text: (q as any).text || '',
          answers: q.answers || []
        })) as DatoCMSQuestion[];
        
        setQuestions(transformedQuestions);
      } catch (err) {
        setError('Failed to load category data. Please try again later.');
        console.error('Error loading category data:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [slug]);

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error || !category) {
    return (
      <div>
        <ErrorMessage message={error || 'Category not found'} />
        <button 
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{category.title}</h1> {/* titill frekar en nafn */}
        <p className="text-gray-600">Answer the questions below:</p>
      </div>
      
      <QuestionList questions={questions} />
    </div>
  );
}
