import React from "react";

const FiltroMedicamentos = ({ filtro, onFiltroChange }) => {
  return (
    <div className="medicamentos-form">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por Nome Medicamento, Fabricante, Descrição"
        value={filtro}
        onChange={onFiltroChange}
      />
    </div>
  );
};

export default FiltroMedicamentos;
