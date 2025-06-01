import React from "react";

const FiltroMedicamentos = ({ filtro, onFiltroChange }) => {
  return (
    <input
      type="text"
      value={filtro}
      onChange={onFiltroChange}
      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      placeholder="Filtrar por nome, fabricante ou descrição"
    />
  );
};

export default FiltroMedicamentos;