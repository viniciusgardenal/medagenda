import React from 'react';
import TableHeader from '../util/TableHeader';
import { Eye, Pencil, Trash2 } from 'lucide-react';

const TabelaPacientes = ({ pacientes, onEditar, onExcluir, onDetalhes, sortField, sortDirection, onSort }) => {
  return (
    <table className="min-w-full">
      <thead>
        <tr>
          <TableHeader label="Nome Completo" field="nome" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="CPF" field="cpf" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Sexo" field="sexo" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <TableHeader label="Data de Nascimento" field="dataNascimento" sortField={sortField} sortDirection={sortDirection} onSort={onSort} />
          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
            Ações
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {pacientes.length === 0 ? (
          <tr>
            <td colSpan="5" className="px-4 py-8 text-center text-slate-400 text-sm">
              Nenhum paciente encontrado.
            </td>
          </tr>
        ) : (
          pacientes.map((paciente) => (
            <tr key={paciente.cpf} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3.5 text-sm text-slate-700 font-medium">
                {paciente.nome} {paciente.sobrenome}
              </td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{paciente.cpf}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{paciente.sexo}</td>
              <td className="px-4 py-3.5 text-sm text-slate-600">{paciente.dataNascimento}</td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <button onClick={() => onDetalhes(paciente.cpf)} title="Visualizar" className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors">
                    <Eye size={15} />
                  </button>
                  <button onClick={() => onEditar(paciente.cpf)} title="Editar" className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => onExcluir(paciente.cpf)} title="Excluir" className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors">
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

export default TabelaPacientes;