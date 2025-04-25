import React, { useState, useEffect, useRef } from "react";
import { Eye, Edit, Trash, FileText } from "lucide-react";

const TabelaPlanoDeSaude = ({ planos, onEditar, onExcluir, onDetalhes }) => {
  const [isModalDetalhesOpen, setIsModalDetalhesOpen] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState(null);

  const handleVisualizar = (plano) => {
    setPlanoSelecionado(plano);
    setIsModalDetalhesOpen(true);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-sm">
        <table className="w-full text-left text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 font-medium">Nome da Operadora</th>
              <th className="px-4 py-3 font-medium">Código do Plano</th>
              <th className="px-4 py-3 font-medium">Tipo do Plano</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {planos && planos.length > 0 ? (
              planos.map((plano) => (
                <tr
                  key={plano.idPlanoSaude}
                  onClick={() => onDetalhes(plano)}
                  className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                >
                  <td className="px-4 py-3 truncate max-w-xs">
                    {plano.nomeOperadora || "N/A"}
                  </td>
                  <td className="px-4 py-3">{plano.codigoPlano || "N/A"}</td>
                  <td className="px-4 py-3">{plano.tipoPlano || "N/A"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        plano.status === "Ativo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {plano.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex space-x-2">
                    <div className="group relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDetalhes(plano);
                        }}
                        aria-label="Visualizar plano de saúde"
                        className="text-blue-600 hover:text-blue-800 transform hover:scale-110 transition-transform dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 dark:bg-gray-900">
                        Visualizar
                      </span>
                    </div>
                    <div className="group relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditar(plano.idPlanoSaude);
                        }}
                        aria-label="Editar plano de saúde"
                        className="text-gray-600 hover:text-gray-800 transform hover:scale-110 transition-transform"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2">
                        Editar
                      </span>
                    </div>
                    <div className="group relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onExcluir(plano.idPlanoSaude);
                        }}
                        aria-label="Excluir plano de saúde"
                        className="text-red-600 hover:text-red-800 transform hover:scale-110 transition-transform"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                      <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2">
                        Excluir
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TabelaPlanoDeSaude;
