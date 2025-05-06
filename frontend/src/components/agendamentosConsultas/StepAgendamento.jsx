import React from "react";
import SelectField from "./SelectField";

const StepAgendamento = ({
  dadosConsulta,
  setDadosConsulta,
  tiposConsulta,
}) => {
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
      <input
        label="Data da Consulta"
        name="dataConsulta"
        value={dadosConsulta.dataConsulta}
        onChange={handleChange}
        type="date"
        required
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        label="Hora da Consulta"
        name="horaConsulta"
        value={dadosConsulta.horaConsulta}
        onChange={handleChange}
        type="time"
        required
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <textarea
        label="Motivo"
        name="motivo"
        value={dadosConsulta.motivo}
        onChange={(e) =>
          setDadosConsulta({ ...dadosConsulta, motivo: e.target.value })
        }
        required
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        label="Responsável pelo Agendamento"
        name="responsavelAgendamento"
        value={dadosConsulta.responsavelAgendamento}
        onChange={handleChange}
        required
        disabled
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
      <input
        label="Prioridade (0 a 5)"
        name="prioridade"
        value={1}
        onChange={handleChange}
        type="number"
        required
        hidden={true}
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
};

export default StepAgendamento;