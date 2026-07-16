import React from "react";
import TableHeader from "../util/TableHeader";
import { Eye, Pencil, Trash2 } from "lucide-react";

const TabelaSolicitacaoExames = ({
  tse = [],
  onEditar,
  onExcluir,
  onDetalhes,
  sortField,
  sortDirection,
  onSort,
}) => {
  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "pendente") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-amber-200">
          Pendente
        </span>
      );
    }
    if (s === "realizado" || s === "concluido" || s === "concluído") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          Realizado
        </span>
      );
    }
    if (s === "cancelado") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 ring-1 ring-red-200">
          Cancelado
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 ring-1 ring-slate-200">
        {status || "—"}
      </span>
    );
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <TableHeader label="Exame" field="exame" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Paciente" field="paciente" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Período" field="periodo" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Solicitação" field="dataSolicitacao" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Retorno" field="dataRetorno" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Status" field="status" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {tse.length === 0 ? (
          <tr>
            <td colSpan="7" className="px-4 py-8 text-center text-slate-400 text-sm">
              Nenhuma solicitação encontrada.
            </td>
          </tr>
        ) : (
          tse.map((se) => (
            <tr
              key={se?.idSolicitacaoExame}
              className="hover:bg-slate-50 transition-colors"
            >
              <td className="px-4 py-3.5 text-sm text-slate-600">
                {se?.tipoExame?.nomeTipoExame || se?.nomeTipoExame || "—"}
              </td>
              <td className="px-4 py-3.5 text-sm font-medium text-slate-700">
                {se?.paciente?.nome || ""} {se?.paciente?.sobrenome || ""}
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-600">
                {se?.periodo || "—"}
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-600">
                {se?.dataSolicitacao || "—"}
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-600">
                {se?.dataRetorno || "—"}
              </td>
              <td className="px-4 py-3.5 text-sm">
                {renderStatusBadge(se?.status)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDetalhes(se?.idSolicitacaoExame)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Detalhes"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEditar(se?.idSolicitacaoExame)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onExcluir(se?.idSolicitacaoExame)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
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

export default TabelaSolicitacaoExames;
