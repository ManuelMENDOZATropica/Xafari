import { Navigate } from "react-router-dom";

/**
 * PrivateRoute — redirige a '/' si no hay sesión activa (token).
 * Úsalo para envolver cualquier ruta que requiera autenticación.
 */
function PrivateRoute({ children }) {
  const token = (() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  })();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
