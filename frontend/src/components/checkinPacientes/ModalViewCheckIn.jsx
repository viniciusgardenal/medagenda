import React from "react";

const ModalViewCheckIn = ({ isOpen, onClose, checkIn }) => {
  if (!isOpen || !checkIn) return null;

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
        <h3 className="text-2xl font-bold text-blue-600 mb-6">Detalhes do Check-In</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">ID Consulta:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.consultaId}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Hora de Chegada:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {new Date(checkIn.horaChegada).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Pressão Arterial:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.pressaoArterial || "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Temperatura:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.temperatura ? `${checkIn.temperatura} °C` : "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Peso:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.peso ? `${checkIn.peso} kg` : "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Etiqueta ausente</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.altura ? `${checkIn.altura} m` : "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Observações:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm min-h-[120px] whitespace-pre-wrap">
              {checkIn.observacoes || "Nenhuma observação"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Prioridade:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.prioridade}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.status}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Registrado por:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm">
              {checkIn.profissional?.nome || "Profissional ID: " + checkIn.profissionalId}
            </p>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewCheckIn;