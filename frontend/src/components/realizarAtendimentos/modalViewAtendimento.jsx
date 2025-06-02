import React from "react";
import { FaStethoscope, FaUser, FaUserMd, FaClipboardList, FaCalendarAlt, FaFileMedical, FaInfoCircle } from "react-icons/fa";

const ModalViewAtendimento = ({
  isOpen,
  onClose,
  atendimento,
  formatarDataHoraBR,
}) => {
  // Verifica se a modal deve ser aberta
  if (!isOpen || !atendimento) return null;

  // Função para formatar a data (mantida como prop)
  const formattedDate = formatarDataHoraBR(atendimento.dataAtendimento) || "N/A";

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative transform transition-all">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <FaStethoscope className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Detalhes do Atendimento</h3>
        </div>

        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Fechar modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 24"
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

        {/* Conteúdo */}
        <div className="space-y-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* Paciente */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaUser className="h-4 w-4 text-blue-500" />
                Paciente
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {atendimento.paciente?.nome
                  ? `${atendimento.paciente.nome} ${atendimento.paciente.sobrenome || ""}`
                  : "Não encontrado"}
              </dd>
            </div>

            {/* Médico */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaUserMd className="h-4 w-4 text-blue-500" />
                Médico
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {atendimento.medico?.nome
                  ? `${atendimento.medico.nome} (CRM: ${atendimento.medico.crm || "N/A"})`
                  : "Não encontrado"}
              </dd>
            </div>

            {/* Tipo de Consulta */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaClipboardList className="h-4 w-4 text-blue-500" />
                Tipo de Consulta
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {atendimento.tipoConsulta?.nomeTipoConsulta || "N/A"}
              </dd>
            </div>

            {/* Data e Hora */}
            <div>
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                Data e Hora
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">{formattedDate}</dd>
            </div>

            {/* Diagnóstico */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Diagnóstico
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {atendimento.diagnostico || "Não definido"}
              </dd>
            </div>

            {/* Prescrição */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaFileMedical className="h-4 w-4 text-blue-500" />
                Prescrição
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {atendimento.prescricao || "Não definida"}
              </dd>
            </div>

            {/* Observações */}
            <div className="sm:col-span-2 border-b border-gray-200 pb-4">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Observações
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {atendimento.observacoes || "Não definidas"}
              </dd>
            </div>
          </dl>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            aria-label="Fechar modal"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalViewAtendimento;