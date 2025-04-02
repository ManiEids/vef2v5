// This file provides client-side API wrappers for DatoCMS

import { 
  fetchAllCategories, 
  fetchCategoryBySlug, 
  fetchQuestionsByCategory,
  fetchAllTestLocations,
  fetchTestLocationById,
  fetchAllScreenshots
} from '@/lib/datocms';

// Re-export with simpler names
export const getCategories = fetchAllCategories;
export const getCategory = fetchCategoryBySlug;
export const getQuestionsByCategory = fetchQuestionsByCategory;
export const getTestLocations = fetchAllTestLocations;
export const getTestLocationById = fetchTestLocationById;
export const getScreenshots = fetchAllScreenshots;
