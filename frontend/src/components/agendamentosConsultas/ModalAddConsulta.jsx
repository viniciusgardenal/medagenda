import React, { useState, useCallback, useRef } from "react";
import StepIndicator from "./StepIndicator";
import StepPaciente from "./StepPaciente";
import StepMedico from "./StepMedico";
import StepAgendamento from "./StepAgendamento";
import StepResumo from "./StepResumo";
import CadastroPacienteModal from "./CadastroPacienteModal";

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
  // Hooks must be called before any return
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
  const pacienteRef = useRef(null);
  const medicoRef = useRef(null);

  const validateStep = useCallback(() => {
    const currentStep = steps[step - 1];
    return currentStep.requiredFields.every((field) => {
      const value = dadosConsulta[field];
      return value !== undefined && value !== "" && value !== null;
    });
  }, [step, dadosConsulta]);

  // Constants
  const BUTTON_CLASSES = {
    primary:
      "px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700",
    secondary:
      "px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300",
    disabled:
      "px-4 py-2 text-sm font-semibold text-white bg-gray-400 rounded-md cursor-not-allowed",
  };

  const steps = [
    {
      title: "Paciente",
      component: StepPaciente,
      requiredFields: ["cpfPaciente"],
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

  // Early return after all hooks
  if (!isOpen) return null;

  const handleCadastrarPaciente = async () => {
    try {
      const cpfPaciente = `temp_${Date.now()}`;
      const pacienteCadastrado = { id: cpfPaciente, ...novoPaciente };
      pacientes.push(pacienteCadastrado);
      setDadosConsulta({ ...dadosConsulta, cpfPaciente: novoPaciente.cpf });
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

  const nextStep = () => {
    // Reset search inputs for the current step before moving to the next
    if (step === 1 && pacienteRef.current) {
      pacienteRef.current.reset();
    } else if (step === 2 && medicoRef.current) {
      medicoRef.current.reset();
    }
    setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (stepNumber) => {
    // Reset search inputs when navigating to a specific step
    if (stepNumber === 1 && pacienteRef.current) {
      pacienteRef.current.reset();
    } else if (stepNumber === 2 && medicoRef.current) {
      medicoRef.current.reset();
    }
    setStep(stepNumber);
  };

  const renderStep = () => {
    const StepComponent = steps[step - 1].component;
    return (
      <StepComponent
        dadosConsulta={dadosConsulta}
        setDadosConsulta={setDadosConsulta}
        pacientes={pacientes}
        medicos={medicos}
        tiposConsulta={tiposConsulta}
        goToStep={goToStep}
        onCadastrarPaciente={() => setIsCadastroPacienteOpen(true)}
        ref={step === 1 ? pacienteRef : step === 2 ? medicoRef : null}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Agendar Consulta
        </h3>
        <StepIndicator steps={steps} currentStep={step} />
        {renderStep()}
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
