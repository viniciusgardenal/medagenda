import { useFormContext } from "react-hook-form";
import SelectField from "./SelectField";
import InputField from "./InputField";

const StepAgendamento = ({
  tiposConsulta,
  horariosDisponiveis,
  isLoadingHorarios,
}) => {
  // Acessa o contexto do formulário para registrar os campos e ver os erros
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">
        Agendamento da Consulta
      </h4>

      {/* Os campos agora são registrados corretamente no react-hook-form */}
      <SelectField
        label="Tipo de Consulta"
        name="idTipoConsulta"
        options={tiposConsulta.map((tipo) => ({
          value: tipo.idTipoConsulta,
          label: tipo.nomeTipoConsulta,
        }))}
        placeholder="Selecione um tipo"
        register={register}
        error={errors.idTipoConsulta}
      />

      <InputField
        label="Data da Consulta"
        name="dataConsulta"
        type="date"
        register={register}
        error={errors.dataConsulta}
      />

      <SelectField
        label="Hora da Consulta"
        name="horaConsulta"
        options={horariosDisponiveis.map((hora) => ({
          value: hora,
          label: hora,
        }))}
        placeholder={
          isLoadingHorarios
            ? "Carregando..."
            : horariosDisponiveis.length > 0
            ? "Selecione um horário"
            : "Selecione uma data primeiro"
        }
        register={register}
        error={errors.horaConsulta}
        disabled={horariosDisponiveis.length === 0 || isLoadingHorarios}
      />

      <InputField
        label="Motivo"
        name="motivo"
        type="textarea"
        register={register}
        error={errors.motivo}
      />

      <InputField
        label="Responsável pelo Agendamento"
        name="responsavelAgendamento"
        register={register}
        error={errors.responsavelAgendamento}
        disabled // O valor padrão é definido no useForm do pai
      />

      <InputField
        label="Prioridade (0 a 5)"
        name="prioridade"
        type="number"
        register={register}
        error={errors.prioridade}
        hidden={true}
      />
    </div>
  );
};

export default StepAgendamento;
