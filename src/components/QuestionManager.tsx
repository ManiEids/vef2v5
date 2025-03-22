'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/simpleApi';
import { Category, Question } from '@/services/api-types';
import { QuestionModal } from './QuestionModal';

export function QuestionManager({ categorySlug }: { categorySlug: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number>(0);

  useEffect(() => {
    async function loadCategories() {
      try {
        console.log('Loading categories...');
        const categoriesData = await api.categories.getAll();
        setCategories(categoriesData);
        const category = categoriesData.find((c: Category) => c.slug === categorySlug);
        if (category) {
          console.log(`Found category with ID ${category.id} for slug ${categorySlug}`);
          setCategoryId(category.id);
        } else {
          console.error(`No category found with slug ${categorySlug}`);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      }
    }
    loadCategories();
    if (categorySlug) {
      loadQuestions(categorySlug);
    }
  }, [categorySlug]);

  async function loadQuestions(slug: string) {
    setLoading(true);
    setError(null);
    try {
      console.log(`📋 Loading questions for category: ${slug}`);
      
      //random value
      const timestamp = Date.now() + Math.random().toString(36).substring(2, 10);
      
      try {
        // frá bakenda
        const questionsData = await api.questions.getByCategory(slug);
        console.log(`✅ Successfully loaded ${questionsData.length} questions (unfiltered)`);
        
        // filtera 
        const validQuestions = questionsData.filter((q: Question) => 
          q && q.question && Array.isArray(q.answers) && q.answers.length > 0
        );
        
        console.log(`✅ After filtering: ${validQuestions.length} valid questions`);
        setQuestions(validQuestions);
        setError(null);
      } catch (error) {
        console.error(`❌ Error fetching questions:`, error);
        setError('Failed to load questions');
        setQuestions([]);
      }
    } catch (error) {
      console.error(`❌ Error in loadQuestions:`, error);
      setError('An error occurred while loading questions');
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  const createQuestion = () => {
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  const editQuestion = (question: Question) => {
    console.log('Editing question:', question);
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (questionData: any) => {
    try {
      if (selectedQuestion) {
        console.log(`📝 Updating question ID ${selectedQuestion.id}`, questionData); // Uppfæri
        
        const updatedQuestion = await api.questions.update(
          selectedQuestion.id,
          questionData.question,
          questionData.categoryId,
          questionData.answers.map((a: any) => ({
            text: a.text,
            correct: a.correct
          }))
        );
        
        console.log('Question updated successfully:', updatedQuestion);
        
        // Reload 
        await loadQuestions(categorySlug);
      } else {
        console.log('Creating new question:', questionData);
        
        const newQuestion = await api.questions.create(
          questionData.categoryId,
          questionData.question,
          questionData.answers.map((a: any) => ({
            text: a.text,
            correct: a.correct
          }))
        );
        
        console.log('Question created successfully:', newQuestion);
        await loadQuestions(categorySlug);
      }

      setIsModalOpen(false);
      setSelectedQuestion(null);
    } catch (err) {
      console.error('Error saving question:', err);
      throw err;
    }
  };

  const deleteQuestion = async (question: Question) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Attempting to delete question ID: ${question.id}`);
      
      // uppfræa ui 
      setQuestions(prev => prev.filter(q => q.id !== question.id));
      
      // delete og sjá svar
      const result = await api.questions.delete(question.id);
      console.log(`🗑️ Delete response:`, result);
      
      if (result && result.success) {
        console.log(`✅ Successfully deleted question ID: ${question.id}`);
      } else {
        throw new Error('Deletion may not have succeeded - refreshing data');
      }
    } catch (err) {
      console.error(`❌ Delete error for question ID: ${question.id}:`, err);
      setError('Failed to delete question - please try again');
      
      // refresh skoða server
      await loadQuestions(categorySlug);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Questions</h2>
        <button 
          onClick={createQuestion}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add New Question
        </button>
      </div>

      {/* villa */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Question list */}
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        ) : questions.length === 0 ? (
          <p>No questions in this category yet.</p>
        ) : (
          questions.map(question => (
            <div key={question.id} className="bg-white text-black p-4 rounded shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{question.question}</h3>
                <button 
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                  onClick={() => editQuestion(question)}
                >
                  Edit
                </button>
              </div>
              <ul className="list-disc pl-6 mt-2">
                {question.answers.map(answer => (
                  <li key={answer.id} className={answer.correct ? 'text-green-600 font-medium' : ''}>
                    {answer.answer} {answer.correct ? '(correct)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      
      {/* modal fyrir spurningar */}
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