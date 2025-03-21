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
      
      // Enhanced cache busting with more random value
      const timestamp = Date.now() + Math.random().toString(36).substring(2, 10);
      
      try {
        // Use the API's method to get questions by category
        const questionsData = await api.questions.getByCategory(slug);
        console.log(`✅ Successfully loaded ${questionsData.length} questions (unfiltered)`);
        
        // Filter out invalid questions
        const validQuestions = questionsData.filter((q: Question) => {
          // Must have at least 2 answers
          if (!q.answers || q.answers.length < 2) {
            console.log(`⚠️ Filtered out question ID ${q.id}: insufficient answers`);
            return false;
          }
          
          // Must have at least one correct answer
          if (!q.answers.some(a => a.correct)) {
            console.log(`⚠️ Filtered out question ID ${q.id}: no correct answers`);
            return false;
          }
          
          return true;
        });
        
        console.log(`✅ Displaying ${validQuestions.length} valid questions (filtered out ${questionsData.length - validQuestions.length} invalid ones)`);
        setQuestions(validQuestions);
        return;
      } catch (e) {
        console.log('Falling back to direct API call');
      }
      
      // If the above fails, try direct fetch as fallback
      const apiUrl = `/api/questions/category/${slug}?t=${timestamp}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching questions: ${response.status}`);
      }
      
      const questionsData = await response.json();
      console.log(`✅ Successfully loaded ${questionsData.length} questions (with timestamp: ${timestamp})`);
      setQuestions(questionsData);
    } catch (err) {
      console.error(`❌ Failed to load questions for ${slug}:`, err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }

  // Open modal for new question
  const createQuestion = () => {
    setSelectedQuestion(null);
    setIsModalOpen(true);
  };

  // Open modal with existing question data
  const editQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const saveQuestion = async (formData: any) => {
    try {
      if (selectedQuestion) {
        console.log(`✏️ Updating question ID: ${selectedQuestion.id}`);
        
        // Simplify answers format
        const formattedAnswers = formData.answers.map((a: any) => ({
          answer: a.text,
          correct: a.correct
          // No IDs included
        }));
        
        // Make the API call
        const updatedQuestion = await api.questions.update(
          selectedQuestion.id,
          formData.question,
          formData.categoryId,
          formattedAnswers
        );
        
        console.log(`✅ Question updated successfully:`, updatedQuestion);
        
        // Force full reload with clean parameters to avoid caching
        const timestamp = Date.now();
        setLoading(true);
        
        // Small delay to ensure backend processing completes
        setTimeout(async () => {
          try {
            // Direct fetch to ensure fresh data
            const response = await fetch(`/api/proxy?path=/questions/category/${categorySlug}&t=${timestamp}`, {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
              }
            });
            
            if (!response.ok) {
              throw new Error(`Failed to refresh data: ${response.status}`);
            }
            
            const refreshedData = await response.json();
            console.log(`♻️ Refreshed question data:`, refreshedData);
            setQuestions(refreshedData);
          } catch (refreshErr) {
            console.error('Error refreshing questions:', refreshErr);
            // Fall back to normal reload
            await loadQuestions(categorySlug);
          } finally {
            setLoading(false);
          }
        }, 800);
      } else {
        // Create new question - this works fine because POST /question handles answers
        console.log(`➕ Creating new question:`, formData);
        
        const formattedAnswers = formData.answers.map((a: any) => ({
          answer: a.text,
          correct: a.correct
        }));
        
        console.log('Formatted answers for create:', formattedAnswers);
        
        const newQuestion = await api.questions.create(
          formData.categoryId,
          formData.question,
          formattedAnswers
        );
        
        console.log(`✅ Question created successfully:`, newQuestion);
        
        // Refresh questions list
        await loadQuestions(categorySlug);
      }
    } catch (err) {
      console.error(`❌ Failed to save question:`, err);
      throw err;
    }
  };

  const deleteQuestion = async (question: Question) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Attempting to delete question ID: ${question.id}`);
      
      // First update the UI for immediate feedback
      setQuestions(prev => prev.filter(q => q.id !== question.id));
      
      // Make the delete API call and wait for it to complete
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
      
      // Refresh questions from server to get current state
      await loadQuestions(categorySlug);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading questions...</div>;
  }

  return (
    <div className="space-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Questions in this category</h2>
        <button 
          onClick={createQuestion}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add New Question
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Warning about filtered questions */}
      {questions.length > 0 && (
        <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4 text-sm">
          <strong>Note:</strong> Only showing valid questions with at least 2 answers (including 1 correct answer).
        </div>
      )}
      
      {/* Question list */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <p>No questions yet.</p>
        ) : (
          questions.map(q => (
            <div key={q.id} className="bg-white text-black p-4 rounded shadow-md">
              <p className="font-semibold">{q.question}</p>
              <ul className="mt-2 pl-5 list-disc">
                {q.answers.map(a => (
                  <li key={a.id} className={a.correct ? 'text-green-700 font-bold' : ''}>
                    {a.answer} {a.correct && '(Correct)'}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex space-x-2">
                <button 
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                  onClick={() => editQuestion(q)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600"
                  onClick={() => deleteQuestion(q)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for creating/editing questions */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveQuestion}
        question={selectedQuestion}
        categoryId={categoryId}
      />
    </div>
  );
}