import React from "react";

const FiltroMedicamentos = ({ filtro, onFiltroChange }) => {
  return (
    <div className="medicamentos-form">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por código, nome, descrição ou outras informações"
        value={filtro}
        onChange={onFiltroChange}
      />
    </div>
  );
};

export default FiltroMedicamentos;
