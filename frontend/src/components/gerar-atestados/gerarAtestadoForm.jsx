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
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700 font-semibold text-sm">
        Profissional:
      </label>
      <input
        type="text"
        name="matriculaProfissional"
        value={`${user?.nome || "Nome não disponível"} (Matrícula: ${
          user?.id || "Matrícula não disponível"
        })`}
        readOnly
        required
        className="border border-gray-300 rounded-md p-1.5 text-gray-700 text-sm bg-gray-100 cursor-not-allowed"
      />
    </div>
  );
};

export default AtestadoForm;