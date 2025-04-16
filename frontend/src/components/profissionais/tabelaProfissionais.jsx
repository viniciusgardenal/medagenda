import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const TabelaProfissionais = ({ profissionais, onEditar, onExcluir, onDetalhes }) => {
  return (
    <table className="w-full text-left text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-3 font-medium">Nome</th>
          <th className="px-4 py-3 font-medium">E-mail</th>
          <th className="px-4 py-3 font-medium">Telefone</th>
          <th className="px-4 py-3 font-medium">Profissional</th>
          <th className="px-4 py-3 font-medium">Data de Nascimento</th>
          <th className="px-4 py-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {profissionais.map((profissional) => (
          <tr key={profissional.matricula} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">{profissional.nome}</td>
            <td className="px-4 py-3">{profissional.email}</td>
            <td className="px-4 py-3">{profissional.telefone}</td>
            <td className="px-4 py-3">{profissional.tipoProfissional}</td>
            <td className="px-4 py-3">{profissional.dataNascimento}</td>
            <td className="px-4 py-3 flex space-x-2">
              <button
                onClick={() => onDetalhes(profissional.matricula)}
                title="Visualizar"
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEditar(profissional.matricula)}
                title="Editar"
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onExcluir(profissional.matricula)}
                title="Excluir"
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-5 w-5" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TabelaProfissionais;