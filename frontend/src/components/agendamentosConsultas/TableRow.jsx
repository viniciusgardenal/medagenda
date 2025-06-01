const TableRow = ({ consulta, onView, onCancel, formatarDataHoraBR }) => {
  // console.log("DADOS DA CONSULTA EM TableRow:", consulta); // <--- ADICIONE ESTA LINHA

  const isCancelable = ["agendada", "checkin_realizado"].includes(
    consulta.status
  );
  const statusLabels = {
    agendada: "Agendada",
    checkin_realizado: "Check-in Realizado",
    em_atendimento: "Em Atendimento",
    realizada: "Realizada",
    cancelada: "Cancelada",
    adiada: "Adiada",
  };

  // Valores padrão para evitar erros
  const nomePaciente = consulta.paciente?.nome || "N/A";
  const sobrenomePaciente = consulta.paciente?.sobrenome || "";
  const nomeMedico = consulta.medico?.nome || "N/A";
  const crmMedico = consulta.medico?.crm || "N/A";
  const nomeTipoConsulta = consulta.tipoConsulta?.nomeTipoConsulta || "N/A";

  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-700">
        {nomePaciente} {sobrenomePaciente}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {nomeMedico} ({crmMedico})
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">{nomeTipoConsulta}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {consulta.motivo || "N/A"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {statusLabels[consulta.status] || consulta.status}
      </td>
      <td className="px-4 py-3 flex gap-3">
        <button
          onClick={() => onView(consulta)}
          className="text-blue-500 hover:text-blue-700"
          title="Visualizar Consulta"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
        {isCancelable && (
          <button
            onClick={() => onCancel(consulta)}
            className="text-red-500 hover:text-red-700"
            title="Cancelar Consulta"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
        )}
      </td>
    </tr>
  );
};

export default TableRow;
