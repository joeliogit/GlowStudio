import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import RegisterForm from '../components/auth/RegisterForm.jsx';

export default function Register() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
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
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-full bg-gradient-pink flex items-center justify-center shadow-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-gray-800 group-hover:text-pink-500 transition-colors">
                GlowStudio
              </span>
            </Link>
            <h1 className="font-serif text-2xl text-gray-800 mb-1">Crea tu cuenta</h1>
            <p className="text-sm text-gray-400">Únete y empieza a agendar tus citas</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-pink-500 font-medium hover:text-pink-600 transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
