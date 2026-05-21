import { Link } from 'react-router-dom';
import { Sparkles, Instagram, Facebook, MapPin, Phone, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-app py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-pink flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-white">GlowStudio</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Beauty Salon & Spa de alta gama. Tu destino de belleza y bienestar en la ciudad.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/glowstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/glowstudio"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-pink-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Servicios</h4>
            <ul className="space-y-2 text-sm">
              {['Corte de Cabello', 'Colorimetría', 'Tratamientos', 'Manicura & Nail Art', 'Maquillaje'].map(
                (s) => (
                  <li key={s}>
                    <Link to="/services" className="hover:text-pink-400 transition-colors">
                      {s}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/stylists" className="hover:text-pink-400 transition-colors">Nuestro Equipo</Link></li>
              <li><Link to="/services" className="hover:text-pink-400 transition-colors">Servicios</Link></li>
              <li><Link to="/shop" className="hover:text-pink-400 transition-colors">Tienda</Link></li>
              <li><Link to="/booking" className="hover:text-pink-400 transition-colors">Agendar Cita</Link></li>
              <li><a href="#" className="hover:text-pink-400 transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                <span>Av. Insurgentes Sur 1234, Col. Del Valle, CDMX</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <a href="tel:+525512345678" className="hover:text-pink-400 transition-colors">
                  +52 55 1234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <a href="mailto:contacto@glowstudio.mx" className="hover:text-pink-400 transition-colors">
                  contacto@glowstudio.mx
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium">Horario</p>
              <p className="text-sm">Lunes – Sábado: 9:00 – 20:00</p>
              <p className="text-sm">Domingo: 10:00 – 18:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>&copy; {year} GlowStudio. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> en México
          </p>
        </div>
      </div>
    </footer>
  );
}
