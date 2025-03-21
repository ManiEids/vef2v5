'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { QuestionForm } from '@/components/forms/QuestionForm';
import { 
  Category, 
  Question, 
  getCategories, 
  getQuestionsByCategory,
  createQuestion
} from '@/services/api';
import Link from 'next/link';

export default function AdminQuestionsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setError('Villa við að sækja flokka');
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      getQuestionsByCategory(selectedCategory)
        .then(data => {
          setQuestions(data);
          setError(null);
        })
        .catch(err => {
          setError('Villa við að sækja spurningar');
          setQuestions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setQuestions([]);
    }
  }, [selectedCategory]);

  const handleCreateQuestion = async (categoryId: number, text: string, answers: any[]) => {
    try {
      const newQuestion = await createQuestion(
        categoryId,
        text,
        answers.map(a => ({
          answer: a.text, // Map to backend expected format
          correct: a.correct
        }))
      );
      
      setQuestions([...questions, newQuestion]);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Stjórna spurningum</h1>
      
      <div className="mb-6">
        <label htmlFor="categorySelect" className="block mb-1 font-medium">
          Veldu flokk
        </label>
        <select
          id="categorySelect"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border rounded"
        >
          <option value="">Veldu flokk</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.title} {/* Changed from name to title */}
            </option>
          ))}
        </select>
      </div>
      
      {selectedCategory && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Create new question</h2>
          <QuestionForm
            categories={categories}
            selectedCategoryId={categories.find(c => c.slug === selectedCategory)?.id}
            onSubmit={handleCreateQuestion}
          />
        </div>
      )}
      
      {selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Núverandi spurningar í {categories.find(c => c.slug === selectedCategory)?.title}</h2>
          
          {loading ? (
            <p>Sæki spurningar...</p>
          ) : error ? (
            <div className="bg-red-100 text-red-800 p-3 rounded">
              {error}
            </div>
          ) : questions.length === 0 ? (
            <p>Engar spurningar fundust í þessum flokki.</p>
          ) : (
            <ul className="space-y-4">
              {questions.map(question => (
                <li key={question.id} className="bg-white rounded shadow p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{question.question}</h3> {/* Using question not text */}
                    <Link 
                      href={`/admin/questions/edit/${question.id}`}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Breyta
                    </Link>
                  </div>
                  <ul className="mt-2 ml-4 list-disc">
                    {question.answers.map(answer => (
                      <li key={answer.id} className={answer.correct ? 'font-bold text-green-600' : ''}>
                        {answer.answer} {/* Using answer not text */}
                        {answer.correct ? ' (Rétt svar)' : ''}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Layout>
  );
}
