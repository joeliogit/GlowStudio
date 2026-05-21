import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../common/Button.jsx';

export default function CheckoutForm({ onSuccess, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMsg('');

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setErrorMsg(error.message || 'Error al procesar el pago.');
      toast.error(error.message || 'Pago fallido.');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      toast.success('¡Pago realizado con éxito!');
      onSuccess?.(paymentIntent.id);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="p-4 bg-white rounded-2xl border border-pink-100">
        <PaymentElement
          options={{
            layout: 'tabs',
            fields: {
              billingDetails: {
                address: 'never',
              },
            },
          }}
        />
      </div>

      {errorMsg && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {errorMsg}
        </p>
      )}

      <Button
        type="submit"
        fullWidth
        size="lg"
        loading={isLoading}
        disabled={!stripe || !elements}
        leftIcon={<Lock className="w-4 h-4" />}
      >
        {isLoading ? 'Procesando...' : 'Pagar ahora'}
      </Button>

      <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Pago seguro con Stripe. No almacenamos tu información de tarjeta.
      </p>
    </form>
  );
}
