import { useAuthContext } from "../../context/authContext";
import React, { useEffect } from "react";

const ReceitaForm = ({ onMatriculaChange }) => {
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.id && onMatriculaChange) {
      onMatriculaChange(user.id);
    }
  }, [user, onMatriculaChange]);

  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-600 mb-1">
        Profissional
      </label>
      <input
        type="text"
        name="ProfissionalCRM"
        value={`${user?.nome || "Nome não disponível"} (CRM: ${
          user?.crm || "CRM não disponível"
        })`}
        readOnly
        className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded-md"
      />
    </div>
  );
};

export default ReceitaForm;