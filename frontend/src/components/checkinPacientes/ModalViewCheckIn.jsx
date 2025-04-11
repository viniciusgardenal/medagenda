import React from "react";

const ModalViewCheckIn = ({ isOpen, onClose, checkIn }) => {
  if (!isOpen || !checkIn) return null;

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
        <h3 className="text-2xl font-bold text-blue-600 mb-6">Detalhes do Check-In</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">ID Consulta:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {checkIn.consultaId}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Hora de Chegada:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {new Date(checkIn.horaChegada).toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Pressão Arterial:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {checkIn.pressaoArterial || "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Temperatura:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {checkIn.temperatura ? `${checkIn.temperatura} °C` : "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Peso:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {checkIn.peso ? `${checkIn.peso} kg` : "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Altura:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {checkIn.altura ? `${checkIn.altura} m` : "Não informado"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Observações:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm min-h-[100px] whitespace-pre-wrap">
              {checkIn.observacoes || "Nenhuma observação"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Prioridade:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {(() => {
                switch (checkIn.prioridade) {
                  case 0:
                    return "Normal";
                  case 1:
                    return "Média";
                  case 2:
                    return "Alta";
                  default:
                    return "Não informado";
                }
              })()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {checkIn.status}
            </p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Registrado por:</label>
            <p className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700 text-sm">
              {checkIn.profissional?.nome || "Profissional ID: " + checkIn.profissionalId}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewCheckIn;