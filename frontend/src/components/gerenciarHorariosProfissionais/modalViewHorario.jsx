import React from "react";
import { FaClock } from "react-icons/fa";

// Componentes de Ícones padronizados
const EditIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 4v12m4-12v12" />
    </svg>
);

const ModalViewHorario = ({
  isOpen,
  onClose,
  profissional,
  horarios,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !profissional) return null;

  const formatarHorario = (horario) => {
    if (!horario) return "—";
    if (typeof horario === "string" && /^\d{2}:\d{2}/.test(horario)) {
      return horario.substring(0, 5);
    }
    return "N/A";
  };

  const diasSemanaOrdem = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const horariosOrdenados = Array.isArray(horarios) && horarios.length > 0
    ? [...horarios].sort((a, b) => diasSemanaOrdem.indexOf(a.diaSemana) - diasSemanaOrdem.indexOf(b.diaSemana))
    : [];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      {/* Container geral com padding e largura ajustados */}
      <div className="bg-white w-full max-w-4xl p-6 rounded-2xl shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {/* ... SVG de fechar ... */}
        </button>
        {/* Cabeçalho padronizado */}
        <h3 className="text-2xl font-bold text-blue-600 flex items-center gap-3 mb-6">
            <FaClock />
            Horários de {profissional.nome} {profissional.sobrenome || ""}
        </h3>
        
        {!horariosOrdenados.length ? (
          <p className="text-base text-gray-500 text-center py-6">
            Nenhum horário cadastrado para este profissional.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              {/* Cabeçalho da tabela padronizado */}
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Dia</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Início</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Fim</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Intervalo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {horariosOrdenados.map((horario) => (
                  <tr key={horario.id} className="hover:bg-blue-50 transition-colors">
                    {/* Células com padding ajustado */}
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                      {horario.diaSemana || "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatarHorario(horario.inicio)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {formatarHorario(horario.fim)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {`${formatarHorario(horario.intervaloInicio)} - ${formatarHorario(horario.intervaloFim)}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          horario.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                          {horario.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {/* Ações com cores e ícones padronizados */}
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => onEdit(horario)}
                          className="text-yellow-500 hover:text-yellow-700 transition-colors"
                          title="Editar Horário"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => onDelete(horario)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Excluir Horário"
                        >
                          <TrashIcon />
                        </button>
                      </div>
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
            className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewHorario;