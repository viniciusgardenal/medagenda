import React from "react";

const FiltroPacientes = ({ filtro, onFiltroChange }) => {
  return (
    <div className="pacientes-form">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por Nome, CPF, Data Nascimento"
        value={filtro}
        onChange={onFiltroChange}
      />
    </div>
  );
};

export default FiltroPacientes;
