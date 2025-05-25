import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import StepIndicator from "./StepIndicator";
import StepPaciente from "./StepPaciente";
import StepMedico from "./StepMedico";
import StepAgendamento from "./StepAgendamento";
import StepResumo from "./StepResumo";
import CadastroPacienteModal from "./CadastroPacienteModal";
import {
  getHorariosDisponiveis,
  criarPacientes,
} from "../../config/apiServices";

const schema = yup
  .object({
    cpfPaciente: yup.string().required("Paciente é obrigatório"),
    medicoId: yup
      .number()
      .required("Médico é obrigatório")
      .positive()
      .integer(),
    idTipoConsulta: yup
      .number()
      .required("Tipo de consulta é obrigatório")
      .positive()
      .integer(),
    dataConsulta: yup
      .date()
      .transform((value, originalValue) => {
        // Se o valor original for uma string vazia, converte para null
        // O Yup sabe lidar com 'null' e vai acionar o .required()
        return originalValue === "" ? null : value;
      })
      .typeError("Por favor, insira uma data válida.") // Mensagem para entradas inválidas (ex: "abc")
      .required("Data é obrigatória")
      .min(
        new Date(new Date().setHours(0, 0, 0, 0)),
        "Data não pode ser anterior a hoje"
      ), // Melhora a validação de data mínima
    horaConsulta: yup
      .string()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Hora inválida (HH:mm)")
      .required("Hora é obrigatória"),
    motivo: yup
      .string()
      .required("Motivo é obrigatório")
      .min(5, "Motivo deve ter pelo menos 5 caracteres"),
    responsavelAgendamento: yup.string().required("Responsável é obrigatório"),
    prioridade: yup
      .number()
      .required("Prioridade é obrigatória")
      .min(0, "Prioridade mínima é 0")
      .max(5, "Prioridade máxima é 5")
      .integer(),
  })
  .required();

const ModalAddConsulta = ({
  isOpen,
  onClose,
  onSave,
  pacientes,
  medicos,
  tiposConsulta,
  error,
  setError,
  user,
}) => {
  // console.log("modaa cientes:", pacientes);

  const [step, setStep] = useState(1);
  const [isCadastroPacienteOpen, setIsCadastroPacienteOpen] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [isLoadingHorarios, setIsLoadingHorarios] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      cpfPaciente: "",
      medicoId: "",
      idTipoConsulta: "",
      dataConsulta: "",
      horaConsulta: "",
      motivo: "",
      responsavelAgendamento: user?.nome || "",
      prioridade: 1,
    },
  });

  const { handleSubmit, watch, reset, setValue } = methods;
  const medicoId = watch("medicoId");
  const dataConsulta = watch("dataConsulta");

  useEffect(() => {
    const fetchHorarios = async () => {
      // console.log("MedicoId e DataConsulta:", medicoId, dataConsulta);

      if (medicoId && dataConsulta) {
        setIsLoadingHorarios(true);
        try {
          console.log("Fetching horários...");
          const response = await getHorariosDisponiveis(medicoId, dataConsulta);
          setHorariosDisponiveis(response.data.data || []);
          setValue("horaConsulta", ""); // Reset hora ao mudar médico ou data
        } catch (error) {
          setError(
            error.response?.data?.error ||
              "Erro ao carregar horários disponíveis"
          );
        } finally {
          setIsLoadingHorarios(false);
        }
      } else {
        setHorariosDisponiveis([]);
      }
    };
    fetchHorarios();
  }, [medicoId, dataConsulta, setError, setValue]);

  if (!isOpen) return null;

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

  const handleCadastrarPaciente = async (novoPaciente) => {
    try {
      const response = await criarPacientes(novoPaciente);
      const pacienteCadastrado = response.data.data;
      pacientes.push(pacienteCadastrado); // Atualiza lista local
      setValue("cpfPaciente", pacienteCadastrado.cpf);
      setIsCadastroPacienteOpen(false);
      return true;
    } catch (error) {
      setError(error.response?.data?.error || "Erro ao cadastrar paciente");
      return false;
    }
  };

  const nextStep = async () => {
    const fieldsToValidate = steps[step - 1].requiredFields;
    const isValid = await methods.trigger(fieldsToValidate);

    // --- ADICIONE ESTAS LINHAS PARA DEBUG ---
    // console.log("Campos que tentei validar:", fieldsToValidate);
    // console.log("Valores atuais no formulário:", methods.getValues());
    // console.log("Erros de validação encontrados:", methods.formState.errors);
    // --- FIM DO DEBUG ---

    if (isValid) {
      setStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const onSubmit = async (data) => {
    // 1. Crie uma cópia dos dados para não modificar o estado original do formulário
    const dadosParaEnviar = { ...data };

    // 2. Verifique se dataConsulta é um objeto Date e formate-o para 'YYYY-MM-DD'
    if (dadosParaEnviar.dataConsulta instanceof Date) {
      // Adiciona 1 ao dia para corrigir o problema de fuso horário que pode fazer a data "voltar" um dia
      const dataAjustada = new Date(dadosParaEnviar.dataConsulta);
      dataAjustada.setDate(dataAjustada.getDate() + 1);
      dadosParaEnviar.dataConsulta = dataAjustada.toISOString().split("T")[0];
    }

    // 3. Chame a função onSave com os dados já formatados
    const success = await onSave(dadosParaEnviar);

    // --- FIM DA CORREÇÃO ---

    if (success) {
      reset();
      onClose();
    }
  };

  const handleClose = () => {
    setError(null);
    reset();
    onClose();
  };

  const renderStep = () => {
    const StepComponent = steps[step - 1].component;
    return (
      <StepComponent
        pacientes={pacientes}
        medicos={medicos}
        tiposConsulta={tiposConsulta}
        goToStep={goToStep}
        onCadastrarPaciente={() => setIsCadastroPacienteOpen(true)}
        horariosDisponiveis={horariosDisponiveis}
        isLoadingHorarios={isLoadingHorarios}
        setValue={setValue}
      />
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold text-blue-600 mb-4">
          Agendar Consulta
        </h3>
        <StepIndicator steps={steps} currentStep={step} />
        {error && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {renderStep()}
            <div className="mt-6 flex justify-between gap-3">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Voltar
                </button>
              )}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancelar
                </button>
                {step < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isLoadingHorarios}
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Confirmar Agendamento
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
        <CadastroPacienteModal
          isOpen={isCadastroPacienteOpen}
          onClose={() => setIsCadastroPacienteOpen(false)}
          onCadastrar={handleCadastrarPaciente}
        />
      </div>
    </div>
  );
};

export default ModalAddConsulta;
