import { useFormContext } from "react-hook-form";

const StepResumo = ({ pacientes, medicos, tiposConsulta, goToStep }) => {
  // 1. Acessa o contexto do formulário
  const { getValues } = useFormContext();

  // 2. Pega todos os valores atuais do formulário de uma só vez
  const formValues = getValues();

  // 3. A lógica para encontrar os dados relacionados permanece, mas agora usando formValues
  const paciente = pacientes.find((p) => p.cpf === formValues.cpfPaciente);
  const medico = medicos.find((m) => m.matricula == formValues.medicoId);
  const tipoConsulta = tiposConsulta.find(
    (t) => t.idTipoConsulta == formValues.idTipoConsulta
  );

  // Função para formatar a data e hora continua a mesma
  const formatarDataHoraBR = (data, hora) => {
    if (!data || !hora) return "";
    // Criar o objeto Date a partir da string, assumindo que é uma data local
    const dataObj = new Date(data);
    // Ajustar para o fuso horário local (evitar deslocamento UTC)
    const dia = String(dataObj.getUTCDate()).padStart(2, "0");
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, "0"); // Mês é base 0
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
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">
        Resumo da Consulta
      </h4>
      <div className="border rounded-md p-4 bg-gray-50">
        {fields.map((field, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b last:border-b-0"
          >
            <div>
              <p className="block text-sm font-semibold text-gray-800">
                {field.label}
              </p>
              <p className="text-sm text-gray-600">{field.value}</p>
            </div>
            <button
              onClick={() => goToStep(field.step)}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepResumo;
