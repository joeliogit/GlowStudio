import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import StockManager from '../../components/receptionist/StockManager.jsx';

export default function StockManagement() {
  return (
    <div className="page-wrapper">
      <section className="bg-gradient-hero-purple py-10 md:py-14">
        <div className="container-app">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Package className="w-5 h-5" />
              <span className="text-sm font-medium">Inventario</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-800">Control de Stock</h1>
            <p className="text-gray-500 mt-1">Consulta y actualiza el inventario de productos del salón.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          <StockManager />
        </div>
      </section>
    </div>
  );
}
