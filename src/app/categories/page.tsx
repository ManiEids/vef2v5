import Link from 'next/link';
import { fetchAllCategories, Category } from '@/lib/datocms';

export default async function CategoriesPage() {
  const categories = await fetchAllCategories();
  
  return (
    <div className="space-card">
      <h1 className="mb-6">Spurningaflokkar</h1>
      
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category: Category) => (
          <li key={category.id} className="space-card">
            <Link href={`/categories/${category.slug}`} className="block">
              <h3 className="mb-2">{category.title}</h3>
              {category.description && (
                <div dangerouslySetInnerHTML={{ __html: category.description }} />
              )}
            </Link>
          </li>
        ))}
      </ul>
      
      {categories.length === 0 && <p>Engir flokkar fundust.</p>}
    </div>
  );
}
