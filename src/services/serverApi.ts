// For server components only
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { Category, Question } from './api-types';

export async function getServerCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, { 
    next: { revalidate: 60 } // Cache for 60 seconds instead of no-store
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  const result = await response.json();
  return result.data ? result.data : result;
}

export async function getServerCategory(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.status}`);
  }
  
  return response.json();
}

export async function getServerQuestionsByCategory(slug: string): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/questions/category/${slug}`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.status}`);
  }
  
  const result = await response.json();
  return result.data ? result.data : result;
}
