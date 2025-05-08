import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const ModalViewObito = ({
  isOpen,
  onClose,
  obito,
  pacientes,
  profissionais,
  onEdit,
  onDelete,
}) => {
  // Verifica se a modal deve ser aberta
  if (!isOpen || !obito) return null;

  // Verifica se pacientes e profissionais são arrays e não undefined
  const paciente = pacientes?.find((p) => p.cpf === obito.cpfPaciente);
  const profissional = profissionais?.find(
    (p) => p.matricula.toString() === obito.matriculaProfissional.toString()
  );

  // Função para formatar a data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

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
          Detalhes do Registro de Óbito
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Paciente
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {paciente
                    ? `${paciente.nome} ${paciente.sobrenome || ""} (CPF: ${obito.cpfPaciente})`
                    : obito.cpfPaciente}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Profissional
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {profissional
                    ? `${profissional.nome} ${profissional.sobrenome || ""} (Matrícula: ${obito.matriculaProfissional})`
                    : obito.matriculaProfissional}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Data do Óbito
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(obito.dataObito)}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Causa do Óbito
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {obito.causaObito || "Não definida"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Local do Óbito
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {obito.localObito || "Não definido"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Nº Atestado de Óbito
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {obito.numeroAtestadoObito || "Não definido"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Observações
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {obito.observacoes || "Não definidas"}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Status
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {obito.status || "Não definido"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => onEdit(obito)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaEdit className="h-5 w-5" />
            Editar
          </button>
          <button
            onClick={() => onDelete(obito)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaTrash className="h-5 w-5" />
            Excluir
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewObito;
