// Þessi skrá er að falla út — nota beint úr lib/datocms.ts í staðinn

import { Category, Question, fetchAllCategories, fetchCategoryBySlug, fetchQuestionsByCategory } from '@/lib/datocms';
export const getServerCategories = fetchAllCategories;
export const getServerCategory = fetchCategoryBySlug;
export const getServerQuestionsByCategory = fetchQuestionsByCategory;
