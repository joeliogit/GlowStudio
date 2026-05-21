import { ShoppingCart, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import StockBadge from './StockBadge.jsx';
import Button from '../common/Button.jsx';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar al carrito.');
      return;
    }
    if (product.stock === 0) return;
    addItem(product);
    toast.success(`${product.name} agregado al carrito.`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl border border-pink-100 shadow-card overflow-hidden group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-pink-50 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🌸</span>
          </div>
        )}

        {/* Wishlist */}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-pink-500">
          <Heart className="w-4 h-4" />
        </button>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">Agotado</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-pink-400 font-medium uppercase tracking-wide mb-1">{product.brand}</p>
        <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2">{product.name}</h3>

        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-pink-600 text-base">{formatCurrency(product.price)}</span>
          <StockBadge stock={product.stock} threshold={product.low_stock_threshold} />
        </div>

        <Button
          variant="primary"
          size="sm"
          fullWidth
          disabled={product.stock === 0}
          onClick={handleAddToCart}
          leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
        >
          {product.stock === 0 ? 'Agotado' : 'Agregar'}
        </Button>
      </div>
    </motion.div>
  );
}
