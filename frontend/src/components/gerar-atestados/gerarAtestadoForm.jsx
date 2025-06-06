// src/components/gerar-atestados/gerarAtestadoForm.jsx

import React, { useEffect } from "react";
import { useAuthContext } from "../../context/authContext";
import { FaUserMd } from "react-icons/fa";

const AtestadoForm = ({ onMatriculaChange }) => {
  const { user } = useAuthContext();

  // Envia a matrícula para o componente pai quando o usuário for carregado
  useEffect(() => {
    if (user?.id) {
      onMatriculaChange(user.id);
    }
  }, [user?.id, onMatriculaChange]); // Dependência mais estável

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <FaUserMd className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        name="matriculaProfissional"
        value={
          user?.id
            ? `${user.nome || "Nome não disponível"} (Matrícula: ${user.id})`
            : "Nenhum profissional autenticado"
        }
        readOnly
        className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-base text-gray-700 cursor-not-allowed focus:outline-none"
      />
    </div>
  );
};

export default AtestadoForm;