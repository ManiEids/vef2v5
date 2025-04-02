import './styles/main.scss';
import type { Metadata } from 'next';
import { StarsBackground } from '@/components/StarsBackground';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Verkefni 5 - Vefforritun 2 - Headless CMS Quiz',
  description: 'Quiz application using Next.js and DatoCMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="is">
      <body className="space-container">
        <StarsBackground />
        <main className="container">
          <header className="mb-8">
            <nav className="flex flex-wrap items-center justify-between">
              <div className="space-card p-4 rounded-lg mb-4 w-full md:w-auto">
                <Link href="/" className="text-2xl font-bold text-glow">
                  Verkefni 5 - Vefforritun 2
                </Link>
              </div>
              <div className="nav-buttons w-full md:w-auto mt-4 md:mt-0">
                <ul className="flex justify-center space-x-4">
                  <li>
                    <Link href="/" className="space-button">Forsíða</Link>
                  </li>
                  <li>
                    <Link href="/categories" className="space-button">Flokkar</Link>
                  </li>
                  <li>
                    <Link href="/test-locations" className="space-button">Staðsetningar</Link>
                  </li>
                </ul>
              </div>
            </nav>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
