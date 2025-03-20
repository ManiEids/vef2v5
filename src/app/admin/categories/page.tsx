'use client';

import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { CategoryForm } from '@/components/forms/CategoryForm';
import { Category, getCategories, createCategory, deleteCategory, updateCategory } from '@/services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError('Villa við að sækja flokka');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateCategory = async (title: string) => {
    try {
      const newCategory = await createCategory(title);
      setCategories([...categories, newCategory]);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleUpdateCategory = async (title: string) => {
    if (!editingCategory) return;
    
    try {
      const updatedCategory = await updateCategory(editingCategory.slug, title);
      setCategories(categories.map((c: Category) => 
        c.id === updatedCategory.id ? updatedCategory : c
      ));
      setEditingCategory(null);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const handleDeleteCategory = async (slug: string) => {
    if (!confirm('Ertu viss um að þú viljir eyða þessum flokki?')) {
      return;
    }
    
    try {
      await deleteCategory(slug);
      setCategories(categories.filter(c => c.slug !== slug));
    } catch (err) {
      alert('Villa kom upp við að eyða flokki');
      console.error(err);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Stjórna flokkum</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingCategory ? 'Breyta flokk' : 'Búa til nýjan flokk'}
        </h2>
        <CategoryForm 
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} 
          initialTitle={editingCategory?.title}
        />
        {editingCategory && (
          <button
            onClick={() => setEditingCategory(null)}
            className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Hætta við
          </button>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">Núverandi flokkar</h2>
        
        {loading ? (
          <p>Sæki flokka...</p>
        ) : error ? (
          <div className="bg-red-100 text-red-800 p-3 rounded">
            {error}
          </div>
        ) : (
          <ul className="space-y-2">
            {categories.map((category: Category) => (
              <li key={category.id} className="bg-white rounded shadow p-4 flex justify-between items-center">
                <span>{category.title}</span>
                <div className="space-x-2">
                  <button 
                    onClick={() => setEditingCategory(category)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Breyta
                  </button>
                  <button 
                    onClick={() => handleDeleteCategory(category.slug)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eyða
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}
