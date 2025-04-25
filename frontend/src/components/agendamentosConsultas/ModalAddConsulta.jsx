import React, { useState } from "react";
import Select from "react-select";

// Estilos reutilizáveis
const BUTTON_CLASSES = {
  primary:
    "px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700",
  secondary:
    "px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300",
  disabled:
    "px-4 py-2 text-sm font-semibold text-white bg-gray-400 rounded-md cursor-not-allowed",
};

// Componente reutilizável para campos de input
const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      required={required}
    />
  </div>
);

// Componente reutilizável para campos de select
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-semibold text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Componente para o indicador de etapas
const StepIndicator = ({ steps, currentStep }) => (
  <div className="flex justify-between mb-6">
    {steps.map((step, index) => (
      <div key={index} className="flex-1 text-center">
        <div
          className={`inline-block w-8 h-8 rounded-full ${
            currentStep >= index + 1
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-700"
          } flex items-center justify-center text-sm font-semibold`}
        >
          {index + 1}
        </div>
        <p className="mt-1 text-sm font-semibold text-gray-700">{step.title}</p>
      </div>
    ))}
  </div>
);

// Etapa 1: Seleção de Paciente
const StepPaciente = ({
  dadosConsulta,
  setDadosConsulta,
  pacientes,
  onCadastrarPaciente,
}) => {
  const pacienteOptions = pacientes.map((paciente) => ({
    value: paciente.cpf,
    label: `${paciente.nome} ${paciente.sobrenome} (${paciente.cpf})`,
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">
        Selecionar Paciente
      </h4>
      <Select
        options={pacienteOptions}
        value={
          pacienteOptions.find(
            (option) => option.value === dadosConsulta.pacienteId
          ) || null
        }
        onChange={(selected) =>
          setDadosConsulta({
            ...dadosConsulta,
            pacienteId: selected ? selected.value : "",
          })
        }
        placeholder="Digite o nome ou CPF do paciente..."
        className="text-sm"
        classNamePrefix="react-select"
        isClearable
        noOptionsMessage={() => "Nenhum paciente encontrado"}
      />
      <button
        onClick={onCadastrarPaciente}
        className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
      >
        Paciente não encontrado? Cadastrar novo
      </button>
    </div>
  );
};

// Etapa 2: Seleção de Médico
const StepMedico = ({ dadosConsulta, setDadosConsulta, medicos }) => {
  const medicoOptions = medicos.map((medico) => ({
    value: medico.matricula,
    label: `${medico.nome} ${medico.crm}`,
  }));

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">Selecionar Médico</h4>
      <Select
        options={medicoOptions}
        value={
          medicoOptions.find(
            (option) => option.value === dadosConsulta.medicoId
          ) || null
        }
        onChange={(selected) =>
          setDadosConsulta({
            ...dadosConsulta,
            medicoId: selected ? selected.value : "",
          })
        }
        placeholder="Selecione um médico"
        className="text-sm"
        classNamePrefix="react-select"
        isClearable
        noOptionsMessage={() => "Nenhum médico encontrado"}
      />
    </div>
  );
};

// Etapa 3: Agendamento
const StepAgendamento = ({
  dadosConsulta,
  setDadosConsulta,
  tiposConsulta,
}) => {
  console.log(tiposConsulta);

  const tipoConsultaOptions = tiposConsulta.map((tipo) => ({
    value: tipo.idTipoConsulta,
    label: tipo.nomeTipoConsulta,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDadosConsulta({ ...dadosConsulta, [name]: value });
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">
        Agendamento da Consulta
      </h4>
      <SelectField
        label="Tipo de Consulta"
        name="idTipoConsulta"
        value={dadosConsulta.idTipoConsulta}
        onChange={handleChange}
        options={tipoConsultaOptions}
        placeholder="Selecione um tipo"
        required
      />
      <InputField
        label="Data da Consulta"
        name="dataConsulta"
        value={dadosConsulta.dataConsulta}
        onChange={handleChange}
        type="date"
        required
      />
      <InputField
        label="Hora da Consulta"
        name="horaConsulta"
        value={dadosConsulta.horaConsulta}
        onChange={handleChange}
        type="time"
        required
      />
      <InputField
        label="Motivo"
        name="motivo"
        value={dadosConsulta.motivo}
        onChange={(e) =>
          setDadosConsulta({ ...dadosConsulta, motivo: e.target.value })
        }
        type="textarea"
        required
      />
      <InputField
        label="Responsável pelo Agendamento"
        name="responsavelAgendamento"
        value={dadosConsulta.responsavelAgendamento}
        onChange={handleChange}
        required
      />
      <InputField
        label="Prioridade (0 a 5)"
        name="prioridade"
        value={dadosConsulta.prioridade}
        onChange={handleChange}
        type="number"
        required
      />
    </div>
  );
};

// Etapa 4: Resumo
const StepResumo = ({
  dadosConsulta,
  pacientes,
  medicos,
  tiposConsulta,
  goToStep,
}) => {
  const paciente = pacientes.find((p) => p.cpf === dadosConsulta.pacienteId);
  const medico = medicos.find((m) => m.matricula === dadosConsulta.medicoId);
  const tipoConsulta = tiposConsulta.find(
    (t) => t.idTipoConsulta == dadosConsulta.idTipoConsulta
  );

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
      value: medico ? `${medico.nome} ${medico.sobrenome}` : "Não selecionado",
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
        dadosConsulta.dataConsulta && dadosConsulta.horaConsulta
          ? `${new Date(dadosConsulta.dataConsulta).toLocaleDateString(
              "pt-BR"
            )} - ${dadosConsulta.horaConsulta}`
          : "Não informado",
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
    { label: "Prioridade", value: dadosConsulta.prioridade || "0", step: 3 },
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

// Modal de Cadastro de Paciente
const CadastroPacienteModal = ({
  isOpen,
  onClose,
  novoPaciente,
  setNovoPaciente,
  onCadastrar,
}) => {
  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovoPaciente({ ...novoPaciente, [name]: value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Cadastrar Novo Paciente
        </h3>
        <div className="space-y-4">
          <InputField
            label="Nome"
            name="nome"
            value={novoPaciente.nome}
            onChange={handleChange}
            required
          />
          <InputField
            label="Sobrenome"
            name="sobrenome"
            value={novoPaciente.sobrenome}
            onChange={handleChange}
            required
          />
          <SelectField
            label="Sexo"
            name="sexo"
            value={novoPaciente.sexo}
            onChange={handleChange}
            options={[
              { value: "M", label: "Masculino" },
              { value: "F", label: "Feminino" },
              { value: "O", label: "Outro" },
            ]}
            placeholder="Selecione"
            required
          />
          <InputField
            label="CPF"
            name="cpf"
            value={novoPaciente.cpf}
            onChange={handleChange}
            required
          />
          <InputField
            label="Data de Nascimento"
            name="dataNascimento"
            value={novoPaciente.dataNascimento}
            onChange={handleChange}
            type="date"
            required
          />
          <InputField
            label="Endereço"
            name="endereco"
            value={novoPaciente.endereco}
            onChange={handleChange}
            required
          />
          <InputField
            label="Email"
            name="email"
            value={novoPaciente.email}
            onChange={handleChange}
            type="email"
          />
          <InputField
            label="Telefone"
            name="telefone"
            value={novoPaciente.telefone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className={BUTTON_CLASSES.secondary}>
            Cancelar
          </button>
          <button onClick={onCadastrar} className={BUTTON_CLASSES.primary}>
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Principal
const ModalAddConsulta = ({
  isOpen,
  onClose,
  dadosConsulta,
  setDadosConsulta,
  onSave,
  pacientes,
  medicos,
  tiposConsulta,
}) => {
  const [step, setStep] = useState(1);
  const [isCadastroPacienteOpen, setIsCadastroPacienteOpen] = useState(false);
  const [novoPaciente, setNovoPaciente] = useState({
    nome: "",
    sobrenome: "",
    sexo: "",
    cpf: "",
    dataNascimento: "",
    endereco: "",
    email: "",
    telefone: "",
  });

  if (!isOpen) return null;

  const steps = [
    {
      title: "Paciente",
      component: StepPaciente,
      requiredFields: ["pacienteId"],
    },
    { title: "Médico", component: StepMedico, requiredFields: ["medicoId"] },
    {
      title: "Agendamento",
      component: StepAgendamento,
      requiredFields: [
        "idTipoConsulta",
        "dataConsulta",
        "horaConsulta",
        "motivo",
        "responsavelAgendamento",
        "prioridade",
      ],
    },
    { title: "Resumo", component: StepResumo, requiredFields: [] },
  ];

  const validateStep = () => {
    const currentStep = steps[step - 1];
    return currentStep.requiredFields.every((field) => {
      const value = dadosConsulta[field];
      return value !== undefined && value !== "" && value !== null;
    });
  };

  const handleCadastrarPaciente = async () => {
    try {
      // Simula chamada à API (substitua pela chamada real)
      const pacienteId = `temp_${Date.now()}`; // ID temporário
      const pacienteCadastrado = { id: pacienteId, ...novoPaciente };
      pacientes.push(pacienteCadastrado); // Atualiza lista local (simulação)
      setDadosConsulta({ ...dadosConsulta, pacienteId: novoPaciente.cpf });
      setIsCadastroPacienteOpen(false);
      setNovoPaciente({
        nome: "",
        sobrenome: "",
        sexo: "",
        cpf: "",
        dataNascimento: "",
        endereco: "",
        email: "",
        telefone: "",
      });
    } catch (error) {
      console.error("Erro ao cadastrar paciente:", error);
      alert("Erro ao cadastrar paciente. Tente novamente.");
    }
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (stepNumber) => setStep(stepNumber);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Agendar Consulta
        </h3>
        <StepIndicator steps={steps} currentStep={step} />
        {steps[step - 1].component({
          dadosConsulta,
          setDadosConsulta,
          pacientes,
          medicos,
          tiposConsulta,
          goToStep,
          onCadastrarPaciente: () => setIsCadastroPacienteOpen(true),
        })}
        <div className="mt-6 flex justify-between gap-3">
          {step > 1 && (
            <button onClick={prevStep} className={BUTTON_CLASSES.secondary}>
              Voltar
            </button>
          )}
          <div className="flex gap-3">
            <button onClick={onClose} className={BUTTON_CLASSES.secondary}>
              Cancelar
            </button>
            {step < steps.length ? (
              <button
                onClick={nextStep}
                disabled={!validateStep()}
                className={
                  validateStep()
                    ? BUTTON_CLASSES.primary
                    : BUTTON_CLASSES.disabled
                }
              >
                Próximo
              </button>
            ) : (
              <button onClick={onSave} className={BUTTON_CLASSES.primary}>
                Confirmar Agendamento
              </button>
            )}
          </div>
        </div>
      </div>
      <CadastroPacienteModal
        isOpen={isCadastroPacienteOpen}
        onClose={() => setIsCadastroPacienteOpen(false)}
        novoPaciente={novoPaciente}
        setNovoPaciente={setNovoPaciente}
        onCadastrar={handleCadastrarPaciente}
      />
    </div>
  );
};

export default ModalAddConsulta;
