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
