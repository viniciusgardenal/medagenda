import React from "react";

const FiltroProfissionais = ({ filtro, onFiltroChange }) => {
  return (
    <div className="tipo-exame-form">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por nome, email, telefone ou tipo"
        value={filtro}
        onChange={onFiltroChange}
      />
    </div>
  );
};

export default FiltroProfissionais;
