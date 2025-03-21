'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { QuestionManager } from '@/components/QuestionManager';
import { api } from '@/services/simpleApi';
import { Category } from '@/services/api-types';
import Link from 'next/link';

export default function QuestionManagerPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      try {
        const categoriesData = await api.categories.getAll();
        setCategories(categoriesData);
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].slug);
        }
      } catch (err) {
        setError('Failed to load categories. The backend server might be starting up.'); // Villa
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-glow">Question Manager</h1>
      
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-6">
          {error}
          <button 
            className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="animate-pulse p-4">Loading categories...</div> // Hleð
      ) : (
        <>
          <div className="mb-6">
            <label htmlFor="categorySelect" className="block mb-2 text-lg font-medium">
              Select a category:
            </label>
            <select
              id="categorySelect"
              className="w-full md:w-1/2 p-2 border rounded"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.title}
                </option>
              ))}
            </select>
          </div>
          
          {selectedCategory && <QuestionManager categorySlug={selectedCategory} />}
          
          <div className="mt-8 text-center">
            <Link href="/" className="inline-block space-button px-6 py-2 rounded text-white">
              Back to Home
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
}
