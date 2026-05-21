import { Download, Printer, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateFull, formatTime } from '../../utils/formatDate';
import Button from '../common/Button.jsx';

export default function ReceiptView({ receipt, onClose }) {
  if (!receipt) return null;

  const handlePrint = () => window.print();

  const handleDownload = () => {
    if (receipt.receipt_url) {
      window.open(receipt.receipt_url, '_blank', 'noopener noreferrer');
    }
  };

  return (
    <div className="space-y-6">
      {/* Success icon */}
      <div className="flex flex-col items-center text-center gap-3 py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h3 className="font-serif text-xl text-gray-800">¡Pago confirmado!</h3>
          <p className="text-sm text-gray-500 mt-1">Tu cita ha sido registrada.</p>
        </div>
      </div>

      {/* Receipt details */}
      <div className="bg-pink-50 rounded-2xl p-5 space-y-3 text-sm">
        <p className="text-xs text-gray-400 font-mono">#{receipt.id?.slice(0, 8).toUpperCase()}</p>

        <ReceiptRow label="Servicio" value={receipt.service_name} />
        <ReceiptRow label="Estilista" value={receipt.stylist_name} />
        <ReceiptRow
          label="Fecha"
          value={receipt.appointment_date ? formatDateFull(receipt.appointment_date) : ''}
        />
        <ReceiptRow
          label="Hora"
          value={receipt.appointment_time ? formatTime(receipt.appointment_time) : ''}
        />

        <div className="pt-3 border-t border-pink-200 flex items-center justify-between">
          <span className="font-semibold text-gray-700">Total pagado</span>
          <span className="font-bold text-lg text-pink-600">
            {formatCurrency(receipt.amount_paid)}
          </span>
        </div>

        <ReceiptRow
          label="Método"
          value={receipt.payment_method === 'stripe'
            ? 'Tarjeta (Stripe)'
            : receipt.payment_method === 'cash'
            ? 'Efectivo'
            : 'Terminal bancaria'}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {receipt.receipt_url && (
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={handleDownload}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Descargar PDF
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={handlePrint}
          leftIcon={<Printer className="w-4 h-4" />}
        >
          Imprimir
        </Button>
      </div>

      {onClose && (
        <Button fullWidth onClick={onClose}>
          Cerrar
        </Button>
      )}
    </div>
  );
}

function ReceiptRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800">{value || '—'}</span>
    </div>
  );
}
