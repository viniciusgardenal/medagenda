import React from "react";

const TabelaPlanoDeSaude = ({ planos, onEditar, onExcluir, onDetalhes }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Nome da Operadora</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Código do Plano</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Tipo do Plano</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">Ações</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {planos && planos.length > 0 ? (
          planos.map((plano) => (
            <tr key={plano.idPlanoSaude} className="hover:bg-blue-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-700">{plano.nomeOperadora || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{plano.codigoPlano || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{plano.tipoPlano || "N/A"}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    plano.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {plano.status || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm flex gap-3">
                <button
                  onClick={() => onDetalhes(plano)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Visualizar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onEditar(plano.idPlanoSaude)}
                  className="text-yellow-500 hover:text-yellow-700 transition-colors"
                  title="Editar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onExcluir(plano.idPlanoSaude)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Excluir"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4v12m4-12v12"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 text-sm">
              Nenhum plano de saúde encontrado após filtragem.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TabelaPlanoDeSaude;