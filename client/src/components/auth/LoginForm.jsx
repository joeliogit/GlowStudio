import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { loginSchema } from '../../utils/validators';
import { loginUser } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button.jsx';
import GoogleSignInButton from './GoogleSignInButton.jsx';

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await loginUser(data);
      login(result.user, result.token);

      toast.success(`Bienvenida, ${result.user.name.split(' ')[0]}!`);

      // Redirect based on role
      const from = location.state?.from?.pathname;
      if (from) { navigate(from, { replace: true }); return; }
      const redirects = { admin: '/admin', receptionist: '/reception', client: '/' };
      navigate(redirects[result.user.role] || '/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al iniciar sesión.');
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div>
        <label className="input-label" htmlFor="email">
          Correo electrónico
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            className={`input-field pl-10 ${errors.email ? 'error' : ''}`}
            {...register('email')}
          />
        </div>
        {errors.email && <p className="input-error">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="input-label" htmlFor="password">
          Contraseña
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Tu contraseña"
            className={`input-field pl-10 pr-11 ${errors.password ? 'error' : ''}`}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="input-error">{errors.password.message}</p>}
      </div>

      <Button type="submit" fullWidth loading={isSubmitting} size="lg">
        Iniciar sesión
      </Button>
    </form>

    <GoogleSignInButton text="continue_with" />
    </>
  );
}
