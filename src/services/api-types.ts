export interface Category {
  id: number;
  title: string;  // Backend uses 'title' not 'name'
  slug: string;
}

export interface Answer {
  id: number;
  answer: string;  // Backend uses 'answer' not 'text'
  correct: boolean;
  questionId?: number;
}

export interface Question {
  id: number;
  question: string;  // Backend uses 'question' not 'text'
  answers: Answer[];
  category?: Category;
  categoryId?: number;
}
