import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ModalViewHorario = ({
  isOpen,
  onClose,
  profissional,
  horarios,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !profissional) return null;

  // Função para formatar horários como HH:mm
  const formatarHorario = (horario) => {
    if (!horario || horario === "" || horario === null || horario === undefined) {
      return "Não definido";
    }
    if (typeof horario === "string" && /^\d{2}:\d{2}$/.test(horario)) {
      const [hours, minutes] = horario.split(":");
      return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
    }
    return "Não definido";
  };

  // Ordem fixa dos dias da semana (Domingo a Sábado)
  const diasSemanaOrdem = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  // Ordenar os horários com base na ordem dos dias da semana
  const horariosOrdenados = Array.isArray(horarios) && horarios.length > 0
    ? [...horarios].sort((a, b) => {
        const indexA = diasSemanaOrdem.indexOf(a.diaSemana);
        const indexB = diasSemanaOrdem.indexOf(b.diaSemana);
        return indexA - indexB;
      })
    : [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-10">
      <div className="bg-white w-full max-w-5xl p-8 rounded-xl shadow-lg relative">
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
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">
          Horários de {profissional.nome} {profissional.sobrenome || ""}
        </h3>
        {!horariosOrdenados.length ? (
          <p className="text-base text-gray-500 text-center py-6">
            Nenhum horário cadastrado para este profissional.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Início
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Início Intervalo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fim Intervalo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {horariosOrdenados.map((horario) => (
                  <tr key={horario.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {horario.diaSemana || "Não definido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarHorario(horario.inicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarHorario(horario.fim)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarHorario(horario.intervaloInicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatarHorario(horario.intervaloFim)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {horario.status || "Não definido"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                      <button
                        onClick={() => onEdit(horario)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar Horário"
                      >
                        <FaEdit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => onDelete(horario)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir Horário"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewHorario;