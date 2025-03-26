import React from "react";
import { Search } from "lucide-react";

const FiltroSolicitacaoExames = ({ filtro, onFiltroChange }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl shadow-lg border border-indigo-100 p-6 transition-all duration-300 hover:shadow-xl">
        {/* Título */}
        <div className="flex items-center mb-4">
          <Search className="text-indigo-600 mr-3 animate-pulse" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">
            Pesquisar Solicitações de Exames
          </h3>
        </div>

        {/* Campo de Pesquisa */}
        <div className="relative">
          <input
            type="text"
            name="filtro"
            placeholder="Pesquisar por código, nome, descrição ou outras informações"
            value={filtro}
            onChange={onFiltroChange}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
          />
          {/* Ícone dentro do input */}
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Detalhe Decorativo */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default FiltroSolicitacaoExames;