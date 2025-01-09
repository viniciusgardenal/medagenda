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
    <div className="form-group">
      <label>Profissional:</label>
      <input
        type="text"
        name="matriculaProfissional"
        value={`${user?.nome || "Nome não disponível"} (Matrícula: ${
          user?.id || "Matrícula não disponível"
        })`}
        readOnly // Torna o campo somente leitura
        required
      />
    </div>
  );
};

export default AtestadoForm;
