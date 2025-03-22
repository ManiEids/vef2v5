export interface Category {
  id: number;
  title: string;
  slug: string;
}

export interface Answer {
  id: number;
  answer: string; 
  correct: boolean;
  questionId?: number;
}

export interface Question {
  id: number;
  question: string; 
  categoryId: number;
  answers: Answer[];
  category?: Category;
}
