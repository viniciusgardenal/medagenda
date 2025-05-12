import React from "react";

const ModalViewAtendimento = ({
  isOpen,
  onClose,
  atendimento,
  formatarDataHoraBR,
}) => {
  if (!isOpen || !atendimento) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Detalhes do Atendimento
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Paciente
            </label>
            <p className="text-sm text-gray-600">
              {atendimento.paciente.nome} {atendimento.paciente.sobrenome}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Médico
            </label>
            <p className="text-sm text-gray-600">
              {atendimento.medico.nome} (CRM: {atendimento.medico.crm})
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Tipo de Consulta
            </label>
            <p className="text-sm text-gray-600">
              {atendimento.tipoConsulta?.nomeTipoConsulta || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Data e Hora
            </label>
            <p className="text-sm text-gray-600">
              {formatarDataHoraBR(
                atendimento.dataAtendimento.split("T")[0],
                atendimento.dataAtendimento.split("T")[1]
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Diagnóstico
            </label>
            <p className="text-sm text-gray-600">
              {atendimento.diagnostico || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Prescrição
            </label>
            <p className="text-sm text-gray-600">
              {atendimento.prescricao || "N/A"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Observações
            </label>
            <p className="text-sm text-gray-600">
              {atendimento.observacoes || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewAtendimento;