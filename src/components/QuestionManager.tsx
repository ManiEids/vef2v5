'use client';

import React, { useState, useEffect } from 'react';
import { fetchQuestionsByCategory, fetchAllCategories, Category, Question } from '@/lib/datocms';
import { QuestionModal } from './QuestionModal';

interface QuestionManagerProps {
  categorySlug: string;
}

// F: Umsjón með spurningum innan flokks
export function QuestionManager({ categorySlug }: QuestionManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');

  // F: Sækir flokka og tengir réttan flokk
  useEffect(() => {
    async function loadCategories() {
      try {
        const categoriesData = await fetchAllCategories();
        setCategories(categoriesData);
        const category = categoriesData.find((c: Category) => c.slug === categorySlug);
        if (category) {
          setCategoryId(category.id);
        }
      } catch (err) {
        setError('Gat ekki sótt flokka');
      }
    }
    loadCategories();
    if (categorySlug) {
      loadQuestions(categorySlug);
    }
  }, [categorySlug]);

  // F: Sækir spurningar fyrir flokk
  async function loadQuestions(slug: string) {
    setLoading(true);
    setError(null);
    try {
      const categoriesData = await fetchAllCategories();
      const category = categoriesData.find((c) => c.slug === slug);
      if (!category) throw new Error();
      const questionsData = await fetchQuestionsByCategory(category.id);
      const validQuestions = questionsData.filter((q: Question) =>
        q && q.text && Array.isArray(q.answers) && q.answers.length > 0
      );
      setQuestions(validQuestions);
      setError(null);
    } catch (error) {
      setError('Gat ekki sótt spurningar');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  // F: Byrjar nýja spurningu
  const createQuestion = () => {
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  // F: Setur spurningu í ritun
  const editQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  // F: Vistar nýja eða breytta spurningu
  const handleSaveQuestion = async (questionData: any) => {
    try {
      if (selectedQuestion) {
        await loadQuestions(categorySlug);
      } else {
        await loadQuestions(categorySlug);
      }
      setIsModalOpen(false);
      setSelectedQuestion(null);
    } catch (err) {
      throw err;
    }
  };

  // F: Eyðir spurningu (vantar útfærslu)
  const deleteQuestion = async (question: Question) => {
    if (!confirm('Ertu viss um að eyða spurningunni?')) return;
    setLoading(true);
    setError(null);
    try {
      setQuestions(prev => prev.filter(q => q.id !== question.id));
    } catch (err) {
      setError('Gat ekki eytt spurningu');
      await loadQuestions(categorySlug);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Spurningar</h2>
        <button 
          onClick={createQuestion}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Bæta við spurningu
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ) : questions.length === 0 ? (
          <p>Engar spurningar í þessum flokki enn.</p>
        ) : (
          questions.map(question => (
            <div key={question.id} className="bg-white text-black p-4 rounded shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{question.text}</h3>
                <button 
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                  onClick={() => editQuestion(question)}
                >
                  Breyta
                </button>
              </div>
              <ul className="list-disc pl-6 mt-2">
                {question.answers.map(answer => (
                  <li key={answer.id} className={answer.iscorrect ? 'text-green-600 font-medium' : ''}>
                    {answer.text} {answer.iscorrect ? '(rétt)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      
      {isModalOpen && (
        <QuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveQuestion}
          question={selectedQuestion}
          categoryId={categoryId}
        />
      )}
    </div>
  );
}
