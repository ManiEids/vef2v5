// This file is being phased out as we transition to DatoCMS.
// Import directly from lib/datocms.ts instead.

import { Category, Question, fetchAllCategories, fetchCategoryBySlug, fetchQuestionsByCategory } from '@/lib/datocms';

// Re-export the functions with more specific names if needed
export const getServerCategories = fetchAllCategories;
export const getServerCategory = fetchCategoryBySlug;
export const getServerQuestionsByCategory = fetchQuestionsByCategory;
