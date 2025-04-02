"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error occurred:', error);
  }, [error]);

  const goHome = () => {
    router.push('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="space-card">
      <h2 className="text-glow mb-4">Villa kom upp</h2>
      <p className="mb-6">Því miður kom upp villa við að birta síðuna.</p>
      <div className="flex space-x-4">
        <button
          onClick={reset}
          className="space-button"
        >
          Reyna aftur
        </button>
        <button onClick={goHome} className="space-button">
          Fara á forsíðu
        </button>
      </div>
    </div>
  );
}
