'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/simpleApi';
import { Category } from '@/services/api-types';
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
      console.log(`📋 Loading categories`); // Hleð
      const categoriesData = await api.categories.getAll();
      console.log(`✅ Successfully loaded ${categoriesData.length} categories`); // Tókst
      setCategories(categoriesData);
    } catch (err) {
      console.error(`❌ Failed to load categories:`, err); // Villa
      setError('Failed to load categories'); // Villa
    } finally {
      setLoading(false);
    }
  }

  // Open modal for new category
  const createCategory = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  // Open modal with existing category data
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
        console.log(`✏️ Updating category: ${selectedCategory.slug}`); // Uppfæri
        
        // Make the API call
        const updatedCategory = await api.categories.update(
          selectedCategory.slug,
          formData.title
        );
        
        console.log(`✅ Category updated successfully:`, updatedCategory); // Tókst
        
        // Refresh the category list
        await loadCategories();
      } else {
        // Create new category
        console.log(`➕ Creating new category:`, formData); // Bý til
        
        const newCategory = await api.categories.create(formData.title);
        
        console.log(`✅ Category created successfully:`, newCategory); // Tókst
        
        // Refresh categories list
        await loadCategories();
      }
    } catch (err) {
      console.error(`❌ Failed to save category:`, err); // Vista mistókst
      throw err;
    }
  };

  const deleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete the category "${category.title}" and all its questions?`)) return;
    
    setLoading(true);
    setError(null);
    try {
      console.log(`🗑️ Attempting to delete category: ${category.slug}`); // Eyði
      
      // First update the UI for immediate feedback
      setCategories(prev => prev.filter(c => c.id !== category.id));
      
      // Make the delete API call
      const result = await api.categories.delete(category.slug);
      console.log(`🗑️ Delete response:`, result);
      
      // Refresh categories to ensure we have the latest data
      await loadCategories();
    } catch (err) {
      console.error(`❌ Delete error for category: ${category.slug}:`, err); // Eyðing mistókst
      setError('Failed to delete category - please try again'); // Eyðing mistókst
      
      // Refresh categories to get current state
      await loadCategories();
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse p-4">Loading categories...</div>; // Hleð flokka
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

      {/* Error message */}
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Category list */}
      <div className="space-y-4">
        {categories.length === 0 ? (
          <p>No categories yet.</p> // Engir
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

      {/* Modal for creating/editing categories */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={saveCategory}
        category={selectedCategory}
      />
    </div>
  );
}
