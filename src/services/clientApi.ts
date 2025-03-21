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
  console.log("Fetching categories from", process.env.NEXT_PUBLIC_API_BASE_URL);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, { cache: "no-store" });
    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error fetching categories. Status:", response.status, "Body:", errorBody);
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    const data = await response.json();
    console.log("Categories data received:", data);
    return data.data ? data.data : data;
  } catch (error) {
    console.error("Exception in getCategories:", error);
    throw error; // rethrow so the UI can catch it as well
  }
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
  console.log(`Fetching questions for category: ${slug} from ${process.env.NEXT_PUBLIC_API_BASE_URL}`);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/questions/category/${slug}`);
    console.log("Response status (questions):", response.status);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Error fetching questions. Status:", response.status, "Body:", errorBody);
      throw new Error(`Failed to fetch questions: ${response.status}`);
    }
    const result = await response.json();
    console.log("Questions data received:", result);
    const questionsData = result.data ? result.data : result;
    return Array.isArray(questionsData) 
      ? questionsData.map(normalizeQuestion) 
      : [];
  } catch (error) {
    console.error("Exception in getQuestionsByCategory:", error);
    throw error;
  }
}

// Update other client-side API functions using the same pattern
// ...
