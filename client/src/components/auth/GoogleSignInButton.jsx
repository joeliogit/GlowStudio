import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { googleLogin } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ROLE_REDIRECTS = { admin: '/admin', receptionist: '/reception', client: '/' };

/**
 * Botón "Iniciar sesión con Google" — único método de acceso. El rol (cliente,
 * recepción o admin) lo decide el backend a partir del correo, y aquí se
 * redirige al panel correspondiente según ese rol.
 *
 * @param {{ text?: 'signin_with' | 'signup_with' | 'continue_with' }} props
 */
export default function GoogleSignInButton({ text = 'continue_with' }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sin Client ID configurado no se puede iniciar sesión.
  if (!CLIENT_ID) {
    return (
      <p className="text-center text-sm text-gray-500">
        El inicio de sesión con Google no está configurado.
      </p>
    );
  }

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
  );
}
