import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import TableHeader from "../util/TableHeader";

const TabelaPlanoDeSaude = ({ planos, onEditar, onExcluir, onDetalhes, sortField, sortDirection, onSort }) => {
  const renderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "ativo") {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
          Ativo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500 ring-1 ring-slate-200">
        {status || "Inativo"}
      </span>
    );
  };

  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <TableHeader label="Nome da Operadora" field="nomeOperadora" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Código do Plano" field="codigoPlano" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Tipo do Plano" field="tipoPlano" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Status" field="status" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {planos && planos.length > 0 ? (
          planos.map((plano) => (
            <tr key={plano.idPlanoSaude} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{plano.nomeOperadora || "N/A"}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{plano.codigoPlano || "N/A"}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{plano.tipoPlano || "N/A"}</td>
              <td className="px-4 py-3.5 text-sm">
                {renderStatusBadge(plano.status)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDetalhes(plano)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Visualizar"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEditar(plano.idPlanoSaude)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onExcluir(plano.idPlanoSaude)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-4 py-8 text-center text-slate-400 text-sm">
              Nenhum plano de saúde encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TabelaPlanoDeSaude;