import React, { useState, useEffect } from "react";
import {
  criarAtestado,
  getPacientes,
  getProfissionais,
} from "../../config/apiServices";
import AtestadoForm from "./gerarAtestadoForm";

const GerarAtestados = () => {
  const [cpfPaciente, setCpfPaciente] = useState([]);
  const [matriculaProfissional, setMatriculaProfissional] = useState([]);
  const [tipoAtestado, setTipoAtestado] = useState("");
  const [pacienteSelecionado, setPacienteSelecionado] = useState("");

  useEffect(() => {
    const loadDados = async () => {
      try {
        const paciente = await getPacientes();
        if (Array.isArray(paciente.data)) {
          setCpfPaciente(paciente.data);
        } else {
          console.error("Os dados de pacientes não são um array", paciente.data);
        }

        const profissional = await getProfissionais();
        setMatriculaProfissional(profissional.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };

    loadDados();
  }, []);

  const handlePacienteChange = (event) => {
    setPacienteSelecionado(event.target.value);
  };

  const handleTipoAtestadoChange = (event) => {
    setTipoAtestado(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = {
      cpfPaciente: pacienteSelecionado,
      matriculaProfissional: matriculaProfissional,
      tipoAtestado,
    };

    try {
      const response = await criarAtestado(dados);
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `atestado_${dados.cpfPaciente}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      setPacienteSelecionado("");
      setMatriculaProfissional("");
      setTipoAtestado("");
    } catch (error) {
      console.error("Erro ao gerar atestado", error);
    }
  };

  return (
    <section className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-blue-700 text-center mb-6">
        Gerar Atestados Médicos
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Paciente */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Paciente:
          </label>
          <select
            name="PacienteCpf"
            value={pacienteSelecionado}
            onChange={handlePacienteChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o Paciente</option>
            {Array.isArray(cpfPaciente) &&
              cpfPaciente.map((pac) => (
                <option key={pac.cpf} value={pac.cpf}>
                  {pac.nome} {pac.sobrenome} (CPF: {pac.cpf})
                </option>
              ))}
          </select>
        </div>

        {/* Profissional */}
        <AtestadoForm onMatriculaChange={setMatriculaProfissional} />

        {/* Tipo de Atestado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Atestado:
          </label>
          <select
            name="tipoAtestado"
            value={tipoAtestado}
            onChange={handleTipoAtestadoChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o Tipo de Atestado</option>
            <option value="Médico">Médico</option>
            <option value="Odontológico">Odontológico</option>
            <option value="Psicológico">Psicológico</option>
            <option value="Outros">Outros</option>
          </select>
        </div>

        {/* Botão de Envio */}
        <div>
          <button
            type="submit"
            className="w-full px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Gerar Atestado
          </button>
        </div>
      </form>
    </section>
  );
};

export default GerarAtestados;
