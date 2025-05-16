import React, { useState } from "react";
import { X } from "lucide-react";

const ModalCancelConsulta = ({
  isOpen,
  onClose,
  consulta,
  onConfirm,
  formatarDataHoraBR,
}) => {
  const [motivoCancelamento, setMotivoCancelamento] = useState("");
  const [isJustificationDisabled, setIsJustificationDisabled] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !consulta) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isJustificationDisabled && !motivoCancelamento.trim()) {
      setError("Por favor, forneça um motivo para o cancelamento.");
      return;
    }
    onConfirm(isJustificationDisabled ? null : motivoCancelamento);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          Cancelar Consulta
        </h3>

        <div className="space-y-2 mb-4">
          <p className="text-sm text-gray-700">
            <strong>Paciente:</strong> {consulta.paciente.nome}{" "}
            {consulta.paciente.sobrenome}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Médico:</strong> {consulta.medico.nome} (CRM:{" "}
            {consulta.medico.crm})
          </p>
          <p className="text-sm text-gray-700">
            <strong>Data e Hora:</strong>{" "}
            {formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="disableJustification"
              checked={isJustificationDisabled}
              onChange={(e) => setIsJustificationDisabled(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="disableJustification"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              Desabilitar justificativa
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Motivo do Cancelamento{" "}
              {!isJustificationDisabled && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <textarea
              value={motivoCancelamento}
              onChange={(e) => setMotivoCancelamento(e.target.value)}
              placeholder="Digite o motivo do cancelamento..."
              disabled={isJustificationDisabled}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px] ${
                isJustificationDisabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
            />
          </div>

          {error && (
            <div className="p-2 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Confirmar Cancelamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCancelConsulta;
