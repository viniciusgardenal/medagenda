import React from "react";
import { X } from "lucide-react";

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
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          aria-label="Fechar modal"
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Título */}
        <h3 className="text-xl font-semibold text-blue-600 mb-4">
          Registrar Check-In
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Paciente */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
              {consulta.paciente.nome} {consulta.paciente.sobrenome}
            </p>
          </div>

          {/* Campos Vitais em Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pressão Arterial */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pressão Arterial <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pressaoArterial"
                value={dadosCheckIn.pressaoArterial}
                onChange={handleChange}
                placeholder="Ex: 120/80 mmHg"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Temperatura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperatura (°C) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="temperatura"
                value={dadosCheckIn.temperatura}
                onChange={handleChange}
                placeholder="Ex: 36.5"
                step="0.1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="peso"
                value={dadosCheckIn.peso}
                onChange={handleChange}
                placeholder="Ex: 70.0"
                step="0.1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Altura */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura (m) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="altura"
                value={dadosCheckIn.altura}
                onChange={handleChange}
                placeholder="Ex: 1.75"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={dadosCheckIn.observacoes}
              onChange={handleChange}
              placeholder="Digite observações adicionais, se necessário..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
            />
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridade <span className="text-red-500">*</span>
            </label>
            <select
              name="prioridade"
              value={dadosCheckIn.prioridade}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value={0}>Normal</option>
              <option value={1}>Média</option>
              <option value={2}>Alta</option>
            </select>
          </div>

          {/* Botões */}
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
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
