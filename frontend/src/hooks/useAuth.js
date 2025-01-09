import { useAuthContext } from "../context/authContext";

export const useAuth = () => {
  const { user, login, logout } = useAuthContext();
  return { user, login, logout };
};
