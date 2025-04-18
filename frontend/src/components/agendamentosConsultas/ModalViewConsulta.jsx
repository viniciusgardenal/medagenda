import React from "react";

const ModalViewConsulta = ({
  isOpen,
  onClose,
  consulta,
  formatarDataHoraBR,
}) => {
  if (!isOpen || !consulta) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Detalhes da Consulta
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Paciente:
            </label>
            <p className="text-sm text-gray-600">
              {consulta.paciente.nome} {consulta.paciente.sobrenome}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Médico:
            </label>
            <p className="text-sm text-gray-600">
              {consulta.medico.nome} {consulta.medico.sobrenome}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Tipo de Consulta:
            </label>
            <p className="text-sm text-gray-600">
              {consulta.tipoConsulta.nome}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Data e Hora:
            </label>
            <p className="text-sm text-gray-600">
              {formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Motivo:
            </label>
            <p className="text-sm text-gray-600">{consulta.motivo}</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Responsável pelo Agendamento:
            </label>
            <p className="text-sm text-gray-600">
              {consulta.responsavelAgendamento}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Status:
            </label>
            <p className="text-sm text-gray-600">{consulta.status}</p>
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

export default ModalViewConsulta;
