// ModalAddAtendimento.jsx

const ModalAddAtendimento = ({
  isOpen,
  onClose,
  consulta, // A consulta para a qual estamos adicionando um atendimento
  dadosAtendimento,
  setDadosAtendimento,
  onSave,
  formatarDataHoraBR, // A função de formatação vinda do pai
}) => {
  if (!isOpen || !consulta) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosAtendimento({ ...dadosAtendimento, [name]: value });
  };

  // Classes para os botões (boa prática para consistência)
  const BUTTON_CLASSES = {
    primary:
      "px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700",
    secondary:
      "px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300",
    disabled:
      "px-4 py-2 text-sm font-semibold text-white bg-gray-400 rounded-md cursor-not-allowed",
  };

  // Validação simples para habilitar o botão de salvar
  const isFormValid = () => {
    return (
      dadosAtendimento.diagnostico?.trim() !== "" ||
      dadosAtendimento.prescricao?.trim() !== "" ||
      dadosAtendimento.observacoes?.trim() !== ""
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Registrar Atendimento
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Paciente
            </label>
            <p className="text-sm text-gray-600">
              {consulta.paciente?.nome} {consulta.paciente?.sobrenome}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Data e Hora da Consulta
            </label>
            <p className="text-sm text-gray-600">
              {/* AJUSTE AQUI: Chamar formatarDataHoraBR com um argumento */}
              {formatarDataHoraBR(
                `${consulta.dataConsulta}T${consulta.horaConsulta}`
              )}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Motivo da Consulta
            </label>
            <p className="text-sm text-gray-600">{consulta.motivo}</p>
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
              value={dadosAtendimento.diagnostico || ""} // Garante que o valor seja controlado
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
              value={dadosAtendimento.prescricao || ""} // Garante que o valor seja controlado
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
              value={dadosAtendimento.observacoes || ""} // Garante que o valor seja controlado
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
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddAtendimento;
