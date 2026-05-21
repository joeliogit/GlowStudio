import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button.jsx';

export default function Cart({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose?.();
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-pink-500" />
                <h2 className="font-serif text-lg text-gray-800">Carrito</h2>
                {itemCount > 0 && (
                  <span className="w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    Vaciar
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full hover:bg-pink-50 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-pink-300" />
                  </div>
                  <p className="text-gray-400 text-sm">Tu carrito está vacío.</p>
                  <Button variant="outline" size="sm" onClick={onClose}>
                    Ver productos
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex items-center gap-3 p-3 bg-pink-50/50 rounded-xl border border-pink-100"
                  >
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <p className="text-xs text-pink-500 font-semibold">{formatCurrency(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white border border-pink-200 flex items-center justify-center hover:border-pink-400 transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-white border border-pink-200 flex items-center justify-center hover:border-pink-400 transition-colors"
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-6 h-6 rounded-md text-gray-300 hover:text-red-400 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-pink-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 font-medium">Total</span>
                  <span className="text-xl font-bold text-pink-600">{formatCurrency(total)}</span>
                </div>
                <Button fullWidth size="lg" onClick={handleCheckout}>
                  Proceder al pago
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
