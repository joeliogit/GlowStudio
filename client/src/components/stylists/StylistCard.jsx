import { Link } from 'react-router-dom';
import { Star, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StylistCard({ stylist }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="bg-white rounded-2xl border border-pink-100 shadow-card overflow-hidden text-center group"
    >
      {/* Photo */}
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden bg-pink-50">
          <img
            src={
              stylist.photo_url ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(stylist.name)}&background=FFB6C1&color=E91E8C&size=400`
            }
            alt={stylist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        {stylist.instagram_handle && (
          <a
            href={`https://instagram.com/${stylist.instagram_handle.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-pink-500"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-serif text-lg font-semibold text-gray-800 mb-0.5">{stylist.name}</h3>
        <p className="text-sm text-pink-500 font-medium mb-3">{stylist.specialty}</p>

        <div className="flex items-center justify-center gap-1 mb-4">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-sm font-semibold text-gray-700">{stylist.rating}</span>
        </div>

        <Link
          to={`/stylists/${stylist.id}`}
          className="block w-full py-2 rounded-xl border-2 border-pink-200 text-pink-600 text-sm font-medium hover:bg-pink-50 transition-colors"
        >
          Ver perfil
        </Link>
      </div>
    </motion.div>
  );
}
