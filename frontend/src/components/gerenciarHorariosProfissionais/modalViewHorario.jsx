import React from "react";
import { FaEdit, FaTrash } from 'react-icons/fa';

const ModalViewHorario = ({ isOpen, onClose, profissional, horarios, onEdit, onDelete }) => {
  if (!isOpen || !profissional) return null;

  console.log("ModalViewHorario - Profissional:", profissional);
  console.log("ModalViewHorario - Horários:", horarios);

  const formatarHorario = (horario) => {
    if (!horario || typeof horario !== "string") return "Não definido";
    const [hours, minutes] = horario.split(":").slice(0, 2);
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-2xl shadow-md">
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-2xl font-bold text-blue-600 mb-6">
          Horários de {profissional.nome} {profissional.sobrenome || ""}
        </h3>
        <div className="space-y-4">
          {horarios.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Nenhum horário cadastrado para este profissional.</p>
          ) : (
            <ul className="space-y-2">
              {horarios.map((horario) => (
                <li
                  key={horario.id}
                  className="p-4 bg-gray-50 border border-gray-300 rounded-md flex justify-between items-center"
                >
                  <div>
                    <p><strong>Dia:</strong> {horario.diaSemana}</p>
                    <p><strong>Início:</strong> {formatarHorario(horario.inicio)}</p>
                    <p><strong>Fim:</strong> {formatarHorario(horario.fim)}</p>
                    <p><strong>Status:</strong> {horario.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(horario)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Editar Horário"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(horario)}
                      className="text-red-500 hover:text-red-700"
                      title="Excluir Horário"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end mt-6">
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

export default ModalViewHorario;