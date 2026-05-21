import { useState } from 'react';
import { MessageCircle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { sendBookingReminder } from '../../api/bookingsApi';
import Button from '../common/Button.jsx';
import Modal from '../common/Modal.jsx';

export default function WhatsAppReminder({ bookingId, clientName, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await sendBookingReminder(bookingId);
      setSent(true);
      toast.success(`Recordatorio enviado a ${clientName}.`);
      setTimeout(() => setIsOpen(false), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al enviar recordatorio.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        leftIcon={<MessageCircle className="w-4 h-4 text-green-500" />}
      >
        Recordatorio WhatsApp
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Enviar recordatorio"
        size="sm"
      >
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-green-700 font-medium">Recordatorio enviado</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <MessageCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800 text-sm">WhatsApp a {clientName}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Se enviará un recordatorio con los detalles de su cita.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setIsOpen(false)} fullWidth>
                Cancelar
              </Button>
              <Button onClick={handleSend} loading={sending} fullWidth>
                Enviar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
