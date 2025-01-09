import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import { checkPermissoes } from "../../utils/checkPermissoes";

const ProtectedRoute = ({ children, requiredPermissao, rolesPermissao }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <Navigate to="/" />;
  }

  // Verifique se o usuário tem a permissão necessária
  if (!checkPermissoes(user, requiredPermissao)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
