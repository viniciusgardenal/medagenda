// src/context/PermissaoContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

const PermissaoContext = createContext();

export const usePermissoes = () => {
  return useContext(PermissaoContext);
};

export const PermissaoProvider = ({ children }) => {
  const [permissoes, setPermissoes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setPermissoes(decoded.permissao);
    }
  }, []);

  return (
    <PermissaoContext.Provider value={{ permissoes }}>
      {children}
    </PermissaoContext.Provider>
  );
};
