// Client-side föll til að sækja gögn frá DatoCMS

import { 
    fetchAllCategories, 
    fetchCategoryBySlug, 
    fetchQuestionsByCategory,
    fetchAllTestLocations,
    fetchTestLocationById,
    fetchAllScreenshots
  } from '@/lib/datocms';
  
  // Einfaldari nöfn fyrir útflutning
  export const getCategories = fetchAllCategories;
  export const getCategory = fetchCategoryBySlug;
  export const getQuestionsByCategory = fetchQuestionsByCategory;
  export const getTestLocations = fetchAllTestLocations;
  export const getTestLocationById = fetchTestLocationById;
  export const getScreenshots = fetchAllScreenshots;
  