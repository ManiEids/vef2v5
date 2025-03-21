'use client';

import React from 'react';
import { Layout } from '@/components/Layout';
import { CategoryManager } from '@/components/CategoryManager';

export default function CategoryManagementPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-glow">Category Manager</h1>
      <CategoryManager />
    </Layout>
  );
}
