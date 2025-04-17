import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const TabelaPlanoDeSaude = ({ planos, onEditar, onExcluir, onDetalhes }) => {
  return (
    <table className="w-full text-left text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-3 font-medium">Nome do Plano de Saúde</th>
          <th className="px-4 py-3 font-medium">Descrição</th>
          <th className="px-4 py-3 font-medium">Tipo do Plano</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        {planos && planos.length > 0 ? (
          planos.map((plano) => (
            <tr key={plano.idPlanoDeSaude} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-4 py-3">{plano.nomePlanoDeSaude}</td>
              <td className="px-4 py-3">{plano.descricao}</td>
              <td className="px-4 py-3">{plano.tipoPlanoDeSaude}</td>
              <td className="px-4 py-3">{plano.status}</td>
              <td className="px-4 py-3 flex space-x-2">
                <button
                  onClick={() => onDetalhes(plano.idPlanoDeSaude)}
                  title="Visualizar"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEditar(plano.idPlanoDeSaude)}
                  title="Editar"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onExcluir(plano.idPlanoDeSaude)}
                  title="Excluir"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
              Nenhum plano de saúde encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TabelaPlanoDeSaude;