'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
          <p className="mb-4">Create, edit, and delete quiz categories.</p>
          <Link 
            href="/admin/categories" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manage Categories
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Manage Questions</h2>
          <p className="mb-4">Create and edit quiz questions.</p>
          <Link 
            href="/admin/questions" 
            className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Manage Questions
          </Link>
        </div>
      </div>
    </Layout>
  );
}
