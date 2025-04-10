// components/ModalViewCheckIn.jsx
import React from "react";

const ModalViewCheckIn = ({ isOpen, onClose, checkIn }) => {
  if (!isOpen || !checkIn) return null;

  return (
    <div className="fixed  inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Detalhes do Check-In
        </h3>

        <div className="space-y-3">
          <p>
            <span className="font-semibold text-gray-700">ID Consulta:</span>{" "}
            <span className="text-gray-700">{checkIn.consultaId}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">
              Hora de Chegada:
            </span>{" "}
            <span className="text-gray-700">
              {new Date(checkIn.horaChegada).toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">
              Pressão Arterial:
            </span>{" "}
            <span className="text-gray-700">
              {checkIn.pressaoArterial || "Não informado"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Temperatura:</span>{" "}
            <span className="text-gray-700">
              {checkIn.temperatura
                ? `${checkIn.temperatura} °C`
                : "Não informado"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Peso:</span>{" "}
            <span className="text-gray-700">
              {checkIn.peso ? `${checkIn.peso} kg` : "Não informado"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Altura:</span>{" "}
            <span className="text-gray-700">
              {" "}
              {checkIn.altura ? `${checkIn.altura} m` : "Não informado"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Observações:</span>{" "}
            <span className="text-gray-700">
              {checkIn.observacoes || "Nenhuma observação"}
            </span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Prioridade:</span>{" "}
            <span className="text-gray-700">{checkIn.prioridade}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Status:</span>{" "}
            <span className="text-gray-700">{checkIn.status}</span>
          </p>
          <p>
            <span className="font-semibold text-gray-700">Registrado por:</span>{" "}
            <span className="text-gray-700">
              {" "}
              {checkIn.profissional?.nome ||
                "Profissional ID: " + checkIn.profissionalId}
            </span>
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewCheckIn;
