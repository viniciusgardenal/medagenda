import React, { useEffect } from "react";
import { useAuthContext } from "../../context/authContext";

const AtestadoForm = ({ onMatriculaChange }) => {
  const { user } = useAuthContext();

  // Envia a matrícula para o componente pai quando o usuário estiver autenticado
  useEffect(() => {
    if (user?.id && onMatriculaChange) {
      onMatriculaChange(user.id); // Passa a matrícula (id do profissional) para o componente pai
    }
  }, [user, onMatriculaChange]);

  return (
    <div className="space-y-2">
      <label className="block text-base font-semibold text-gray-700 mb-2">
        Profissional (Autenticado)
      </label>
      <input
        type="text"
        name="matriculaProfissional"
        value={
          user?.id
            ? `${user.nome || "Nome não disponível"} (Matrícula: ${user.id})`
            : "Nenhum profissional autenticado"
        }
        readOnly
        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-base text-gray-700 cursor-not-allowed focus:outline-none"
      />
    </div>
  );
};

export default AtestadoForm;