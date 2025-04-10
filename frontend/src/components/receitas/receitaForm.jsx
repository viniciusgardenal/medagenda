import { useAuthContext } from "../../context/authContext";
import React, { useEffect } from "react";

const ReceitaForm = ({ onMatriculaChange }) => {
  const { user } = useAuthContext();

  // Envia a matrícula para o componente pai
  useEffect(() => {
    if (user?.id && onMatriculaChange) {
      onMatriculaChange(user.id);
    }
  }, [user, onMatriculaChange]);

  return (
    <div className="space-y-2">
      <input
        type="text"
        name="ProfissionalCRM"
        value={`${user?.nome || "Nome não disponível"} (CRM: ${
          user?.crm || "CRM não disponível"
        })`}
        readOnly
        disabled
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 text-sm cursor-not-allowed shadow-sm"
        required
      />
    </div>
  );
};

export default ReceitaForm;
