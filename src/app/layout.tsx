import './globals.css';
import type { Metadata } from 'next';
import { BackendWaker } from '@/components/BackendWaker';

export const metadata: Metadata = {
  title: 'Vefforritun 2 - Verkefni 4',
  description: 'React framendi fyrir spurningakerfi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="is">
      <body>
        {children}
        <BackendWaker />
      </body>
    </html>
  );
}
