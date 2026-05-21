import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { registerSchema } from '../../utils/validators';
import { registerUser } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button.jsx';
import GoogleSignInButton from './GoogleSignInButton.jsx';

export default function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone || undefined,
        password: data.password,
      });
      login(result.user, result.token);
      toast.success(`Bienvenida a GlowStudio, ${result.user.name.split(' ')[0]}!`);
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrarse.');
    }
  };

  const Field = ({ id, label, error, icon: Icon, children }) => (
    <div>
      <label className="input-label" htmlFor={id}>{label}</label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />}
        {children}
      </div>
      {error && <p className="input-error">{error}</p>}
    </div>
  );

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Field id="name" label="Nombre completo" error={errors.name?.message} icon={User}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Ana García López"
          className={`input-field pl-10 ${errors.name ? 'error' : ''}`}
          {...register('name')}
        />
      </Field>

      <Field id="email" label="Correo electrónico" error={errors.email?.message} icon={Mail}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          className={`input-field pl-10 ${errors.email ? 'error' : ''}`}
          {...register('email')}
        />
      </Field>

      <Field id="phone" label="Teléfono (opcional)" error={errors.phone?.message} icon={Phone}>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          placeholder="5512345678"
          className={`input-field pl-10 ${errors.phone ? 'error' : ''}`}
          {...register('phone')}
        />
      </Field>

      <Field id="password" label="Contraseña" error={errors.password?.message} icon={Lock}>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Mínimo 8 caracteres"
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
      </Field>

      <Field id="confirmPassword" label="Confirmar contraseña" error={errors.confirmPassword?.message} icon={Lock}>
        <input
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Repite tu contraseña"
          className={`input-field pl-10 pr-11 ${errors.confirmPassword ? 'error' : ''}`}
          {...register('confirmPassword')}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((v) => !v)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          tabIndex={-1}
        >
          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </Field>

      <Button type="submit" fullWidth loading={isSubmitting} size="lg" className="mt-2">
        Crear mi cuenta
      </Button>
    </form>

    <GoogleSignInButton text="signup_with" />
    </>
  );
}
