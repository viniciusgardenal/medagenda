import React from "react";
import { X } from "lucide-react";

const ModalViewCheckIn = ({ isOpen, onClose, checkIn }) => {
  if (!isOpen || !checkIn) return null;

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
          Detalhes do Check-In
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de Chegada
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
              {new Date(checkIn.horaChegada).toLocaleString("pt-BR", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          </div>

          {/* Campos Vitais em Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pressão Arterial
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                {checkIn.pressaoArterial || "Não informado"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Temperatura
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                {checkIn.temperatura
                  ? `${checkIn.temperatura} °C`
                  : "Não informado"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                {checkIn.peso ? `${checkIn.peso} kg` : "Não informado"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Altura
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                {checkIn.altura ? `${checkIn.altura} m` : "Não informado"}
              </p>
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm min-h-[80px] whitespace-pre-wrap">
              {checkIn.observacoes || "Nenhuma observação"}
            </p>
          </div>

          {/* Prioridade e Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridade
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
                {checkIn.status}
              </p>
            </div>
          </div>

          {/* Registrado por
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registrado por
            </label>
            <p className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 text-sm">
              {checkIn.profissional?.nome ||
                `Profissional ID: ${checkIn.profissionalId}`}
            </p>
          </div> */}
        </div>

        {/* Botão Fechar */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewCheckIn;
