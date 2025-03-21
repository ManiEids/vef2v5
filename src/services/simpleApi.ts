/**
 * Simple API helper that abstracts away complexities of data transformation
 */

// Use our proxy API instead of directly hitting the backend
const useProxy = process.env.NODE_ENV === 'production'; // Use proxy in production to avoid CORS issues
console.log('API mode:', useProxy ? 'Using proxy to avoid CORS' : 'Direct API access');

// Function to determine the right API URL based on environment
export function getApiUrl(endpoint: string): string {
  if (useProxy) {
    // In production, use our proxy API endpoint
    return `/api/proxy?path=${encodeURIComponent(endpoint)}`;
  } else {
    // In development, use the direct API URL
    const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vef2v3.onrender.com';
    return `${API_URL}${endpoint}`;
  }
}

// Unified fetch wrapper with error handling
async function apiFetch(endpoint: string, options?: RequestInit) {
  const url = getApiUrl(endpoint);
  console.log(`Fetching: ${url} (${useProxy ? 'via proxy' : 'direct'})`);
  
  try {
    const response = await fetch(url, options);
    
    // Handle 404 specially
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    console.log(`API response from ${endpoint}: status=${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`API error for ${endpoint}:`, error);
    
    // Enhanced error logging
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error - possible causes: CORS issues, network connectivity, or server down');
    }
    
    throw error;
  }
}

// CATEGORIES API
export const categoryApi = {
  // Get all categories
  getAll: () => apiFetch('/categories'),
  
  // Get single category by slug
  getBySlug: (slug: string) => apiFetch(`/categories/${slug}`),
  
  // Create new category
  create: (title: string) => apiFetch('/category', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  }),
  
  // Update existing category
  update: (slug: string, title: string) => apiFetch(`/category/${slug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  }),
  
  // Delete category
  delete: (slug: string) => apiFetch(`/category/${slug}`, {
    method: 'DELETE'
  })
};

// QUESTIONS API
export const questionApi = {
  // Get questions by category
  getByCategory: (slug: string) => apiFetch(`/questions/category/${slug}`),
  
  // Get single question
  getById: (id: string | number) => apiFetch(`/questions/${id}`),
  
  // Create question (automatically maps form fields to API fields)
  create: (categoryId: number, questionText: string, formAnswers: any[]) => {
    // Transform answers from form format to API format
    const answers = formAnswers.map(a => ({
      answer: a.text,      // Map form's 'text' to API's 'answer'
      correct: a.correct
    }));
    
    return apiFetch('/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        question: questionText, 
        categoryId,
        answers
      })
    });
  },
  
  // Update question (automatically maps form fields to API fields)
  update: (id: string | number, questionText: string, categoryId: number, formAnswers: any[]) => {
    // Transform answers from form format to API format
    const answers = formAnswers.map(a => ({
      id: a.id,             // Keep original ID if available
      answer: a.text,       // Map form's 'text' to API's 'answer'
      correct: a.correct
    }));
    
    return apiFetch(`/question/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: questionText,  // Map text to question
        categoryId,
        answers
      })
    });
  },
  
  // Delete question
  delete: (id: string | number) => apiFetch(`/question/${id}`, {
    method: 'DELETE'
  })
};

// Export a combined API object for simpler imports
export const api = {
  categories: categoryApi,
  questions: questionApi
};
