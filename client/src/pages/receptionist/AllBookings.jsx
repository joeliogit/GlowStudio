import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import BookingManagerTable from '../../components/receptionist/BookingManagerTable.jsx';

export default function AllBookings() {
  return (
    <div className="page-wrapper">
      <section className="bg-gradient-hero-purple py-10 md:py-14">
        <div className="container-app">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <Calendar className="w-5 h-5" />
              <span className="text-sm font-medium">Recepción</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-800">Gestión de Citas</h1>
            <p className="text-gray-500 mt-1">Administra, filtra y actualiza todas las citas del salón.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          <BookingManagerTable />
        </div>
      </section>
    </div>
  );
}
