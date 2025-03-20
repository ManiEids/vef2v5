import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <nav className="flex justify-between">
            <Link href="/" className="text-xl font-bold">Quiz App</Link>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/admin" className="hover:underline">Admin</Link>
            </div>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p>Vefforritun 2, 2025 - Verkefni 4</p>
        </div>
      </footer>
    </div>
  );
}
