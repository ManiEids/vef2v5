import { TestLocationsList } from '@/components/TestLocationsList';

export default function TestLocationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Test Locations</h1>
      <TestLocationsList />
    </div>
  );
}
