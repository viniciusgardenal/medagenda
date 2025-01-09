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
    <div className="form-group">
      <label>Médico:</label>
      <input
        type="text"
        name="ProfissionalCRM"
        value={`${user?.nome || "Nome não disponível"} (CRM: ${
          user?.crm || "CRM não disponível"
        })`}
        readOnly // Torna o campo somente leitura
        required
      />
    </div>
  );
};

export default ReceitaForm;
