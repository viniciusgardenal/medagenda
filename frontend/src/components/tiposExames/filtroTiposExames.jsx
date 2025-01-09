// FiltroTiposExames.js
import React from "react";

const FiltroTiposExames = ({ filtro, onFiltroChange }) => {
  return (
    <div className="tipo-exame-form">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por nome, material, tempo de jejum, observação ou categoria"
        value={filtro}
        onChange={onFiltroChange}
      />
    </div>
  );
};

export default FiltroTiposExames;
