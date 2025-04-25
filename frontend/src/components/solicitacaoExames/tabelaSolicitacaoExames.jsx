import React from "react";

const TabelaSolicitacaoExames = ({
  tse = [],
  onEditar,
  onExcluir,
  onDetalhes,
}) => {
  // console.log(tse);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">
              Exame
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Paciente
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Período
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Solicitação
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Retorno
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold rounded-tr-lg">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tse.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                Nenhuma solicitação encontrada.
              </td>
            </tr>
          ) : (
            tse.map((se) => (
              <tr
                key={se?.tipoExame?.idTipoExame}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {se?.tipoExame?.nomeTipoExame || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {se?.paciente?.nome || ""} {se?.Paciente?.sobrenome || ""}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {se?.periodo || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {se?.dataSolicitacao || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {se?.dataRetorno || "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {se?.status || "—"}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  <button
                    onClick={() => onDetalhes(se?.idSolicitacaoExame)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Detalhes"
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
                        d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onEditar(se?.idSolicitacaoExame)}
                    className="text-green-500 hover:text-green-700"
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
                    onClick={() => onExcluir(se?.idSolicitacaoExame)}
                    className="text-red-500 hover:text-red-700"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M3 7h18"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const EyeIcon = () => (
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
      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EditIcon = () => (
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
);

const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

export default TabelaSolicitacaoExames;
