'use client';

import { Category, Question, Answer } from './api-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
console.log('clientApi: API_BASE_URL =', API_BASE_URL);  // Added log

// Helper to normalize category data for frontend consumption
const normalizeCategory = (category: any): Category => ({
  id: category.id,
  title: category.title || '', // Backend uses title
  slug: category.slug
});

// Helper to normalize question data for frontend consumption
const normalizeQuestion = (question: any): Question => ({
  id: question.id,
  question: question.question || '', // Backend uses question
  categoryId: question.categoryId,
  category: question.category ? normalizeCategory(question.category) : undefined,
  answers: Array.isArray(question.answers) 
    ? question.answers.map(normalizeAnswer)
    : []
});

// Helper to normalize answer data
const normalizeAnswer = (answer: any): Answer => ({
  id: answer.id,
  answer: answer.answer || '', // Backend uses answer
  correct: answer.correct || false,
  questionId: answer.questionId
});

export async function getCategories(): Promise<Category[]> {
  console.log("Fetching categories from", API_BASE_URL); // Added logging
  const response = await fetch(`${API_BASE_URL}/categories`, { cache: "no-store" }); // updated
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  return await response.json();
}

export async function getCategory(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.status}`);
  }
  
  const result = await response.json();
  return normalizeCategory(result);
}

export async function getQuestionsByCategory(slug: string): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/questions/category/${slug}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.status}`);
  }
  
  const result = await response.json();
  const questionsData = result.data ? result.data : result;
  
  return Array.isArray(questionsData) 
    ? questionsData.map(normalizeQuestion) 
    : [];
}

// Update other client-side API functions using the same pattern
// ...
