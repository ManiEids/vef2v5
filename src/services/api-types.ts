export interface Category {
  id: number;
  title: string;
  slug: string;
}

export interface Answer {
  id: number;
  answer: string; // This is how the backend refers to the answer text
  correct: boolean;
  questionId?: number;
}

export interface Question {
  id: number;
  question: string; // This is how the backend refers to the question text
  categoryId: number;
  answers: Answer[];
  category?: Category;
}
