import { Layout } from '@/components/Layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout>
      <div className="text-center py-10">
        <h1 className="text-4xl font-bold mb-4">404 - Síða fannst ekki</h1>
        <p className="text-xl mb-6">Því miður fannst síðan sem þú leitaðir að ekki.</p>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Til baka á forsíðu
        </Link>
      </div>
    </Layout>
  );
}
