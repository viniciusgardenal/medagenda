import React from "react";

const FiltroCheckIn = ({ onFiltroChange, defaultDate }) => {
  const [filtroNome, setFiltroNome] = React.useState("");
  const [filtroData, setFiltroData] = React.useState(defaultDate);

  React.useEffect(() => {
    onFiltroChange({ filtroNome, filtroData });
  }, [filtroNome, filtroData, onFiltroChange]);

  return (
    <div className="space-y-1 mb-6">
      <label className="text-sm font-medium text-gray-600 block">
        Buscar por nome ou data da consulta
      </label>
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="relative w-full md:w-1/2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </span>
          <input
            type="text"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            placeholder="Nome do paciente"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
        <div className="w-full md:w-1/2">
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 text-sm"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500">
        Pressione Enter para refinar a busca.
      </p>
    </div>
  );
};

export default FiltroCheckIn;