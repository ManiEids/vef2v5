'use client';

import React, { useState, useEffect } from 'react';
import { fetchAllCategories, Category } from '@/lib/datocms';
import { CategoryModal } from './CategoryModal';

export function CategoryManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    setLoading(true);
    setError(null);
    try {
      console.log(`📋 Loading categories from DatoCMS`);
      const categoriesData = await fetchAllCategories();
      console.log(`✅ Successfully loaded ${categoriesData.length} categories`);
      setCategories(categoriesData);
    } catch (err) {
      console.error(`❌ Failed to load categories:`, err);
      setError('Failed to load categories from DatoCMS');
    } finally {
      setLoading(false);
    }
  }

  const createCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const editCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  const saveCategory = async (formData: { title: string }) => {
    try {
      if (selectedCategory) {
        console.log(`✏️ Would update category in DatoCMS: ${selectedCategory.slug} - ${formData.title}`);
        await loadCategories();
      } else {
        console.log(`➕ Would create new category in DatoCMS: ${formData.title}`);
        await loadCategories();
      }
    } catch (err) {
      console.error(`❌ Failed to save category:`, err);
      throw err;
    }
  };

  const deleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete the category "${category.title}"?`)) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Would delete category from DatoCMS: ${category.slug}`);
      setCategories(prev => prev.filter(c => c.id !== category.id));
      await loadCategories();
    } catch (err) {
      console.error(`❌ Delete error for category: ${category.slug}:`, err);
      setError('Failed to delete category - please try again');
      await loadCategories();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading categories...</div>;
  }

  return (
    <div className="space-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories</h2>
        <button 
          onClick={createCategory}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Add New Category
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {categories.length === 0 ? (
          <p>No categories yet.</p> 
        ) : (
          categories.map(category => (
            <div key={category.id} className="bg-white text-black p-4 rounded shadow-md flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{category.title}</h3>
                <p className="text-sm text-gray-600">Slug: {category.slug}</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                  onClick={() => editCategory(category)}
                >
                  Edit
                </button>
                <button 
                  className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600"
                  onClick={() => deleteCategory(category)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveCategory}
        category={selectedCategory}
      />
    </div>
  );
}
