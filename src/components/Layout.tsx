import React from 'react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <nav className="flex flex-wrap items-center justify-between">
          <div className="space-card p-4 rounded-lg mb-4 w-full md:w-auto">
            <Link href="/" className="text-2xl font-bold text-glow text-blue-300">
              verkefni 4 - vefforritun 2 - mani - quiz
            </Link>
          </div>
          
          <ul className="flex flex-wrap space-x-2 space-y-2 md:space-y-0">
            <li>
              <Link href="/admin/categories" className="space-button px-4 py-2 rounded text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/admin/questions" className="space-button px-4 py-2 rounded text-white">
                Questions
              </Link>
            </li>
          </ul>
        </nav>
      </header>
      
      <main className="space-card rounded-lg p-6">
        {children}
      </main>
    </div>
  );
}
