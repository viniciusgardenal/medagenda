import { FaPaperPlane } from "react-icons/fa";
import { Eye, Trash2 } from "lucide-react";

const TableRow = ({
  consulta,
  onView,
  onCancel,
  formatarDataHoraBR,
  onEnviarConfirmacaoEmail,
  enviandoEmailId,
}) => {
  const isCancelable = ["agendada", "checkin_realizado"].includes(
    consulta.status
  );
  const showSendEmailButton = consulta.status === "agendada";
  const isEnviandoEmail = enviandoEmailId === consulta.id;
  const statusLabels = {
    agendada: "Agendada",
    checkin_realizado: "Check-in Realizado",
    em_atendimento: "Em Atendimento",
    realizada: "Realizada",
    cancelada: "Cancelada",
    adiada: "Adiada",
  };

  const statusBadges = {
    agendada: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    checkin_realizado: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    em_atendimento: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    realizada: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    cancelada: "bg-red-50 text-red-600 ring-1 ring-red-200",
    adiada: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  };

  const nomePaciente = consulta.paciente?.nome || "N/A";
  const sobrenomePaciente = consulta.paciente?.sobrenome || "";
  const nomeMedico = consulta.medico?.nome || "N/A";
  const crmMedico = consulta.medico?.crm || "N/A";
  const nomeTipoConsulta = consulta.tipoConsulta?.nomeTipoConsulta || "N/A";

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-4 py-3 text-sm text-slate-700 font-medium">
        {nomePaciente} {sobrenomePaciente}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {nomeMedico} ({crmMedico})
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{nomeTipoConsulta}</td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {formatarDataHoraBR(consulta.dataConsulta, consulta.horaConsulta)}
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">
        {consulta.motivo || "N/A"}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadges[consulta.status] || "bg-slate-100 text-slate-500"}`}>
          {statusLabels[consulta.status] || consulta.status}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(consulta)}
            className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            title="Visualizar Consulta"
          >
            <Eye size={15} />
          </button>
          {isCancelable && (
            <button
              onClick={() => onCancel(consulta)}
              className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Cancelar Consulta"
            >
              <Trash2 size={15} />
            </button>
          )}
          {showSendEmailButton && (
            <button
              onClick={() => onEnviarConfirmacaoEmail(consulta)}
              className={`p-1.5 rounded-md text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors disabled:opacity-50 ${
                isEnviandoEmail ? "cursor-wait" : ""
              }`}
              title="Enviar Confirmação por E-mail"
              disabled={isEnviandoEmail}
            >
              {isEnviandoEmail ? (
                <svg
                  className="animate-spin h-4 w-4 text-teal-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <FaPaperPlane className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;
