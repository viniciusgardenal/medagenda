import React from 'react';
import { FaVial, FaUserMd, FaUserInjured, FaCalendarDay, FaClock, FaInfoCircle, FaAlignLeft } from "react-icons/fa";

const ModalDetalhesSolicitacaoExames = ({ isOpen, onClose, solicitacaoExames }) => {
  const formatarData = (dataStr) => {
    if (!dataStr) return "N/A";
    const data = new Date(dataStr);
    const dataCorrigida = new Date(data.valueOf() + data.getTimezoneOffset() * 60000);
    return dataCorrigida.toLocaleDateString('pt-BR');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <FaVial className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Detalhes da Solicitação de Exame</h3>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">&times;</button>
        {!solicitacaoExames ? <p>Carregando...</p> : (
          <div className="space-y-6">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="sm:col-span-2 border-b border-gray-200 pb-4">
                <dt className="text-sm font-semibold text-gray-900">Exame Solicitado</dt>
                <dd className="mt-1 text-lg text-gray-700">{solicitacaoExames.tipoExame?.nomeTipoExame || "N/A"}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaUserInjured className="h-4 w-4 text-blue-500" />Paciente</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{`${solicitacaoExames.paciente?.nome || ''} ${solicitacaoExames.paciente?.sobrenome || ''}`.trim() || "N/A"}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaUserMd className="h-4 w-4 text-blue-500" />Profissional Solicitante</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{solicitacaoExames.profissional?.nome || "N/A"}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaCalendarDay className="h-4 w-4 text-blue-500" />Data da Solicitação</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{formatarData(solicitacaoExames.dataSolicitacao)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaCalendarDay className="h-4 w-4 text-red-500" />Data de Retorno</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{formatarData(solicitacaoExames.dataRetorno)}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaClock className="h-4 w-4 text-blue-500" />Período</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">{solicitacaoExames.periodo || "N/A"}</dd>
              </div>
              <div>
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaInfoCircle className="h-4 w-4 text-blue-500" />Status</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${solicitacaoExames.status === "Ativo" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {solicitacaoExames.status === "Ativo" ? "Solicitado" : "Registrado"}
                    </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900"><FaAlignLeft className="h-4 w-4 text-blue-500" />Justificativa</dt>
                <dd className="mt-1 text-sm text-gray-700 pl-6 whitespace-pre-wrap">{solicitacaoExames.justificativa || "Nenhuma."}</dd>
              </div>
            </dl>
          </div>
        )}
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalhesSolicitacaoExames;