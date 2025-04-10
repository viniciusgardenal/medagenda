import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import {
  criarReceita,
  getMedicamentos,
  getPacientes,
} from "../../config/apiServices";
import ReceitaForm from "./receitaForm";

const EmitirReceitas = () => {
  const [cpfPaciente, setCpfPaciente] = useState([]);
  const [idMedicamentos, setIdMedicamentos] = useState([]);
  const [medicamentosSelecionados, setMedicamentosSelecionados] = useState([]);
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [instrucaoUso, setInstrucaoUso] = useState("");

  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const receitaRef = useRef(null);

  useEffect(() => {
    const loadDados = async () => {
      try {
        const paciente = await getPacientes();
        if (Array.isArray(paciente.data)) {
          setCpfPaciente(paciente.data);
        }

        const medicamento = await getMedicamentos();
        setIdMedicamentos(medicamento.data);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };

    loadDados();
  }, []);

  const handlePacienteChange = (event) => {
    setPacienteSelecionado(event.target.value);
  };

  const handleMedicamentoChange = (index, value) => {
    const medicamentoSelecionado = idMedicamentos.find(
      (med) => med.idMedicamento == value
    );

    if (medicamentoSelecionado) {
      const updated = [...medicamentosSelecionados];
      updated[index] = {
        ...updated[index],
        idMedicamento: medicamentoSelecionado.idMedicamento,
        nomeMedicamento: medicamentoSelecionado.nomeMedicamento,
        controlado: medicamentoSelecionado.controlado,
        interacao: medicamentoSelecionado.interacao,
      };
      setMedicamentosSelecionados(updated);
    }
  };

  const handleAddMedicamento = () => {
    setMedicamentosSelecionados((prev) => [
      ...prev,
      { idMedicamento: "", dosagem: "", interacao: "", controlado: "" },
    ]);
  };

  const handleRemoveMedicamento = (index) => {
    const updated = [...medicamentosSelecionados];
    updated.splice(index, 1);
    setMedicamentosSelecionados(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dados = {
      cpfPaciente: pacienteSelecionado,
      matriculaProfissional,
      idMedicamento: medicamentosSelecionados.map((med) => med.idMedicamento),
      dosagem,
      instrucaoUso,
    };

    try {
      const response = await criarReceita(dados);

      if (response.headers["content-type"] === "application/pdf") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "receita.pdf";
        link.click();
      }

      setPacienteSelecionado("");
      setMedicamentosSelecionados([]);
    } catch (error) {
      console.error("Erro ao emitir receita", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">Emitir Receita</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
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
            {cpfPaciente.map((pac) => (
              <option key={pac.cpf} value={pac.cpf}>
                {pac.nome} {pac.sobrenome} (CPF: {pac.cpf})
              </option>
            ))}
          </select>
        </div>

        <ReceitaForm onMatriculaChange={setMatriculaProfissional} />

        {medicamentosSelecionados.map((med, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medicamento:
              </label>
              <select
                name="idMedicamento"
                value={med.idMedicamento || ""}
                onChange={(e) => handleMedicamentoChange(index, e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Selecione o Medicamento</option>
                {idMedicamentos.map((medicamento) => (
                  <option
                    key={medicamento.idMedicamento}
                    value={medicamento.idMedicamento}
                  >
                    {medicamento.nomeMedicamento}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Controlado:
              </label>
              <input
                type="text"
                value={med.controlado || ""}
                readOnly
                className="w-full p-2 border border-gray-300 bg-gray-100 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interação Medicamentosa:
              </label>
              <input
                type="text"
                value={med.interacao || ""}
                readOnly
                className="w-full p-2 border border-gray-300 bg-gray-100 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dosagem:
              </label>
              <textarea
                name="dosagem"
                value={dosagem}
                onChange={(e) => setDosagem(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instrução de uso:
              </label>
              <textarea
                name="instrucaoUsoCustom"
                value={instrucaoUso}
                onChange={(e) => setInstrucaoUso(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveMedicamento(index)}
              className="text-red-600 hover:underline text-sm"
            >
              Remover este medicamento
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddMedicamento}
          className="text-blue-600 font-medium hover:underline text-sm"
        >
          + Adicionar medicamento
        </button>

        <div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Emitir Receita
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmitirReceitas;
