// F: Skilgreining á API tegundum fyrir bakenda

export interface Category {
  id: string | number;
  title: string;
  slug: string;
  description?: string;
}

export interface Answer {
  id: string | number;
  answer?: string;  // API notað 'answer'
  text?: string;    // DatoCMS notar 'text'
  correct?: boolean; // API notar 'correct'
  iscorrect?: boolean; // DatoCMS notar 'iscorrect'
  questionId?: string | number;
}

export interface Question {
  id: string | number;
  question?: string;  // API notar 'question'
  text?: string;      // DatoCMS notar 'text'
  categoryId?: string | number;
  category?: Category;
  answers?: Answer[];
}
