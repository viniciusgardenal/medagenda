import React from "react";

const FiltroSolicitacaoExames = ({ filtro, onFiltroChange }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        name="filtro"
        placeholder="Pesquisar solicitação..."
        value={filtro}
        onChange={onFiltroChange}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 text-sm shadow-sm transition-all duration-150"
      />
    </div>
  );
};

export default FiltroSolicitacaoExames;