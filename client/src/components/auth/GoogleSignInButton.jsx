import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { googleLogin } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ROLE_REDIRECTS = { admin: '/admin', receptionist: '/reception', client: '/' };

/**
 * Botón "Iniciar sesión con Google". Se renderiza junto al login/registro por
 * contraseña (no lo reemplaza). Solo aparece si VITE_GOOGLE_CLIENT_ID está
 * configurado; el rol del usuario lo decide el backend (conserva el existente).
 *
 * @param {{ text?: 'signin_with' | 'signup_with' | 'continue_with' }} props
 */
export default function GoogleSignInButton({ text = 'continue_with' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sin Client ID no hay nada que mostrar (login por contraseña sigue intacto).
  if (!CLIENT_ID) return null;

  const handleSuccess = async (credentialResponse) => {
    try {
      const { user, token } = await googleLogin(credentialResponse.credential);
      login(user, token);
      toast.success(`Bienvenida, ${user.name.split(' ')[0]}!`);

      const from = location.state?.from?.pathname;
      navigate(from || ROLE_REDIRECTS[user.role] || '/', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || 'No se pudo iniciar sesión con Google.');
    }
  };

  return (
    <div>
      <div className="relative my-5 flex items-center" aria-hidden="true">
        <div className="flex-grow border-t border-gray-200" />
        <span className="mx-3 text-xs text-gray-400">o continúa con</span>
        <div className="flex-grow border-t border-gray-200" />
      </div>

      <GoogleOAuthProvider clientId={CLIENT_ID}>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error('No se pudo iniciar sesión con Google.')}
            text={text}
            shape="pill"
            locale="es"
            width="320"
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}
