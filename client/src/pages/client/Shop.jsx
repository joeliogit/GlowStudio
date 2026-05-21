import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, X } from 'lucide-react';
import ProductGrid from '../../components/products/ProductGrid.jsx';
import Cart from '../../components/products/Cart.jsx';
import { useCart } from '../../hooks/useCart';

export default function Shop() {
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="bg-gradient-hero py-12 md:py-16">
        <div className="container-app">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="section-subtitle">Nuestra tienda</p>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800">
                Productos de Belleza
              </h1>
              <p className="text-gray-500 mt-2">Los productos que usamos en el salón, ahora en tu hogar.</p>
            </motion.div>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-pink-200 shadow-sm hover:shadow-md transition-all text-sm font-medium text-gray-700"
            >
              <ShoppingCart className="w-4 h-4 text-pink-500" />
              Carrito
              {itemCount > 0 && (
                <span className="w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          <ProductGrid />
        </div>
      </section>

      {/* Cart drawer */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
