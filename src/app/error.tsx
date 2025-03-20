'use client';

import { useEffect } from 'react';
import { Layout } from '@/components/Layout';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logga villu í konsólinn
    console.error(error);
  }, [error]);

  return (
    <Layout>
      <div className="text-center py-10">
        <h1 className="text-3xl font-bold mb-4">Villa kom upp</h1>
        <p className="text-xl mb-6">Því miður kom upp villa við að birta síðuna.</p>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reyna aftur
        </button>
      </div>
    </Layout>
  );
}
