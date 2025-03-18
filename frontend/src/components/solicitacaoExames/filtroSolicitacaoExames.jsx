import React from "react";

const FiltroSolicitacaoExames = ({ filtro, onFiltroChange }) => {
  return (
    <div className="flex items-left justify-start p-2 bg-white shadow-md rounded-lg max-w-md mx-auto">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar por código, nome, descrição..."
        value={filtro}
        onChange={onFiltroChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default FiltroSolicitacaoExames;
