import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatCurrency } from '../../utils/formatCurrency';
import CheckoutForm from '../../components/payment/CheckoutForm.jsx';
import ReceiptView from '../../components/payment/ReceiptView.jsx';
import Loader from '../../components/common/Loader.jsx';
import api from '../../api/authApi';
import toast from 'react-hot-toast';

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    if (items.length === 0 || !stripePromise) return;

    const createIntent = async () => {
      setLoading(true);
      try {
        const res = await api.post('/payments/create-intent', {
          amount: total,
          booking_id: null, // product order
        }).catch(() => null);

        if (res?.data?.clientSecret) {
          setClientSecret(res.data.clientSecret);
          setPaymentIntentId(res.data.paymentIntentId);
        }
      } catch {
        // Stripe not configured, allow COD
      } finally {
        setLoading(false);
      }
    };
    createIntent();
  }, []);

  if (items.length === 0 && !receipt) {
    return <Navigate to="/shop" replace />;
  }

  if (receipt) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-pink-100 shadow-card p-8 max-w-md w-full">
          <ReceiptView receipt={receipt} onClose={() => navigate('/')} />
        </div>
      </div>
    );
  }

  const handleSuccess = async (piId) => {
    try {
      clearCart();
      setReceipt({
        id: piId,
        service_name: `Pedido de ${items.length} producto(s)`,
        amount_paid: total,
        payment_method: 'stripe',
        payment_status: 'paid',
      });
    } catch {
      toast.error('Error al confirmar el pedido.');
    }
  };

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#E91E8C',
        colorBackground: '#ffffff',
        borderRadius: '12px',
        fontFamily: '"DM Sans", sans-serif',
      },
    },
  };

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-pink-600 mb-2">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Pago seguro</span>
          </div>
          <h1 className="font-serif text-3xl text-gray-800">Finalizar compra</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-card p-6">
            <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-pink-500" />
              Tu pedido
            </h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Cantidad: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-pink-100 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-pink-600 text-lg">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Payment form */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-card p-6">
            <h2 className="font-semibold text-gray-800 mb-4">Método de pago</h2>

            {loading ? (
              <div className="flex justify-center py-10">
                <Loader size="lg" />
              </div>
            ) : clientSecret && stripePromise ? (
              <Elements options={stripeOptions} stripe={stripePromise}>
                <CheckoutForm onSuccess={handleSuccess} clientSecret={clientSecret} />
              </Elements>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-sm text-gray-500">
                  Los pagos con tarjeta no están configurados. Paga en el salón.
                </p>
                <button
                  onClick={() => {
                    clearCart();
                    setReceipt({
                      id: 'cash-order',
                      service_name: `Pedido de ${items.length} producto(s)`,
                      amount_paid: total,
                      payment_method: 'cash',
                      payment_status: 'pending',
                    });
                  }}
                  className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-pink-600 transition-colors"
                >
                  Confirmar pedido (pago en tienda)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
