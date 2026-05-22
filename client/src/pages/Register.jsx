import { Navigate } from 'react-router-dom';

// El acceso es solo con Google: la cuenta se crea sola en el primer inicio de
// sesión, así que no existe un registro aparte. Redirigimos al login.
export default function Register() {
  return <Navigate to="/login" replace />;
}
