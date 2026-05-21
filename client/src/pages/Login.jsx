import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/auth/LoginForm.jsx';

export default function Login() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const redirects = { admin: '/admin', receptionist: '/reception', client: '/' };
    return <Navigate to={redirects[user?.role] || '/'} replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-pink-100 p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
                GlowStudio
              </span>
            </Link>
            <h1 className="font-serif text-2xl text-gray-800 mb-1">Bienvenida de vuelta</h1>
            <p className="text-sm text-gray-400">Inicia sesión para continuar</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-pink-500 font-medium hover:text-pink-600 transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Al continuar aceptas nuestros{' '}
          <a href="#" className="text-pink-400 hover:underline">términos de servicio</a>
        </p>
      </motion.div>
    </div>
  );
}
