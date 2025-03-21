const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// Types that match your backend structure
export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Answer {
  id: number;
  text: string;
  correct: boolean;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  category?: Category;
  categoryId?: number;
}

// API functions
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  
  const result = await response.json();
  // Handle paginated response from your backend
  return result.data ? result.data : result;
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
  // Updated to match your actual endpoint structure from README
  const response = await fetch(`${API_BASE_URL}/questions/category/${slug}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.status}`);
  }
  
  const result = await response.json();
  return result.data ? result.data : result;
}

export async function createCategory(name: string): Promise<Category> {
  // Updated to match your actual endpoint from README
  const response = await fetch(`${API_BASE_URL}/category`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to create category: ${response.status}`);
  }
  
  return response.json();
}

export async function createQuestion(
  categoryId: number, 
  text: string, 
  answers: Omit<Answer, 'id'>[]
): Promise<Question> {
  // Updated to match your actual endpoint from README
  const response = await fetch(`${API_BASE_URL}/question`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      text, 
      categoryId,
      answers 
    }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to create question: ${response.status}`);
  }
  
  return response.json();
}

export async function deleteCategory(slug: string): Promise<void> {
  // Updated to match your actual endpoint from README
  const response = await fetch(`${API_BASE_URL}/category/${slug}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to delete category: ${response.status}`);
  }
}

export async function updateCategory(slug: string, name: string): Promise<Category> {
  // Updated to match your actual endpoint from README
  const response = await fetch(`${API_BASE_URL}/category/${slug}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
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
  id: string | number,
  text: string,
  categoryId: number,
  answers: Array<Omit<Answer, 'id'> & { id?: number }>
): Promise<Question> {
  // Updated to match your actual endpoint from README
  const response = await fetch(`${API_BASE_URL}/question/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      text, 
      categoryId,
      answers 
    }),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `Failed to update question: ${response.status}`);
  }
  
  return response.json();
}
