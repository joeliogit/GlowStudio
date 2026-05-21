import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button.jsx';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="page-wrapper">
        <section className="section">
          <div className="container-app max-w-md mx-auto text-center py-20">
            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-pink-300" />
            </div>
            <h2 className="font-serif text-2xl text-gray-800 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-400 mb-6">Descubre nuestros productos de belleza premium.</p>
            <Link to="/shop">
              <Button>Ver productos</Button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <section className="section">
        <div className="container-app max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-serif text-3xl text-gray-800">
              Carrito ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
            </h1>
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Vaciar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-pink-100 shadow-card p-4"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.brand}</p>
                    <p className="text-pink-600 font-semibold">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center hover:border-pink-400 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded-full border border-pink-200 flex items-center justify-center hover:border-pink-400 transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 rounded-full text-gray-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-pink-100 shadow-card p-6 sticky top-24">
                <h2 className="font-semibold text-gray-800 text-lg mb-4">Resumen</h2>
                <div className="space-y-2 text-sm mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-gray-500">
                      <span className="truncate mr-2">{item.name} x{item.quantity}</span>
                      <span className="flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-pink-100 pt-3 mb-5 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-pink-600">{formatCurrency(total)}</span>
                </div>
                <Button fullWidth size="lg" onClick={() => navigate('/checkout')} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Proceder al pago
                </Button>
                <Link to="/shop" className="mt-3 flex items-center justify-center gap-1 text-sm text-gray-400 hover:text-pink-500 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" /> Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
