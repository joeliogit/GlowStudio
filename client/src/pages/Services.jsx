import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Scissors, Palette, Sparkles, Hand } from 'lucide-react';
import api from '../api/authApi';
import { formatCurrency } from '../utils/formatCurrency';
import { LoaderPage } from '../components/common/Loader.jsx';

const CATEGORIES = ['Todos', 'Corte', 'Color', 'Tratamiento', 'Uñas', 'Maquillaje', 'Estética Facial'];

const categoryIcons = {
  Corte: <Scissors className="w-5 h-5" />,
  Color: <Palette className="w-5 h-5" />,
  Tratamiento: <Sparkles className="w-5 h-5" />,
  Uñas: <Hand className="w-5 h-5" />,
};

export default function Services() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data.services || []),
  });

  const services = data || [];
  const filtered = activeCategory === 'Todos'
    ? services
    : services.filter((s) => s.category === activeCategory);

  if (isLoading) return <LoaderPage message="Cargando servicios..." />;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container-app text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="section-subtitle">Catálogo completo</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Nuestros Servicios
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Descubre todos los servicios de belleza y bienestar que ofrecemos, con precios transparentes.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  activeCategory === cat
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-pink-50 text-pink-600 hover:bg-pink-100',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Services grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl border border-pink-100 shadow-card overflow-hidden group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200"
              >
                {service.image_url && (
                  <div className="aspect-video overflow-hidden bg-pink-50">
                    <img
                      src={service.image_url}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center text-pink-500">
                      {categoryIcons[service.category] || <Sparkles className="w-4 h-4" />}
                    </span>
                    <span className="text-xs text-pink-400 font-medium">{service.category}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration_minutes} min
                    </div>
                    <span className="font-bold text-pink-600 text-lg">{formatCurrency(service.price)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-16">No hay servicios en esta categoría.</p>
          )}

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-pink-500 text-white font-medium px-8 py-3.5 rounded-full hover:bg-pink-600 transition-all shadow-md"
            >
              Agendar mi cita
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
