/**
 * Simple API helper that abstracts away complexities of data transformation
 */

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://vef2v3.onrender.com';

// Unified fetch wrapper with error handling
async function apiFetch(endpoint: string, options?: RequestInit) {
  console.log(`Fetching ${API_URL}${endpoint}`);
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // Handle 404 specially
    if (response.status === 404) {
      throw new Error('Resource not found');
    }
    
    // Handle other errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API error for ${endpoint}:`, error);
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
        question: questionText, // Map text to question
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
