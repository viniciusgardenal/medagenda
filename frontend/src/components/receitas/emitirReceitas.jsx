import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import "./emitirReceitasStyle.css";
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
  const [dosagem, setDosagem] = useState([]);
  const [instrucaoUso, setInstrucaoUso] = useState([]);

  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const receitaRef = useRef(null); // Referência para captura

  const loadDados = async () => {
    try {
      const paciente = await getPacientes();
      if (Array.isArray(paciente.data)) {
        setCpfPaciente(paciente.data);
      } else {
        console.error("Os dados de pacientes não são um array", paciente.data);
      }

      const medicamento = await getMedicamentos();
      setIdMedicamentos(medicamento.data);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    }
  };

  useEffect(() => {
    loadDados();
  }, []);

  const handlePacienteChange = (event) => {
    const cpfSelecionado = event.target.value;
    setPacienteSelecionado(cpfSelecionado);
  };

  const handleMedicamentoChange = (index, value) => {
    const medicamentoSelecionado = idMedicamentos.find(
      (med) => med.idMedicamento == value
    );

    if (medicamentoSelecionado) {
      const updatedMedicamentos = [...medicamentosSelecionados];
      updatedMedicamentos[index] = {
        ...updatedMedicamentos[index],
        idMedicamento: medicamentoSelecionado.idMedicamento,
        nomeMedicamento: medicamentoSelecionado.nomeMedicamento,
        controlado: medicamentoSelecionado.controlado,
        interacao: medicamentoSelecionado.interacao,
      };
      setMedicamentosSelecionados(updatedMedicamentos);
    }
  };

  const handleAddMedicamento = () => {
    setMedicamentosSelecionados((prev) => [
      ...prev,
      { idMedicamento: "", dosagem: "", interacao: "", controlado: "" },
    ]);
  };

  const handleRemoveMedicamento = (index) => {
    const updatedMedicamentos = [...medicamentosSelecionados];
    updatedMedicamentos.splice(index, 1);
    setMedicamentosSelecionados(updatedMedicamentos);
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

    console.log(dados);

    try {
      // Chamada para criar a receita no backend
      const response = await criarReceita(dados);

      // Verifica se a resposta é um PDF (blobs)
      if (response.headers["content-type"] === "application/pdf") {
        // Cria o blob a partir da resposta e baixa o PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "receita.pdf"; // Nome do arquivo para download
        link.click();
      }

      // Limpar os dados após o envio
      setPacienteSelecionado("");
      setMedicamentosSelecionados([]);
    } catch (error) {
      console.error("Erro ao emitir receita", error);
    }
  };

  return (
    <div className="emitir-receitas-container">
      <h2>Emitir Receitas</h2>
      <form className="receitas-form" onSubmit={handleSubmit}>
        <div className="medicamento-group">
          <div className="form-group">
            <label>Paciente:</label>
            <select
              name="PacienteCpf"
              value={pacienteSelecionado}
              onChange={handlePacienteChange}
              required
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

          <ReceitaForm onMatriculaChange={setMatriculaProfissional} />

          {medicamentosSelecionados.map((med, index) => (
            <div key={index} className="medicamento-group">
              <div className="form-group">
                <label>Medicamento:</label>
                <select
                  name="idMedicamento"
                  value={med.idMedicamento || ""}
                  onChange={(e) =>
                    handleMedicamentoChange(index, e.target.value)
                  }
                  required
                >
                  <option value="">Selecione o Medicamento</option>
                  {Array.isArray(idMedicamentos) &&
                    idMedicamentos.map((medicamento) => (
                      <option
                        key={medicamento.idMedicamento}
                        value={medicamento.idMedicamento}
                      >
                        {medicamento.nomeMedicamento}
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Controlado:</label>
                <input
                  type="text"
                  name="controlado"
                  value={med.controlado || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Interação Medicamentosa:</label>
                <input
                  type="text"
                  name="instrucaoUso"
                  value={med.interacao || ""}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Dosagem:</label>
                <textarea
                  name="dosagem"
                  value={dosagem}
                  onChange={(e) => setDosagem(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Instrução de uso:</label>
                <textarea
                  name="instrucaoUsoCustom"
                  value={instrucaoUso}
                  onChange={(e) => setInstrucaoUso(e.target.value)}
                  required
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveMedicamento(index)}
                className="remover-medicamento"
              >
                Remover este medicamento
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddMedicamento}
            className="adicionar-medicamento"
          >
            + Adicionar medicamento
          </button>
        </div>
        <div className="flex justify-left">
          <button type="submit" className="emitir-button">
            Emitir Receita
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmitirReceitas;
