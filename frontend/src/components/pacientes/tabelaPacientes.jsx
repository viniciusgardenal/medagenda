import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const TabelaPacientes = ({ pacientes, onEditar, onExcluir, onDetalhes }) => {
  return (
    <table className="w-full text-left text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-3 font-medium">Nome Completo</th>
          <th className="px-4 py-3 font-medium">CPF</th>
          <th className="px-4 py-3 font-medium">Sexo</th>
          <th className="px-4 py-3 font-medium">Data de Nascimento</th>
          <th className="px-4 py-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {pacientes.map((paciente) => (
          <tr key={paciente.cpf} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">{paciente.nome} {paciente.sobrenome}</td>
            <td className="px-4 py-3">{paciente.cpf}</td>
            <td className="px-4 py-3">{paciente.sexo}</td>
            <td className="px-4 py-3">{paciente.dataNascimento}</td>
            <td className="px-4 py-3 flex space-x-2">
              <button
                onClick={() => onDetalhes(paciente.cpf)}
                title="Visualizar"
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEditar(paciente.cpf)}
                title="Editar"
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onExcluir(paciente.cpf)}
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

export default TabelaPacientes;