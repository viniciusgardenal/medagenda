// src/pages/unauthorized/Unauthorized.js

import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/home"); // Retorna para a página anterior
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>403 - Acesso Negado</h1>
      <p>Você não tem permissão para acessar esta página.</p>
      <button
        onClick={handleGoBack}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Voltar para Home
      </button>
    </div>
  );
};

export default Unauthorized;
