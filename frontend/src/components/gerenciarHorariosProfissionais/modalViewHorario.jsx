import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-lg relative">
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
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Horários de {profissional.nome} {profissional.sobrenome || ""}
        </h3>
        {(!Array.isArray(horarios) || horarios.length === 0) ? (
          <p className="text-sm text-gray-500 text-center py-4">Nenhum horário cadastrado para este profissional.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dia</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Início</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fim</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {horarios.map((horario) => (
                  <tr key={horario.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{horario.diaSemana}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatarHorario(horario.inicio)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatarHorario(horario.fim)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{horario.status}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          console.log("Clicou em Editar, horário:", horario);
                          onEdit(horario);
                        }}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        title="Editar Horário"
                      >
                        <FaEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          console.log("Clicou em Excluir, horário:", horario);
                          onDelete(horario);
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir Horário"
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end mt-4">
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