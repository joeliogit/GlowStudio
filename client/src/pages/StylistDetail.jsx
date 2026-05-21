import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getStylistById } from '../api/stylistsApi';
import StylistProfile from '../components/stylists/StylistProfile.jsx';
import { LoaderPage } from '../components/common/Loader.jsx';

export default function StylistDetail() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['stylist', id],
    queryFn: () => getStylistById(id).then((d) => d),
    enabled: Boolean(id),
  });

  if (isLoading) return <LoaderPage message="Cargando perfil..." />;
  if (error || !data?.stylist) {
    return (
      <div className="page-wrapper flex flex-col items-center justify-center gap-4 min-h-[60vh]">
        <p className="text-gray-400">Estilista no encontrada.</p>
        <Link to="/stylists" className="text-pink-500 hover:underline text-sm flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Volver al equipo
        </Link>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <section className="section">
        <div className="container-app">
          <Link
            to="/stylists"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-500 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al equipo
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <StylistProfile stylist={data.stylist} stats={data.stats} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
