import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import XafariContext from "./XafariContext";
import { saveReturnTo } from "@/lib/returnTo";

/**
 * PrivateRoute — sin sesión manda a /login y guarda la ruta de origen
 * (p. ej. un QR /q/...) para volver a ella después del login o del registro.
 */
function PrivateRoute({ children }) {
  const { token } = useContext(XafariContext);
  const location = useLocation();

  if (!token) {
    const from = `${location.pathname}${location.search}`;
    saveReturnTo(from);
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return children;
}

export default PrivateRoute;
