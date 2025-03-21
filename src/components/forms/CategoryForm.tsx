"use client";

import React, { useState } from 'react';

interface CategoryFormProps {
  onSubmit: (name: string) => Promise<void>; // Changed from title to name
  initialName?: string; // Changed from initialTitle
}

export function CategoryForm({ onSubmit, initialName = '' }: CategoryFormProps) {
  const [name, setName] = useState(initialName); // Changed from title
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(name); // Changed from title
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block mb-1 font-medium">
          Category Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter category name"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : initialName ? 'Update Category' : 'Create Category'}
      </button>
    </form>
  );
}
