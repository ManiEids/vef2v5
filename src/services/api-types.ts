/**
 * Type definitions for API responses
 */

export interface Category {
  id: string | number;
  name: string;
  title: string; // Add title property that's being used in CategoryList.tsx
  slug?: string;
  description?: string;
  // Add any other properties that might be used in CategoryList component
}

// Add other API types as needed
