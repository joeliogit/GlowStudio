import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/productsApi';
import ProductCard from './ProductCard.jsx';
import { LoaderPage } from '../common/Loader.jsx';

const CATEGORIES = ['Todos', 'Cabello', 'Facial', 'Uñas', 'Maquillaje'];

export default function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', 'grid'],
    queryFn: () => getProducts({ active_only: 'true' }).then((d) => d.products),
  });

  const products = data || [];

  const filtered =
    activeCategory === 'Todos'
      ? products
      : products.filter((p) => p.category === activeCategory);

  if (isLoading) return <LoaderPage message="Cargando productos..." />;
  if (error) return <p className="text-red-500 text-center py-8">Error al cargar productos.</p>;

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={[
              'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
              activeCategory === cat
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-pink-50 text-pink-600 hover:bg-pink-100',
            ].join(' ')}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🌸</p>
          <p className="text-gray-400">No hay productos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
