// components/ModalAddCheckIn.jsx
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
    onSave(); // Chama handleSalvarCheckIn sem passar ID, pois é um novo check-in
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Registrar Check-In
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">
              Paciente:{" "}
              <span className="font-semibold">{consulta.paciente.nome}</span>
            </p>
            <p className="text-sm text-gray-600">
              Médico:{" "}
              <span className="font-semibold">
                {consulta.profissionais.nome} {consulta.profissionais.sobrenome}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Horário:{" "}
              <span className="font-semibold">
                {new Date(consulta.horaChegada).toLocaleTimeString()}
              </span>
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Pressão Arterial
            </label>
            <input
              type="text"
              name="pressaoArterial"
              value={dadosCheckIn.pressaoArterial}
              onChange={handleChange}
              placeholder="Ex.: 120/80"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Temperatura (°C)
            </label>
            <input
              type="number"
              step="0.1"
              name="temperatura"
              value={dadosCheckIn.temperatura}
              onChange={handleChange}
              placeholder="Ex.: 36.5"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.01"
              name="peso"
              value={dadosCheckIn.peso}
              onChange={handleChange}
              placeholder="Ex.: 75.50"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Altura (m)
            </label>
            <input
              type="number"
              step="0.01"
              name="altura"
              value={dadosCheckIn.altura}
              onChange={handleChange}
              placeholder="Ex.: 1.75"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Observações
            </label>
            <textarea
              name="observacoes"
              value={dadosCheckIn.observacoes}
              onChange={handleChange}
              placeholder="Digite observações adicionais"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Prioridade
            </label>
            <input
              type="number"
              name="prioridade"
              value={dadosCheckIn.prioridade}
              onChange={handleChange}
              min="0"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
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
