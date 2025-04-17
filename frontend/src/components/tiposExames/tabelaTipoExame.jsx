import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const TabelaTiposExames = ({ tiposExames, onEditar, onExcluir, onDetalhes }) => {
  return (
    <table className="w-full text-left text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-3 font-medium">Nome do Exame</th>
          <th className="px-4 py-3 font-medium">Material Coletado</th>
          <th className="px-4 py-3 font-medium">Categoria</th>
          <th className="px-4 py-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {tiposExames.map((tipoExame) => (
          <tr key={tipoExame.idTipoExame} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3">{tipoExame.nomeTipoExame}</td>
            <td className="px-4 py-3">{tipoExame.materialColetado}</td>
            <td className="px-4 py-3">{tipoExame.categoria}</td>
            <td className="px-4 py-3 flex space-x-2">
              <button
                onClick={() => onDetalhes(tipoExame.idTipoExame)}
                title="Visualizar"
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="h-5 w-5" />
              </button>
              <button
                onClick={() => onEditar(tipoExame.idTipoExame)}
                title="Editar"
                className="text-gray-600 hover:text-gray-800"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onExcluir(tipoExame.idTipoExame)}
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

export default TabelaTiposExames;