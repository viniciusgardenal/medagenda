import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import TableHeader from '../util/TableHeader';

const TabelaTiposExames = ({ tiposExames, onEditar, onExcluir, onDetalhes, sortField, sortDirection, onSort }) => {
  return (
    <table className="min-w-full bg-white">
      <thead>
        <tr>
          <TableHeader label="Nome do Exame" field="nomeTipoExame" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Material Coletado" field="materialColetado" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Categoria" field="categoria" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {tiposExames.length === 0 ? (
          <tr>
            <td colSpan="4" className="px-4 py-8 text-center text-slate-400 text-sm">
              Nenhum tipo de exame encontrado.
            </td>
          </tr>
        ) : (
          tiposExames.map((tipoExame) => (
            <tr key={tipoExame.idTipoExame} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{tipoExame.nomeTipoExame}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{tipoExame.materialColetado}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{tipoExame.categoria}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDetalhes(tipoExame.idTipoExame)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                    title="Visualizar"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEditar(tipoExame.idTipoExame)}
                    className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onExcluir(tipoExame.idTipoExame)}
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

export default TabelaTiposExames;