import React from 'react';
import Link from 'next/link';
import { Category } from '@/services/api-types';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return <p>No categories found.</p>; // Engir flokkar
  }

  return (
    <ul className="space-y-4">
      {categories.map((category) => (
        <li 
          key={category.id} 
          className="space-card rounded-lg p-4 hover:shadow-md hover:shadow-blue-500/30 transition-shadow"
        >
          <Link 
            href={`/categories/${category.slug}`}
            className="text-lg font-semibold text-blue-300 hover:text-blue-100 flex items-center"
          >
            <span className="mr-2 text-xl">🪐</span>
            {category.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
