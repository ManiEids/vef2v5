import React, { useState } from 'react';

interface CategoryFormProps {
  onSubmit: (title: string) => Promise<void>;
  initialTitle?: string;
}

export function CategoryForm({ onSubmit, initialTitle = '' }: CategoryFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onSubmit(title);
      setTitle('');
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
        <label htmlFor="title" className="block mb-1 font-medium">
          Category Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter category title"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading || !title.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving...' : initialTitle ? 'Update Category' : 'Create Category'}
      </button>
    </form>
  );
}
