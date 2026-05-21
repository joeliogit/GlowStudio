import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { getStylists } from '../api/stylistsApi';
import StylistCard from '../components/stylists/StylistCard.jsx';
import { LoaderPage } from '../components/common/Loader.jsx';

export default function Stylists() {
  const { data, isLoading } = useQuery({
    queryKey: ['stylists'],
    queryFn: () => getStylists().then((d) => d.stylists),
  });

  const stylists = data || [];

  return (
    <div className="page-wrapper">
      {/* Header */}
      <section className="bg-gradient-hero py-16 md:py-20">
        <div className="container-app text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="section-subtitle">Nuestro equipo</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Conoce a las Especialistas
            </h1>
            <p className="text-gray-500 max-w-lg mx-auto">
              Profesionales apasionadas, certificadas y dedicadas a hacer brillar tu belleza.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-app">
          {isLoading ? (
            <LoaderPage message="Cargando equipo..." />
          ) : stylists.length === 0 ? (
            <p className="text-center text-gray-400 py-16">Sin estilistas disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stylists.map((stylist, i) => (
                <motion.div
                  key={stylist.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <StylistCard stylist={stylist} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
