import React, { useState, useEffect } from 'react';
import { Category } from '@/services/api-types';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: { title: string }) => Promise<void>;
  category?: Category | null;
}

export function CategoryModal({ isOpen, onClose, onSave, category }: CategoryModalProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      setTitle(category.title);
    } else {
      setTitle('');
    }
  }, [category, isOpen]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const validateForm = () => {
    if (!title.trim()) {
      setError('Category title cannot be empty'); // Titill má ekki vera tómur
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await onSave({ title });
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'; // Óþekkt villa
      setError(`Failed to save category: ${errorMessage}`); // Vista mistókst
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {category ? 'Edit Category' : 'Add New Category'} // Breyta/Bæta við
          </h2>
          
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Category Title:</label> // Flokks titill
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={title} 
                onChange={handleTitleChange} 
                required 
              />
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : category ? 'Update' : 'Create'} // Vista.../Uppfæra/Búa til
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
