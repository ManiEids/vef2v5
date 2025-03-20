const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Types
export interface Category {
  id: string;
  title: string;
  slug: string;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  answers: Answer[];
}

// API functions
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  return response.json();
}

export async function getCategory(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`);
  
  if (response.status === 404) {
    throw new Error('Category not found');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.status}`);
  }
  
  return response.json();
}

export async function getQuestionsByCategory(slug: string): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}/questions`);
  
  if (response.status === 404) {
    throw new Error('Category not found');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.status}`);
  }
  
  return response.json();
}

export async function createCategory(title: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to create category: ${response.status}`);
  }
  
  return response.json();
}

export async function createQuestion(
  categorySlug: string, 
  text: string, 
  answers: Omit<Answer, 'id'>[]
): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/categories/${categorySlug}/questions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, answers }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to create question: ${response.status}`);
  }
  
  return response.json();
}

export async function deleteCategory(slug: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to delete category: ${response.status}`);
  }
}

export async function updateCategory(slug: string, title: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to update category: ${response.status}`);
  }
  
  return response.json();
}

export async function getQuestion(id: string): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/questions/${id}`);
  
  if (response.status === 404) {
    throw new Error('Question not found');
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch question: ${response.status}`);
  }
  
  return response.json();
}

export async function updateQuestion(
  id: string,
  text: string,
  answers: Array<Omit<Answer, 'id'> & { id?: string }>
): Promise<Question> {
  const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, answers }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to update question: ${response.status}`);
  }
  
  return response.json();
}
