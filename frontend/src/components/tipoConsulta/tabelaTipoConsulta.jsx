import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const TabelaTipoConsulta = ({ tpc, onEditar, onExcluir, onDetalhes }) => {
  return (
    <table className="w-full text-left text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-3 font-medium">Nome da Consulta</th>
          <th className="px-4 py-3 font-medium">Descrição</th>
          <th className="px-4 py-3 font-medium">Prioridade</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {tpc.map((tipoConsulta) => (
          <tr key={tipoConsulta.idTipoConsulta} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">{tipoConsulta.nomeTipoConsulta}</td>
            <td className="px-4 py-3">{tipoConsulta.descricao}</td>
            <td className="px-4 py-3">{tipoConsulta.prioridade}</td>
            <td className="px-4 py-3">{tipoConsulta.status}</td>
            <td className="px-4 py-3 flex space-x-2">
              <button
                onClick={() => onDetalhes(tipoConsulta.idTipoConsulta)}
                title="Visualizar"
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEditar(tipoConsulta.idTipoConsulta)}
                title="Editar"
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onExcluir(tipoConsulta.idTipoConsulta)}
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

export default TabelaTipoConsulta;