import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Menu, X, Calendar, ShoppingBag, LogOut,
  LayoutDashboard, Users, Package, Bell, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import RoleBadge from './RoleBadge.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout, isClient, isStaff, isAdmin, isReceptionist } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const activeColor = isAdmin ? 'text-blue-600' : isReceptionist ? 'text-purple-600' : 'text-pink-500';
  const hoverColor = isAdmin ? 'hover:text-blue-600' : isReceptionist ? 'hover:text-purple-600' : 'hover:text-pink-500';
  const activeBg = isAdmin ? 'bg-blue-50 text-blue-600' : isReceptionist ? 'bg-purple-50 text-purple-600' : 'bg-pink-50 text-pink-600';
  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${isActive ? activeColor : `text-gray-600 ${hoverColor}`}`;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-[1000] transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-pink-100'
          : 'bg-white/80 backdrop-blur-sm',
      ].join(' ')}
      style={{ height: 'var(--navbar-height)' }}
    >
      <div className="container-app h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsOpen(false)}>
          <div className="w-8 h-8 rounded-full bg-gradient-pink flex items-center justify-center shadow-glow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-serif text-xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
            GlowStudio
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/services" className={navLinkClass}>Servicios</NavLink>
          <NavLink to="/stylists" className={navLinkClass}>Estilistas</NavLink>

          {isClient && (
            <>
              <NavLink to="/booking" className={navLinkClass}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />Agendar
                </span>
              </NavLink>
              <NavLink to="/my-bookings" className={navLinkClass}>Mis Citas</NavLink>
              <NavLink to="/shop" className={navLinkClass}>Tienda</NavLink>
            </>
          )}

          {isStaff && (
            <>
              <NavLink to="/reception" className={navLinkClass}>
                <span className="flex items-center gap-1">
                  <LayoutDashboard className="w-4 h-4" />Dashboard
                </span>
              </NavLink>
              <NavLink to="/reception/bookings" className={navLinkClass}>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />Citas
                </span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />Admin
              </span>
            </NavLink>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isClient && (
                <NavLink to="/cart" className="relative p-2 text-gray-600 hover:text-pink-500 transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </NavLink>
              )}
              <RoleBadge role={user?.role} />
              <span className="text-sm text-gray-600 hidden lg:block">{user?.name?.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-pink-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
              >
                Iniciar sesión
              </NavLink>
              <NavLink
                to="/register"
                className="bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-pink-600 transition-colors shadow-md"
              >
                Registrarse
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-600 hover:text-pink-500 hover:bg-pink-50 transition-colors"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Menú"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white border-t border-pink-100 shadow-lg overflow-hidden"
          >
            <nav className="container-app py-4 flex flex-col gap-1">
              {[
                { to: '/services', label: 'Servicios' },
                { to: '/stylists', label: 'Estilistas' },
                ...(isClient ? [
                  { to: '/booking', label: 'Agendar Cita', icon: <Calendar className="w-4 h-4" /> },
                  { to: '/my-bookings', label: 'Mis Citas' },
                  { to: '/shop', label: 'Tienda', icon: <ShoppingBag className="w-4 h-4" /> },
                  { to: '/cart', label: `Carrito${itemCount > 0 ? ` (${itemCount})` : ''}` },
                ] : []),
                ...(isStaff ? [
                  { to: '/reception', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
                  { to: '/reception/bookings', label: 'Citas', icon: <Calendar className="w-4 h-4" /> },
                ] : []),
                ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
              ].map(({ to, label, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? activeBg : `text-gray-700 ${hoverColor} hover:bg-opacity-10`
                    }`
                  }
                >
                  {icon}
                  {label}
                </NavLink>
              ))}

              <div className="border-t border-pink-100 mt-2 pt-3">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between px-3">
                    <div className="flex items-center gap-2">
                      <RoleBadge role={user?.role} />
                      <span className="text-sm text-gray-600">{user?.name}</span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-sm text-gray-500 hover:text-pink-500"
                    >
                      <LogOut className="w-4 h-4" />Salir
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-3">
                    <NavLink
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 text-sm font-medium text-pink-600 border border-pink-300 rounded-xl hover:bg-pink-50"
                    >
                      Iniciar sesión
                    </NavLink>
                    <NavLink
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="text-center py-2.5 text-sm font-medium bg-pink-500 text-white rounded-xl hover:bg-pink-600"
                    >
                      Registrarse
                    </NavLink>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
