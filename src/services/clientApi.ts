'use client';

import { Category, Question, Answer } from './api-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  const result = await response.json();
  return result.data ? result.data : result;
}

export async function getCategory(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.status}`);
  }
  
  return response.json();
}

export async function getQuestionsByCategory(slug: string): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/questions/category/${slug}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.status}`);
  }
  
  const result = await response.json();
  return result.data ? result.data : result;
}

// Continue with other client-side API calls
export async function createCategory(name: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to create category: ${response.status}`);
  }
  
  return response.json();
}

// Add all your other API functions here with the same client-side approach
// ...
