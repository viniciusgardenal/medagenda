import React from "react";

const FiltroPlanoDeSaude = ({ filtro, onFiltroChange }) => {
  return (
    <div className="plano-de-saude-form">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por nome do plano, tipo do plano, status"
        value={filtro}
        onChange={onFiltroChange}
      />
    </div>
  );
};

export default FiltroPlanoDeSaude;
