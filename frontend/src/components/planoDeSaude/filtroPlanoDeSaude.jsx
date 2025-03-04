import React from "react";

const FiltroPlanoDeSaude = ({ filtro, onFiltroChange }) => {
  return (
    <div className="plano-de-saude-form">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por Nome, Descrição, Tipo, Status"
        value={filtro}
        onChange={onFiltroChange}
      />
    </div>
  );
};

export default FiltroPlanoDeSaude;
