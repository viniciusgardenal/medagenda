import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const TableHeader = ({ label, field, sortField, sortDirection, onSort }) => {
  const isActive = sortField === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap transition-colors bg-slate-800 text-slate-200 hover:bg-slate-700"
    >
      <div className="flex items-center gap-1.5">
        <span>{label}</span>
        <span className="flex flex-col -space-y-0.5">
          <ChevronUp size={10} className={isActive && sortDirection === "asc" ? "text-white" : "text-slate-600"} />
          <ChevronDown size={10} className={isActive && sortDirection === "desc" ? "text-white" : "text-slate-600"} />
        </span>
      </div>
    </th>
  );
};

const TabelaMedicamentos = ({ medicamentos, onExcluir, onEditar, onDetalhes, sortField, sortDirection, onSort }) => {
  const controlledBadge = (value) => {
    const v = (value || "").toLowerCase();
    if (v === "sim" || v === "s") return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 ring-1 ring-red-200">Sim</span>;
    if (v === "não" || v === "nao" || v === "n") return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 ring-1 ring-slate-200">Não</span>;
    return <span className="text-slate-500 text-sm">{value || "—"}</span>;
  };

  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <TableHeader label="Nome do Medicamento" field="nomeMedicamento" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Fabricante" field="nomeFabricante" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Controlado" field="controlado" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {medicamentos.length === 0 ? (
          <tr>
            <td colSpan="4" className="px-4 py-8 text-center text-slate-400 text-sm">
              Nenhum medicamento encontrado.
            </td>
          </tr>
        ) : (
          medicamentos.map((medicamento) => (
            <tr key={medicamento.idMedicamento} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 text-sm text-slate-700 font-medium">
                {medicamento.nomeMedicamento || "—"}
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-600">
                {medicamento.nomeFabricante || "—"}
              </td>
              <td className="px-4 py-3.5">
                {controlledBadge(medicamento.controlado)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onDetalhes(medicamento.idMedicamento)} className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors" title="Ver detalhes">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => onEditar(medicamento.idMedicamento)} className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Editar">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onExcluir(medicamento.idMedicamento)} className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors" title="Excluir">
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default TabelaMedicamentos;