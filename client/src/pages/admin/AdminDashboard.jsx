import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard, Scissors, Package, Bell, Calendar,
  TrendingUp, Star
} from 'lucide-react';
import { getStylists } from '../../api/stylistsApi';
import { getProducts } from '../../api/productsApi';
import { getNotificationsLog } from '../../api/notificationsApi';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatCurrency';
import { LoaderPage } from '../../components/common/Loader.jsx';
import StylistCard from '../../components/stylists/StylistCard.jsx';
import StockBadge from '../../components/products/StockBadge.jsx';

export default function AdminDashboard({ section = 'dashboard' }) {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState(section);

  const { data: stylistsData } = useQuery({
    queryKey: ['stylists', 'admin'],
    queryFn: () => getStylists({ active_only: 'false' }).then((d) => d.stylists),
  });

  const { data: productsData } = useQuery({
    queryKey: ['products', 'admin'],
    queryFn: () => getProducts({ active_only: 'false' }).then((d) => d.products),
  });

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications', 'admin'],
    queryFn: () => getNotificationsLog().then((d) => d.notifications),
    enabled: activeSection === 'notifications',
  });

  const stylists = stylistsData || [];
  const products = productsData || [];
  const notifications = notificationsData || [];
  const lowStockProducts = products.filter((p) => p.stock <= p.low_stock_threshold);

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'stylists', label: 'Estilistas', icon: <Scissors className="w-4 h-4" /> },
    { key: 'products', label: 'Productos', icon: <Package className="w-4 h-4" /> },
    { key: 'notifications', label: 'Notificaciones', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="bg-gradient-hero-blue py-10">
        <div className="container-app">
          <div className="flex items-center justify-between">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm text-blue-600 font-medium mb-1">Panel de administración</p>
              <h1 className="font-serif text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            </motion.div>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full inline-block mt-0.5">Admin</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-blue-100 pb-4">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={[
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                  activeSection === item.key
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600',
                ].join(' ')}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* ─── Dashboard ─────────────────────────────────────────────────── */}
          {activeSection === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Estilistas activas', value: stylists.filter((s) => s.is_active).length, icon: <Scissors />, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Total productos', value: products.length, icon: <Package />, color: 'text-indigo-600 bg-indigo-50' },
                  { label: 'Stock bajo', value: lowStockProducts.length, icon: <TrendingUp />, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Rating promedio', value: stylists.length ? (stylists.reduce((s, st) => s + parseFloat(st.rating || 0), 0) / stylists.length).toFixed(2) : '—', icon: <Star />, color: 'text-yellow-600 bg-yellow-50' },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-2xl border border-blue-100 shadow-card-blue p-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                      {s.icon}
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { to: '/reception', label: 'Panel de Recepción', desc: 'Gestiona citas y pagos del día', icon: <Calendar className="w-5 h-5" /> },
                  { to: '/reception/stock', label: 'Control de Inventario', desc: 'Actualiza stock de productos', icon: <Package className="w-5 h-5" /> },
                  { label: 'Gestionar Estilistas', desc: 'Edita perfiles del equipo', icon: <Scissors className="w-5 h-5" />, onClick: () => setActiveSection('stylists') },
                ].map((link) => (
                  <div
                    key={link.label}
                    onClick={link.onClick}
                    className={`bg-white rounded-2xl border border-blue-100 shadow-card-blue p-5 hover:shadow-card-blue-hover hover:-translate-y-1 transition-all ${link.onClick ? 'cursor-pointer' : ''}`}
                  >
                    {link.to && !link.onClick ? (
                      <Link to={link.to} className="block">
                        <AdminLinkContent icon={link.icon} label={link.label} desc={link.desc} />
                      </Link>
                    ) : (
                      <AdminLinkContent icon={link.icon} label={link.label} desc={link.desc} />
                    )}
                  </div>
                ))}
              </div>

              {lowStockProducts.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                  <h3 className="font-semibold text-amber-800 mb-3">Alertas de Stock Bajo</h3>
                  <div className="space-y-2">
                    {lowStockProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-sm">
                        <span className="text-amber-700">{p.name}</span>
                        <StockBadge stock={p.stock} threshold={p.low_stock_threshold} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Stylists ──────────────────────────────────────────────────── */}
          {activeSection === 'stylists' && (
            <div>
              <h2 className="font-semibold text-gray-800 text-lg mb-6">Equipo de Estilistas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {stylists.map((s) => (
                  <StylistCard key={s.id} stylist={s} />
                ))}
              </div>
            </div>
          )}

          {/* ─── Products ──────────────────────────────────────────────────── */}
          {activeSection === 'products' && (
            <div>
              <h2 className="font-semibold text-gray-800 text-lg mb-6">Catálogo de Productos</h2>
              <div className="bg-white rounded-2xl border border-blue-100 shadow-card-blue overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50 border-b border-blue-100">
                        {['Producto', 'SKU', 'Categoría', 'Precio', 'Stock', 'Estado'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-blue-50/50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">{p.name}</p>
                            <p className="text-xs text-gray-400">{p.brand}</p>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.sku || '—'}</td>
                          <td className="px-4 py-3 text-gray-600">{p.category || '—'}</td>
                          <td className="px-4 py-3 font-semibold text-blue-700">{formatCurrency(p.price)}</td>
                          <td className="px-4 py-3 font-bold text-gray-800">{p.stock}</td>
                          <td className="px-4 py-3">
                            <StockBadge stock={p.stock} threshold={p.low_stock_threshold} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ─── Notifications ─────────────────────────────────────────────── */}
          {activeSection === 'notifications' && (
            <div>
              <h2 className="font-semibold text-gray-800 text-lg mb-6">Log de Notificaciones</h2>
              <div className="bg-white rounded-2xl border border-blue-100 shadow-card-blue overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-50 border-b border-blue-100">
                        {['Canal', 'Tipo', 'Estado', 'Clienta', 'Fecha'].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                      {notifications.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-gray-400">Sin notificaciones.</td>
                        </tr>
                      )}
                      {notifications.map((n) => (
                        <tr key={n.id} className="hover:bg-blue-50/50">
                          <td className="px-4 py-3 capitalize font-medium text-gray-700">{n.channel}</td>
                          <td className="px-4 py-3 text-gray-500">{n.type}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium border ${
                              n.status === 'sent' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                            }`}>
                              {n.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{n.user_name || '—'}</td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {new Date(n.created_at).toLocaleDateString('es-MX')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function AdminLinkContent({ icon, label, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
