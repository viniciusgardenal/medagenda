import React from 'react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import TableHeader from '../util/TableHeader';

const TabelaProfissionais = ({ profissionais, onEditar, onExcluir, onDetalhes, sortField, sortDirection, onSort }) => {
  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <TableHeader label="Nome" field="nome" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="E-mail" field="email" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Telefone" field="telefone" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Profissional" field="tipoProfissional" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Data de Nascimento" field="dataNascimento" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">Ações</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {profissionais.length === 0 ? (
          <tr>
            <td colSpan="6" className="px-4 py-8 text-center text-slate-400 text-sm">
              Nenhum profissional cadastrado.
            </td>
          </tr>
        ) : (
          profissionais.map((profissional) => (
            <tr key={profissional.matricula} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 text-sm font-medium text-slate-700">{profissional.nome}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{profissional.email}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{profissional.telefone}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{profissional.tipoProfissional}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{profissional.dataNascimento}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDetalhes(profissional.matricula)}
                    title="Visualizar"
                    className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    onClick={() => onEditar(profissional.matricula)}
                    title="Editar"
                    className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => onExcluir(profissional.matricula)}
                    title="Excluir"
                    className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
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

export default TabelaProfissionais;