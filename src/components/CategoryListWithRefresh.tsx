'use client';

import React, { useState, useEffect } from 'react';
import { CategoryList } from './CategoryList';
import { ErrorMessage } from '@/components/ErrorMessage'; // Fix import path
import { getCategories } from '@/services/clientApi';
import { Category } from '@/lib/datocms';

export function CategoryListWithRefresh() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching categories from clientApi'); 
      const data = await getCategories();
      console.log('Categories fetched:', data);
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. The clientApi service may be unavailable.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 h-16 rounded mb-4"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <ErrorMessage message={error} />
        <button 
          onClick={() => loadCategories()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div>
        <ErrorMessage message="No categories found. Please check your clientApi content." />
        <button 
          onClick={() => loadCategories()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
          Refresh Page
        </button>
      </div>
    );
  }

  return <CategoryList categories={categories} />;
}
