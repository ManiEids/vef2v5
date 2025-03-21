import React from 'react';
import Link from 'next/link';
import { Category } from '@/services/api-types';

interface CategoryListProps {
  categories: Category[];
}

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return <p>No categories found.</p>;
  }

  return (
    <ul className="space-y-4">
      {categories.map((category) => (
        <li 
          key={category.id} 
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <Link 
            href={`/categories/${category.slug}`}
            className="text-lg font-semibold text-blue-600 hover:text-blue-800"
          >
            {category.title} {/* Use title instead of name to match backend */}
          </Link>
        </li>
      ))}
    </ul>
  );
}
