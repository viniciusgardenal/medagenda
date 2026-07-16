import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import TableHeader from '../util/TableHeader';

const TabelaTipoConsulta = ({ tpc, onEditar, onExcluir, onDetalhes, sortField, sortDirection, onSort }) => {
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
          <TableHeader label="Nome da Consulta" field="nomeTipoConsulta" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Descrição" field="descricao" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Prioridade" field="prioridade" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Status" field="status" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {tpc.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-4 py-8 text-center text-slate-400 text-sm">
              Nenhum tipo de consulta encontrado.
            </td>
          </tr>
        ) : (
          tpc.map((tipoConsulta) => (
            <tr key={tipoConsulta.idTipoConsulta} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{tipoConsulta.nomeTipoConsulta}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{tipoConsulta.descricao}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{tipoConsulta.prioridade}</td>
              <td className="px-4 py-3.5 text-sm">
                {renderStatusBadge(tipoConsulta.status)}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDetalhes(tipoConsulta.idTipoConsulta)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Visualizar"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEditar(tipoConsulta.idTipoConsulta)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onExcluir(tipoConsulta.idTipoConsulta)}
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

export default TabelaTipoConsulta;