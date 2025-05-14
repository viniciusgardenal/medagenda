import React from "react";

const StepResumo = ({
  dadosConsulta,
  pacientes,
  medicos,
  tiposConsulta,
  goToStep,
  error,
  setError,
}) => {
  const paciente = pacientes.find((p) => p.cpf === dadosConsulta.cpfPaciente);
  const medico = medicos.find((m) => m.matricula === dadosConsulta.medicoId);
  const tipoConsulta = tiposConsulta.find(
    (t) => t.idTipoConsulta == dadosConsulta.idTipoConsulta
  );

  const formatarDataHoraBR = (data, hora) => {
    if (!data || !hora) return "";
    try {
      const [ano, mes, dia] = data.split("-");
      const dataBR = `${dia}/${mes}/${ano}`;
      const horaBR = hora.split(":").slice(0, 2).join(":");
      return `${dataBR} - ${horaBR}`;
    } catch (error) {
      return `${data} - ${hora}`;
    }
  };

  const fields = [
    {
      label: "Paciente",
      value: paciente
        ? `${paciente.nome} ${paciente.sobrenome} (${paciente.cpf})`
        : "Não selecionado",
      step: 1,
    },
    {
      label: "Médico",
      value: medico ? `${medico.nome} ${medico.crm}` : "Não selecionado",
      step: 2,
    },
    {
      label: "Tipo de Consulta",
      value: tipoConsulta ? tipoConsulta.nomeTipoConsulta : "Não selecionado",
      step: 3,
    },
    {
      label: "Data e Hora",
      value:
        formatarDataHoraBR(
          dadosConsulta.dataConsulta,
          dadosConsulta.horaConsulta
        ) || "Não informado",
      step: 3,
    },
    {
      label: "Motivo",
      value: dadosConsulta.motivo || "Não informado",
      step: 3,
    },
    {
      label: "Responsável pelo Agendamento",
      value: dadosConsulta.responsavelAgendamento || "Não informado",
      step: 3,
    },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">
        Resumo da Consulta
      </h4>
      <div className="border rounded-md p-4 bg-gray-50">
        {fields.map((field, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                {field.label}
              </label>
              <p className="text-sm text-gray-600">{field.value}</p>
            </div>
            <button
              onClick={() => {
                setError(null); // Limpa o erro ao editar
                goToStep(field.step);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              Editar
            </button>
          </div>
        ))}
      </div>
      {error && (
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
          {error}
        </div>
      )}
    </div>
  );
};

export default StepResumo;
