import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar, Sparkles, Star, ArrowRight, Scissors, Palette,
  Hand, Heart, Award, Clock, Shield,
} from 'lucide-react';
import { getStylists } from '../api/stylistsApi';
import api from '../api/authApi';
import StylistCard from '../components/stylists/StylistCard.jsx';
import { formatCurrency } from '../utils/formatCurrency';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55 },
};

const categoryIcons = {
  Corte: <Scissors className="w-5 h-5" />,
  Color: <Palette className="w-5 h-5" />,
  Tratamiento: <Sparkles className="w-5 h-5" />,
  Uñas: <Hand className="w-5 h-5" />,
};

export default function Home() {
  const { data: stylistsData } = useQuery({
    queryKey: ['stylists', 'home'],
    queryFn: () => getStylists().then((d) => d.stylists?.slice(0, 3)),
  });

  const { data: servicesData } = useQuery({
    queryKey: ['services', 'home'],
    queryFn: () => api.get('/services').then((r) => r.data.services?.slice(0, 6)),
  });

  const stylists = stylistsData || [];
  const services = servicesData || [];

  return (
    <div className="page-wrapper overflow-x-hidden">

      {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Pattern background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/images/bg-patron-rosa.jpg)' }}
        />
        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
        {/* Extra soft blob */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-[35%] w-64 h-64 bg-pink-300/25 rounded-full blur-3xl pointer-events-none" />

        <div className="container-app py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ── Left: text ── */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/85 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-pink-600 shadow-sm border border-pink-200 mb-6"
              >
                <Sparkles className="w-4 h-4" />
                Beauty Salon &amp; Spa de Alta Gama
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6"
              >
                Tu belleza,{' '}
                <span className="bg-gradient-pink bg-clip-text text-transparent">
                  nuestra pasión
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg"
              >
                Especialistas en colorimetría, cortes de autor, tratamientos capilares,
                nail art y estética facial. Agenda tu cita en minutos.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link
                  to="/booking"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-pink text-white font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-all shadow-glow-lg text-base"
                >
                  <Calendar className="w-5 h-5" />
                  Agendar mi cita
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 font-medium px-7 py-3.5 rounded-full hover:bg-pink-50 transition-all border border-pink-200 text-base shadow-sm"
                >
                  Ver servicios
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center gap-6"
              >
                {[
                  { value: '500+', label: 'Clientas felices' },
                  { value: '4.9★', label: 'Calificación' },
                  { value: '5', label: 'Especialistas' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`text-center ${i > 0 ? 'border-l border-pink-200 pl-6' : ''}`}
                  >
                    <p className="font-serif text-2xl font-bold text-pink-600">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Right: image with floating badges ── */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              {/* Decorative rings */}
              <div className="absolute w-[470px] h-[470px] rounded-full border-2 border-pink-200/60 animate-pulse" />
              <div className="absolute w-[540px] h-[540px] rounded-full border border-pink-100/40" />

              {/* Main circular image */}
              <div className="relative w-[400px] h-[400px] rounded-full overflow-hidden shadow-[0_20px_80px_rgba(233,30,140,0.25)] border-4 border-white">
                <img
                  src="/assets/images/hero-portada.jpg"
                  alt="GlowStudio — Elegancia Natural, Belleza Eterna"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating badge — top left */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute top-6 -left-6 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-pink-500 fill-pink-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">4.9 / 5.0</p>
                  <p className="text-2xs text-gray-400">Mejor salón</p>
                </div>
              </motion.div>

              {/* Floating badge — bottom right */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute bottom-10 -right-6 bg-white rounded-2xl shadow-card px-4 py-3 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-pink flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Cita en minutos</p>
                  <p className="text-2xs text-gray-400">Disponible 24/7</p>
                </div>
              </motion.div>

              {/* Floating badge — middle right */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -right-10 -translate-y-1/2 bg-gradient-pink text-white rounded-2xl shadow-glow px-4 py-3"
              >
                <p className="text-xs font-semibold">✨ Belleza Premium</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES STRIP ═════════════════════════════════════════════════ */}
      <section className="relative py-14 bg-gradient-pink overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] bg-cover bg-center"
          style={{ backgroundImage: 'url(/assets/images/bg-patron-rosa.jpg)' }}
        />
        <div className="container-app relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: 'Productos Premium',
                desc: 'Marcas internacionales de la más alta calidad para un resultado excepcional.',
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: 'Agenda en Minutos',
                desc: 'Reserva tu cita online de forma fácil, rápida y desde cualquier dispositivo.',
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: 'Expertas Certificadas',
                desc: 'Especialistas con años de formación y experiencia en las últimas tendencias.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.13 }}
                className="flex items-start gap-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-white/75 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═══════════════════════════════════════════════════════ */}
      <section className="section bg-white">
        <div className="container-app">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="section-subtitle">Lo que ofrecemos</p>
            <h2 className="section-title">Nuestros Servicios</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Tratamientos y servicios de belleza realizados con productos premium
              y la técnica más refinada.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative bg-white rounded-2xl border border-pink-100 shadow-card p-6 hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-200 overflow-hidden"
              >
                {/* Corner decoration on hover */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-gradient-pink flex items-center justify-center text-white shadow-glow">
                    {categoryIcons[service.category] || <Sparkles className="w-5 h-5" />}
                  </div>
                  <span className="font-bold text-pink-600 text-lg">{formatCurrency(service.price)}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-3">{service.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{service.duration_minutes} min</span>
                  <span className="text-pink-300">·</span>
                  <span className="text-pink-500 font-medium">{service.category}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-pink-50 text-pink-600 font-medium px-6 py-2.5 rounded-full hover:bg-pink-100 transition-colors border border-pink-200"
            >
              Ver todos los servicios
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ ATMOSPHERE BANNER ══════════════════════════════════════════════ */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img
          src="/assets/images/bg-patron-rosa.jpg"
          alt="Ambiente GlowStudio"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-900/70 via-pink-700/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-app">
            <motion.div {...fadeUp} className="max-w-md text-white">
              <p className="text-pink-200 text-sm font-semibold uppercase tracking-widest mb-2">
                Elegancia &amp; Confort
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Un espacio diseñado<br />para ti
              </h2>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Vive una experiencia única en nuestro salón, donde cada detalle
                está pensado para que te sientas especial.
              </p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 bg-white text-pink-600 font-semibold px-6 py-2.5 rounded-full hover:bg-pink-50 transition-all shadow-md text-sm"
              >
                <Calendar className="w-4 h-4" />
                Reservar ahora
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ STYLISTS ═══════════════════════════════════════════════════════ */}
      {stylists.length > 0 && (
        <section className="section relative overflow-hidden bg-pink-50">
          <div
            className="absolute inset-0 opacity-[0.06] bg-cover bg-center"
            style={{ backgroundImage: 'url(/assets/images/bg-patron-rosa.jpg)' }}
          />
          <div className="container-app relative z-10">
            <motion.div {...fadeUp} className="text-center mb-12">
              <p className="section-subtitle">El mejor equipo</p>
              <h2 className="section-title">Nuestras Especialistas</h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Profesionales apasionadas, certificadas y con años de experiencia.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stylists.map((stylist) => (
                <StylistCard key={stylist.id} stylist={stylist} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/stylists"
                className="inline-flex items-center gap-2 text-pink-600 font-medium hover:text-pink-700 transition-colors"
              >
                Conocer todo el equipo
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══ CTA ════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 overflow-hidden">
        {/* Background: hero image at low opacity */}
        <img
          src="/assets/images/hero-portada.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-pink opacity-92" />

        <div className="container-app relative z-10">
          <motion.div {...fadeUp} className="text-center text-white max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              ¿Lista para brillar?
            </h2>
            <p className="text-white/85 mb-8 text-lg max-w-md mx-auto leading-relaxed">
              Agenda tu cita hoy y descubre por qué somos el salón favorito
              de cientos de clientas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center gap-2 bg-white text-pink-600 font-semibold px-8 py-3.5 rounded-full hover:bg-pink-50 transition-all shadow-lg"
              >
                <Calendar className="w-5 h-5" />
                Agendar ahora
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 bg-white/15 text-white font-medium px-8 py-3.5 rounded-full hover:bg-white/25 transition-all border border-white/30"
              >
                Ver servicios
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
