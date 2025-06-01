import React from "react";
import TableHeader from "./TableHeader";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

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
          />
          <TableHeader
            label="Fabricante"
            field="nomeFabricante"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableHeader
            label="Controlado"
            field="controlado"
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <th className="px-6 py-2.5 text-left text-xs font-semibold uppercase tracking-wide">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {medicamentos.length === 0 ? (
          <tr>
            <td
              colSpan="4"
              className="px-6 py-2.5 text-center text-xs text-gray-600 font-medium leading-tight"
            >
              Nenhum medicamento encontrado após filtragem.
            </td>
          </tr>
        ) : (
          medicamentos.map((medicamento) => (
            <tr
              key={medicamento.idMedicamento}
              className="hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-3 text-xs text-gray-800 leading-tight">
                {medicamento.nomeMedicamento || "N/A"}
              </td>
              <td className="px-6 py-2.5 text-xs text-gray-800 leading-tight">
                {medicamento.nomeFabricante || "N/A"}
              </td>
              <td className="px-6 py-2.5 text-xs text-gray-800 leading-tight">
                {medicamento.controlado || "N/A"}
              </td>
              <td className="px-6 py-2.5 text-xs flex gap-2">
                <button
                  onClick={() => onDetalhes(medicamento.idMedicamento)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Ver Detalhes"
                >
                  <FaEye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEditar(medicamento.idMedicamento)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  title="Editar"
                >
                  <FaEdit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onExcluir(medicamento.idMedicamento)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Excluir"
                >
                  <FaTrash className="h-4 w-4" />
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