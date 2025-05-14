import SelectField from "./SelectField";
import React, { useState, useEffect } from "react";
import { getHorariosDisponiveis } from "../../config/apiServices";
import InputField from "./InputField";

const StepAgendamento = ({
  dadosConsulta,
  setDadosConsulta,
  tiposConsulta,
}) => {
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);

  useEffect(() => {
    const fetchHorarios = async () => {
      if (dadosConsulta.medicoId && dadosConsulta.dataConsulta) {
        try {
          const response = await getHorariosDisponiveis(
            dadosConsulta.medicoId,
            dadosConsulta.dataConsulta
          );
          setHorariosDisponiveis(response.data.data); // Assuming your API returns { data: [...] }
        } catch (error) {
          console.error("Erro ao carregar horários:", error);
        }
      } else {
        setHorariosDisponiveis([]); // Clear horarios if medicoId or dataConsulta is empty
      }
    };
    fetchHorarios();
  }, [dadosConsulta.medicoId, dadosConsulta.dataConsulta]);

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
        options={tiposConsulta.map((tipo) => ({
          value: tipo.idTipoConsulta,
          label: tipo.nomeTipoConsulta,
        }))}
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
      <SelectField
        label="Hora da Consulta"
        name="horaConsulta"
        value={dadosConsulta.horaConsulta}
        onChange={handleChange}
        options={[
          ...horariosDisponiveis.map((hora) => ({
            value: hora,
            label: hora,
          })),
        ]}
        placeholder="Selecione um horário"
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
        disabled
      />
      <InputField
        label="Prioridade (0 a 5)"
        name="prioridade"
        value={1}
        onChange={handleChange}
        type="number"
        required
        hidden={true}
      />
    </div>
  );
};

export default StepAgendamento;
