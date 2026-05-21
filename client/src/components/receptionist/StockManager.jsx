import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProducts, updateStock, getStockLog } from '../../api/productsApi';
import { formatCurrency } from '../../utils/formatCurrency';
import StockBadge from '../products/StockBadge.jsx';
import Modal from '../common/Modal.jsx';
import Button from '../common/Button.jsx';
import Loader from '../common/Loader.jsx';

export default function StockManager() {
  const qc = useQueryClient();
  const [logProduct, setLogProduct] = useState(null);
  const [adjustProduct, setAdjustProduct] = useState(null);
  const [change, setChange] = useState('');
  const [reason, setReason] = useState('');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', { active_only: 'false' }],
    queryFn: () => getProducts({ active_only: 'false' }).then((d) => d.products),
  });

  const { data: stockLog = [], isLoading: logLoading } = useQuery({
    queryKey: ['stock-log', logProduct?.id],
    queryFn: () => getStockLog(logProduct.id).then((d) => d.log),
    enabled: Boolean(logProduct),
  });

  const { mutate: doUpdateStock, isPending: updating } = useMutation({
    mutationFn: ({ id, change_amount, reason }) => updateStock(id, change_amount, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Stock actualizado.');
      setAdjustProduct(null);
      setChange('');
      setReason('');
    },
    onError: (err) => toast.error(err.response?.data?.error || 'Error al actualizar stock.'),
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader size="lg" /></div>;

  return (
    <>
      <div className="bg-white rounded-2xl border border-purple-100 shadow-card-purple overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-50 border-b border-purple-100">
                {['Producto', 'SKU', 'Categoría', 'Precio', 'Stock', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-purple-700 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-purple-50/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {p.image_url && (
                        <img src={p.image_url} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{p.sku || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-purple-700">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold text-base ${p.stock <= p.low_stock_threshold ? 'text-red-500' : 'text-gray-800'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge stock={p.stock} threshold={p.low_stock_threshold} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAdjustProduct(p)}
                        className="p-1.5 rounded-lg text-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                        title="Ajustar stock"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setLogProduct(p)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                        title="Ver historial"
                      >
                        <History className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Stock Modal */}
      <Modal
        isOpen={Boolean(adjustProduct)}
        onClose={() => setAdjustProduct(null)}
        title={`Ajustar Stock — ${adjustProduct?.name}`}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Stock actual: <strong className="text-gray-800">{adjustProduct?.stock}</strong>
          </p>
          <div>
            <label className="input-label">Cambio de stock</label>
            <p className="text-xs text-gray-400 mb-2">Usa números negativos para reducir stock.</p>
            <input
              type="number"
              value={change}
              onChange={(e) => setChange(e.target.value)}
              placeholder="Ej: +10 o -3"
              className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
            />
          </div>
          <div>
            <label className="input-label">Razón (opcional)</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Recepción de mercancía, venta, etc."
              className="w-full px-4 py-3 rounded-xl border border-purple-200 bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 transition-all"
            />
          </div>
          <Button
            variant="purple"
            fullWidth
            loading={updating}
            disabled={!change || change === '0'}
            onClick={() =>
              doUpdateStock({ id: adjustProduct.id, change_amount: parseInt(change), reason: reason || undefined })
            }
          >
            Actualizar Stock
          </Button>
        </div>
      </Modal>

      {/* Stock Log Modal */}
      <Modal
        isOpen={Boolean(logProduct)}
        onClose={() => setLogProduct(null)}
        title={`Historial — ${logProduct?.name}`}
        size="md"
      >
        {logLoading ? (
          <div className="flex justify-center py-8"><Loader /></div>
        ) : stockLog.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">Sin movimientos registrados.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {stockLog.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-sm py-2 border-b border-purple-50 last:border-0">
                <div>
                  <p className="font-medium text-gray-700">{entry.reason || 'Sin descripción'}</p>
                  <p className="text-xs text-gray-400">
                    Por {entry.changed_by || 'sistema'} · {new Date(entry.created_at).toLocaleDateString('es-MX')}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${entry.change_amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {entry.change_amount > 0 ? '+' : ''}{entry.change_amount}
                  </span>
                  <p className="text-xs text-gray-400">Stock: {entry.stock_after}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </>
  );
}
