import React from "react";

const ModalAddCheckIn = ({
  isOpen,
  onClose,
  consulta,
  dadosCheckIn,
  setDadosCheckIn,
  onSave,
}) => {
  if (!isOpen || !consulta) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosCheckIn((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm  flex items-center justify-center z-200">
      <div className="relative bg-white w-full max-w-2xl p-8 rounded-2xl shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-6">Registrar Check-In</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Paciente: <span className="font-semibold">{consulta.paciente.nome}</span>
            </p>
            <p className="text-sm text-gray-600">
              Médico: <span className="font-semibold">{consulta.profissionais.nome} {consulta.profissionais.sobrenome}</span>
            </p>
            <p className="text-sm text-gray-600">
              Horário: <span className="font-semibold">{new Date(consulta.horaChegada).toLocaleTimeString()}</span>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pressão Arterial</label>
            <input
              type="text"
              name="pressaoArterial"
              value={dadosCheckIn.pressaoArterial}
              onChange={handleChange}
              placeholder="Ex.: 120/80"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Temperatura (°C)</label>
            <input
              type="number"
              step="0.1"
              name="temperatura"
              value={dadosCheckIn.temperatura}
              onChange={handleChange}
              placeholder="Ex.: 36.5"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Peso (kg)</label>
            <input
              type="number"
              step="0.01"
              name="peso"
              value={dadosCheckIn.peso}
              onChange={handleChange}
              placeholder="Ex.: 75.50"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Altura (m)</label>
            <input
              type="number"
              step="0.01"
              name="altura"
              value={dadosCheckIn.altura}
              onChange={handleChange}
              placeholder="Ex.: 1.75"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Observações</label>
            <textarea
              name="observacoes"
              value={dadosCheckIn.observacoes}
              onChange={handleChange}
              placeholder="Digite observações adicionais"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Prioridade</label>
            <input
              type="number"
              name="prioridade"
              value={dadosCheckIn.prioridade}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddCheckIn;