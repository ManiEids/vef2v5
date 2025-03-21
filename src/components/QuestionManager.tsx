'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/simpleApi';
import { Category, Question } from '@/services/api-types';

export function QuestionManager({ categorySlug }: { categorySlug: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    categoryId: 0,
    answers: [
      { text: '', correct: true },
      { text: '', correct: false },
      { text: '', correct: false },
      { text: '', correct: false }
    ]
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        console.log('Loading categories...');
        const categoriesData = await api.categories.getAll();
        setCategories(categoriesData);
        const category = categoriesData.find((c: Category) => c.slug === categorySlug);
        if (category) {
          console.log(`Found category with ID ${category.id} for slug ${categorySlug}`);
          setFormData(prev => ({ ...prev, categoryId: category.id }));
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
      const questionsData = await api.questions.getByCategory(slug);
      console.log(`✅ Successfully loaded ${questionsData.length} questions`);
      setQuestions(questionsData);
    } catch (err) {
      console.error(`❌ Failed to load questions for ${slug}:`, err);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({
      question: '',
      categoryId: categories.find((c: Category) => c.slug === categorySlug)?.id || 0,
      answers: [
        { text: '', correct: true },
        { text: '', correct: false },
        { text: '', correct: false },
        { text: '', correct: false }
      ]
    });
    setSelectedQuestion(null);
    setIsEditing(false);
  };

  const editQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setIsEditing(true);
    setFormData({
      question: question.question,
      categoryId: question.categoryId || 0,
      answers: question.answers.map(a => ({
        id: a.id,
        text: a.answer,
        correct: a.correct
      }))
    });
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, question: e.target.value });
  };

  const handleAnswerChange = (index: number, field: 'text' | 'correct', value: string | boolean) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    if (field === 'correct' && value === true) {
      updatedAnswers.forEach((_, i) => {
        if (i !== index) {
          updatedAnswers[i].correct = false;
        }
      });
    }
    setFormData({ ...formData, answers: updatedAnswers });
  };

  const deleteQuestion = async (question: Question) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      console.log(`🗑️ Attempting to delete question ID: ${question.id}`);
      await api.questions.delete(question.id);
      console.log(`✅ Successfully deleted question ID: ${question.id}`);
      setQuestions(questions.filter(q => q.id !== question.id));
    } catch (err) {
      console.error(`❌ Failed to delete question ID: ${question.id}:`, err);
      setError('Failed to delete question');
    }
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      setError('Question text cannot be empty');
      return false;
    }
    if (formData.answers.some(a => !a.text.trim())) {
      setError('All options must have text');
      return false;
    }
    if (!formData.answers.some(a => a.correct)) {
      setError('At least one answer must be marked as correct');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
    try {
      if (isEditing && selectedQuestion) {
        console.log(`✏️ Updating question ID: ${selectedQuestion.id}`, formData);
        const updatedQuestion = await api.questions.update(
          selectedQuestion.id,
          formData.question,
          formData.categoryId,
          formData.answers
        );
        console.log(`✅ Question updated successfully:`, updatedQuestion);
        setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q));
      } else {
        console.log(`➕ Creating new question:`, formData);
        console.log(`Using category ID:`, formData.categoryId);
        const newQuestion = await api.questions.create(
          formData.categoryId,
          formData.question,
          formData.answers
        );
        console.log(`✅ Question created successfully:`, newQuestion);
        setQuestions([...questions, newQuestion]);
      }
      resetForm();
    } catch (err) {
      console.error(`❌ Failed to save question:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to save question: ${errorMessage}`);
    }
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading questions...</div>;
  }

  return (
    <div className="space-card p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isEditing ? 'Edit Question' : 'Add New Question'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-1">Question:</label>
          <input 
            type="text" 
            className="w-full p-2 border rounded" 
            value={formData.question} 
            onChange={handleQuestionChange} 
            required 
          />
        </div>
        
        <div className="space-y-3">
          <label className="block mb-1">Answers:</label>
          {formData.answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={answer.correct} 
                onChange={(e) => handleAnswerChange(index, 'correct', e.target.checked)} 
              />
              <input 
                type="text" 
                className="flex-1 p-2 border rounded" 
                value={answer.text} 
                onChange={(e) => handleAnswerChange(index, 'text', e.target.value)} 
                placeholder={`Answer ${index + 1}`} 
                required 
              />
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <button 
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Update' : 'Create'} Question
          </button>
          {isEditing && (
            <button 
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="space-y-4">
        <h3 className="text-xl font-bold">Questions in this category</h3>
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
                  onClick={() => editQuestion(q)}
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => deleteQuestion(q)}
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}