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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded-2xl shadow-md">
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ID Consulta
            </label>
            <input
              type="text"
              value={consulta.id}
              disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Paciente
            </label>
            <input
              type="text"
              value={consulta.paciente.nome}
              disabled
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pressão Arterial
            </label>
            <input
              type="text"
              name="pressaoArterial"
              value={dadosCheckIn.pressaoArterial}
              onChange={handleChange}
              placeholder="Ex: 120/80"
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Temperatura (°C)
            </label>
            <input
              type="number"
              name="temperatura"
              value={dadosCheckIn.temperatura}
              onChange={handleChange}
              placeholder="Ex: 36.5"
              step="0.1"
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              name="peso"
              value={dadosCheckIn.peso}
              onChange={handleChange}
              placeholder="Ex: 70"
              step="0.1"
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Altura (m)
            </label>
            <input
              type="number"
              name="altura"
              value={dadosCheckIn.altura}
              onChange={handleChange}
              placeholder="Ex: 1.75"
              step="0.01"
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={dadosCheckIn.observacoes}
              onChange={handleChange}
              placeholder="Digite observações adicionais..."
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Prioridade
            </label>
            <select
              name="prioridade"
              value={dadosCheckIn.prioridade}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Normal</option>
              <option value={1}>Média</option>
              <option value={2}>Alta</option>
            </select>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAddCheckIn;