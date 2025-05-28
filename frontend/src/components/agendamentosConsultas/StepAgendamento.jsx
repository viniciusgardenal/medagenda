// StepAgendamento.jsx (VERSÃO CORRETA)
import { useFormContext } from "react-hook-form";
import SelectField from "./SelectField";
import InputField from "./InputField";

const StepAgendamento = ({
  tiposConsulta,
  horariosDisponiveis,
  isLoadingHorarios, // Você pode precisar adicionar isLoadingHorarios se não estiver lá
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-700">
        Agendamento da Consulta
      </h4>
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
      {/* ... outros InputField e SelectField usando 'register' e 'errors' ... */}
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
          isLoadingHorarios // Adicionado para consistência
            ? "Carregando..."
            : horariosDisponiveis.length > 0
            ? "Selecione um horário"
            : "Selecione uma data primeiro"
        }
        register={register}
        error={errors.horaConsulta}
        disabled={horariosDisponiveis.length === 0 || isLoadingHorarios} // Adicionado para consistência
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
        disabled
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
