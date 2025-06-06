import {
  FaUserMd,
  FaUserInjured,
  FaCalendarAlt,
  FaNotesMedical,
  FaCommentMedical,
  FaUserEdit,
  FaInfoCircle,
  FaStethoscope,
} from "react-icons/fa";

const ModalViewConsulta = ({
  isOpen,
  onClose,
  consulta,
  formatarDataHoraBR,
}) => {
  if (!isOpen || !consulta) return null;

  // console.log(consulta);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-8 rounded-2xl shadow-2xl relative transform transition-all">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 mb-6">
          <FaStethoscope className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">
            Detalhes da Consulta
          </h3>
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

        {/* Conteúdo dos Detalhes */}
        <div className="space-y-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
            {/* Paciente */}
            <div className="sm:col-span-1">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaUserInjured className="h-4 w-4 text-blue-500" />
                Paciente
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {consulta.paciente.nome} {consulta.paciente.sobrenome}
              </dd>
            </div>

            {/* Médico */}
            <div className="sm:col-span-1">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaUserMd className="h-4 w-4 text-blue-500" />
                Médico
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {consulta.medico.nome} {consulta.medico.sobrenome}
              </dd>
            </div>

            {/* Data e Hora */}
            <div className="sm:col-span-1">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCalendarAlt className="h-4 w-4 text-blue-500" />
                Data e Hora
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {formatarDataHoraBR(
                  consulta.dataConsulta,
                  consulta.horaConsulta
                )}
              </dd>
            </div>

            {/* Tipo de Consulta */}
            <div className="sm:col-span-1">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaNotesMedical className="h-4 w-4 text-blue-500" />
                Tipo de Consulta
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {consulta.tipoConsulta.nomeTipoConsulta}
              </dd>
            </div>

            {/* Motivo (ocupando a largura total) */}
            <div className="sm:col-span-2 pt-2 border-t border-gray-200">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaCommentMedical className="h-4 w-4 text-blue-500" />
                Motivo
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {consulta.motivo}
              </dd>
            </div>

            {/* Responsável pelo Agendamento */}
            <div className="sm:col-span-1">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaUserEdit className="h-4 w-4 text-blue-500" />
                Responsável
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6">
                {consulta.responsavelAgendamento}
              </dd>
            </div>

            {/* Status */}
            <div className="sm:col-span-1">
              <dt className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                <FaInfoCircle className="h-4 w-4 text-blue-500" />
                Status
              </dt>
              <dd className="mt-1 text-sm text-gray-700 pl-6 capitalize">
                {consulta.status}
              </dd>
            </div>
          </dl>
        </div>

        {/* Botão de Ação */}
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

export default ModalViewConsulta;
