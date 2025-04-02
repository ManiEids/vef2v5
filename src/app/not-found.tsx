import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-card">
      <h2 className="text-glow mb-4">Síða fannst ekki</h2>
      <p className="mb-6">Því miður fannst síðan sem þú ert að leita að ekki.</p>
      <Link href="/" className="space-button">
        Fara á forsíðu
      </Link>
    </div>
  );
}
