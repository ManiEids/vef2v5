// Flytja inn týpur frá absolute path með því að nota tsconfig paths stillingarnar þínar
import { Category, Question } from '@/services/api-types';

// Aðeins fyrir server component
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Hjálparföll fyrir data normalization (sama og clientApi.ts)
const normalizeCategory = (category: any): Category => ({
  id: category.id,
  title: category.title || '',
  slug: category.slug
});

const normalizeQuestion = (question: any): Question => ({
  id: question.id,
  question: question.question || '',
  categoryId: question.categoryId,
  category: question.category ? normalizeCategory(question.category) : undefined,
  answers: Array.isArray(question.answers) 
    ? question.answers.map((a: any) => ({
        id: a.id,
        answer: a.answer || '',
        correct: a.correct || false,
        questionId: a.questionId
      }))
    : []
});

export async function getServerCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, { 
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    // Ef svar er ekki OK, kasta villu
    throw new Error(`Villa við að sækja flokka: ${response.status}`);
  }
  
  const result = await response.json();
  const categoriesData = result.data ? result.data : result;
  
  return Array.isArray(categoriesData) 
    ? categoriesData.map(normalizeCategory) 
    : [];
}

export async function getServerCategory(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    // Ef svar er ekki OK, kasta villu
    throw new Error(`Villa við að sækja flokk: ${response.status}`);
  }
  
  const result = await response.json();
  return normalizeCategory(result);
}

export async function getServerQuestionsByCategory(slug: string): Promise<Question[]> {
  const response = await fetch(`${API_BASE_URL}/questions/category/${slug}`, {
    next: { revalidate: 60 }
  });
  
  if (!response.ok) {
    // Ef svar er ekki OK, kasta villu
    throw new Error(`Villa við að sækja spurningar: ${response.status}`);
  }
  
  const result = await response.json();
  const questionsData = result.data ? result.data : result;
  
  return Array.isArray(questionsData) 
    ? questionsData.map(normalizeQuestion) 
    : [];
}
