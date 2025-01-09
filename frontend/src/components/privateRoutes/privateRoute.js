import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/authContext";
import { checkPermissoes } from "../../utils/checkPermissoes";

const PrivateRoute = ({ children, requiredPermissao, rolesPermissao }) => {
  const { user } = useAuthContext();
  // //console.log("User:", user); // Verifica o usuário
  // //console.log("Required Permissao:", requiredPermissao); // Verifica a permissão necessária
  // //console.log("Roles Permissao:", rolesPermissao); // Verifica a permissão necessária
  if (user === null) {
    // Se o usuário for null, não renderize nada até que o token seja carregado
    return <div>Loading...</div>;
  }

  // Se o usuário não estiver logado
  if (!user) {
    return <Navigate to="/" />;
  }

  // Verifique se o usuário tem a permissão necessária
  if (!checkPermissoes(user, requiredPermissao, rolesPermissao)) {
    return <Navigate to="/unauthorized" />;
  }

  // Caso passe na verificação de permissão, renderize o elemento
  return children;
};

export default PrivateRoute;
