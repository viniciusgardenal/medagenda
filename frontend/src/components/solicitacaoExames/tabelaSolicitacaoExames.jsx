import React from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

const TabelaSolicitacaoExames = ({ tse, onEditar, onExcluir, onDetalhes }) => {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Nome do Exame
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Nome Paciente
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Período
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Data de Solicitação
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Data de Retorno
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Justificativa
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tse.map((se) => (
            <tr key={se.idSolicitacaoExame} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-700">{se.tiposExame.nomeTipoExame}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {se.Paciente.nome} {se.Paciente.sobrenome}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">{se.periodo}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{se.dataSolicitacao}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{se.dataRetorno}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{se.justificativa}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{se.status}</td>
              <td className="px-6 py-4 text-sm text-gray-700 flex space-x-2">
                <button
                  onClick={() => onDetalhes(se.idSolicitacaoExame)}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEditar(se.idSolicitacaoExame)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onExcluir(se.idSolicitacaoExame)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-150"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TabelaSolicitacaoExames;