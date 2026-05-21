import { Link } from 'react-router-dom';
import { Star, Instagram, Calendar, Award, Scissors } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../common/Button.jsx';

export default function StylistProfile({ stylist, stats }) {
  if (!stylist) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl border border-pink-100 shadow-card overflow-hidden">
        {/* Header banner */}
        <div className="h-32 bg-gradient-hero" />

        {/* Profile */}
        <div className="px-6 md:px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16 mb-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img
                src={
                  stylist.photo_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(stylist.name)}&background=FFB6C1&color=E91E8C&size=128`
                }
                alt={stylist.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
            </motion.div>
            <div className="text-center sm:text-left sm:mb-2">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800">{stylist.name}</h1>
              <p className="text-pink-500 font-medium">{stylist.specialty}</p>
            </div>
          </div>

          {/* Rating & stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <StatCard icon={<Star className="w-5 h-5 text-amber-400" />} value={stylist.rating} label="Calificación" />
            <StatCard
              icon={<Award className="w-5 h-5 text-pink-500" />}
              value={stats?.completed_bookings || 0}
              label="Citas completadas"
            />
            <StatCard
              icon={<Scissors className="w-5 h-5 text-purple-400" />}
              value={stylist.specialty?.split(' ')[0] || 'Experta'}
              label="Especialidad principal"
            />
          </div>

          {/* Bio */}
          {stylist.bio && (
            <div className="mb-6">
              <h2 className="font-semibold text-gray-700 mb-2">Sobre mí</h2>
              <p className="text-gray-500 leading-relaxed">{stylist.bio}</p>
            </div>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/booking" className="flex-1">
              <Button fullWidth leftIcon={<Calendar className="w-4 h-4" />}>
                Agendar con {stylist.name.split(' ')[0]}
              </Button>
            </Link>
            {stylist.instagram_handle && (
              <a
                href={`https://instagram.com/${stylist.instagram_handle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="secondary" fullWidth leftIcon={<Instagram className="w-4 h-4" />}>
                  {stylist.instagram_handle}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-pink-50 rounded-2xl p-4 text-center">
      <div className="flex justify-center mb-1">{icon}</div>
      <p className="font-bold text-gray-800 text-lg leading-none">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{label}</p>
    </div>
  );
}
