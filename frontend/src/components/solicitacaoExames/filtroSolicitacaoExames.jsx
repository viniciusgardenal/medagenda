import React from "react";

const FiltroSolicitacaoExames = ({ filtro, onFiltroChange }) => {
  return (
      <div className="flex flex-col space-y-2">
        <label htmlFor="filtro" className="text-sm font-medium text-green-700">
          Filtrar Solicitações
        </label>

        <div className="relative">
          {/* Ícone de Pesquisa */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Campo de Pesquisa */}
          <input
            type="text"
            id="filtro"
            name="filtro"
            placeholder="Pesquisar por código, nome, descrição..."
            value={filtro}
            onChange={onFiltroChange}
            className="w-full pl-10 pr-4 py-2.5 bg-green-50 border border-green-200 rounded-lg
                     text-sm text-gray-700 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                     transition-colors duration-200"
          />

          {/* Botão Limpar (aparece apenas quando houver texto) */}
          {filtro && (
            <button
              onClick={() => onFiltroChange({ target: { value: "" } })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Texto auxiliar */}
        <p className="text-xs text-gray-500 mt-1">
          Digite para filtrar as solicitações de exames
        </p>
      </div>
  );
};

export default FiltroSolicitacaoExames;
