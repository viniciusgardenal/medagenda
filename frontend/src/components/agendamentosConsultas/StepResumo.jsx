import { useFormContext } from "react-hook-form";

const StepResumo = ({ pacientes, medicos, tiposConsulta, goToStep }) => {
  const { getValues } = useFormContext();
  const formValues = getValues();

  const paciente = pacientes.find((p) => p.cpf === formValues.cpfPaciente);
  const medico = medicos.find((m) => m.matricula == formValues.medicoId);
  const tipoConsulta = tiposConsulta.find(
    (t) => t.idTipoConsulta == formValues.idTipoConsulta
  );

  const formatarDataHoraBR = (data, hora) => {
    if (!data || !hora) return "";
    const dataObj = new Date(data);
    const dia = String(dataObj.getUTCDate()).padStart(2, "0");
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0");
    const ano = dataObj.getUTCFullYear();
    const dataBR = `${dia}/${mes}/${ano}`;
    const horaBR = hora.split(":").slice(0, 2).join(":");
    return `${dataBR} - ${horaBR}`;
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
      value: medico ? `${medico.nome} | ${medico.crm}` : "Não selecionado",
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
        formatarDataHoraBR(formValues.dataConsulta, formValues.horaConsulta) ||
        "Não informado",
      step: 3,
    },
    {
      label: "Motivo",
      value: formValues.motivo || "Não informado",
      step: 3,
    },
    {
      label: "Responsável pelo Agendamento",
      value: formValues.responsavelAgendamento || "Não informado",
      step: 3,
    },
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-base font-semibold text-gray-700">
        Resumo da Consulta
      </h4>
      <div className="border rounded-md p-3 bg-gray-50 text-sm">
        {/* Usando grid para duas colunas com divisores */}
        <div className="grid grid-cols-1 md:grid-cols-2"> {/* Removido gap-y, adicionado borda vertical aqui */}
          {fields.map((field, index) => (
            <div
              key={index}
              // Classes para bordas divisórias e padding interno de cada item do grid
              className={`
                flex justify-between items-start py-2 px-3
                ${index % 2 === 0 ? 'md:border-r border-gray-200' : ''}  /* Borda direita para itens na coluna esquerda em telas md+ */
                ${index < fields.length - (fields.length % 2 === 0 ? 2 : 1) ? 'border-b border-gray-200' : ''} /* Borda inferior para todos, exceto os últimos (considerando duas colunas) */
                ${index === fields.length -1 && fields.length % 2 !== 0 ? 'border-b border-gray-200 md:border-r-0' : ''} /* Borda inferior para o último item ímpar */
              `}
            >
              <div>
                <p className="block font-medium text-gray-800">
                  {field.label}
                </p>
                <p className="text-gray-600">{field.value}</p>
              </div>
              <button
                onClick={() => goToStep(field.step)}
                className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1 rounded-sm flex-shrink-0 ml-2"
              >
                Editar
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepResumo;