import React from "react";
import TableHeader from "./TableHeader";

const TabelaMedicamentos = ({
  medicamentos,
  onExcluir,
  onEditar,
  onDetalhes,
  sortField,
  sortDirection,
  onSort,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-blue-600 text-white">
        <tr>
          <TableHeader
            label="Nome do Medicamento"
            field="nomeMedicamento"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
          />
          <TableHeader
            label="Fabricante"
            field="nomeFabricante"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
          />
          <TableHeader
            label="Controlado"
            field="controlado"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider"
          />
          <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {medicamentos.length === 0 ? (
          <tr>
            <td
              colSpan="4"
              className="px-6 py-4 text-center text-gray-500 text-sm"
            >
              Nenhum medicamento encontrado após filtragem.
            </td>
          </tr>
        ) : (
          medicamentos.map((medicamento) => (
            <tr
              key={medicamento.idMedicamento}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="px-6 py-4 text-sm text-gray-700">
                {medicamento.nomeMedicamento || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {medicamento.nomeFabricante || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {medicamento.controlado || "N/A"}
              </td>
              <td className="px-6 py-4 text-sm flex gap-3">
                <button
                  onClick={() => onDetalhes(medicamento.idMedicamento)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Ver Detalhes"
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
                  onClick={() => onEditar(medicamento.idMedicamento)}
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
                  onClick={() => onExcluir(medicamento.idMedicamento)}
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
        )}
      </tbody>
    </table>
  );
};

export default TabelaMedicamentos;