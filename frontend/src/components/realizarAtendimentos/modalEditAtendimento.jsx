import React from "react";

const ModalEditAtendimento = ({
  isOpen,
  onClose,
  atendimento,
  dadosAtendimento,
  setDadosAtendimento,
  onSave,
  formatarDataHoraBR,
}) => {
  if (!isOpen || !atendimento) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosAtendimento({ ...dadosAtendimento, [name]: value });
  };

  const BUTTON_CLASSES = {
    primary:
      "px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700",
    secondary:
      "px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300",
    disabled:
      "px-4 py-2 text-sm font-semibold text-white bg-gray-400 rounded-md cursor-not-allowed",
  };

  const isFormValid = () => {
    return (
      dadosAtendimento.diagnostico.trim() !== "" ||
      dadosAtendimento.prescricao.trim() !== "" ||
      dadosAtendimento.observacoes.trim() !== ""
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Editar Atendimento
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
            <label
              htmlFor="diagnostico"
              className="block text-sm font-semibold text-gray-700"
            >
              Diagnóstico
            </label>
            <textarea
              id="diagnostico"
              name="diagnostico"
              value={dadosAtendimento.diagnostico}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="4"
              placeholder="Digite o diagnóstico do paciente"
            />
          </div>
          <div>
            <label
              htmlFor="prescricao"
              className="block text-sm font-semibold text-gray-700"
            >
              Prescrição
            </label>
            <textarea
              id="prescricao"
              name="prescricao"
              value={dadosAtendimento.prescricao}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="4"
              placeholder="Digite a prescrição (medicamentos, tratamentos)"
            />
          </div>
          <div>
            <label
              htmlFor="observacoes"
              className="block text-sm font-semibold text-gray-700"
            >
              Observações
            </label>
            <textarea
              id="observacoes"
              name="observacoes"
              value={dadosAtendimento.observacoes}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows="4"
              placeholder="Digite observações adicionais"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className={BUTTON_CLASSES.secondary}>
            Cancelar
          </button>
          <button
            onClick={onSave}
            disabled={!isFormValid()}
            className={
              isFormValid() ? BUTTON_CLASSES.primary : BUTTON_CLASSES.disabled
            }
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditAtendimento;