import React, { useState, useEffect } from "react";
import "./modalSolicitacaoExamesStyle.css";
import "../util/geral.css";
import {
  criarSolicitacaoExames,
  getTiposExames,
  getPacientes,
} from "../../config/apiServices";
import ReceitaForm from "../receitas/receitaForm";

const ModalSolicitacaoExames = ({ isOpen, onClose, onSave }) => {
  const [idTipoExame, setIdTipoExame] = useState("");
  const [matriculaProfissional, setMatriculaProfissional] = useState("");
  const [cpfPaciente, setCpfPaciente] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [dataCriacao, setDataCriacao] = useState("");
  const [dataRetorno, setDataRetorno] = useState("");
  const [erros, setErros] = useState({});

  const [pacienteSelecionado, setPacienteSelecionado] = useState("");
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState("");

  useEffect(() => {
    // Busca os dados para os selects
    const fetchData = async () => {
      try {
        const [tiposExameResponse, pacientesResponse] = await Promise.all([
          getTiposExames(),
          getPacientes(),
        ]);
        setIdTipoExame(tiposExameResponse.data);
        setCpfPaciente(pacientesResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    fetchData();
  }, []);

  const handlePacienteChange = (event) => {
    const cpfSelecionado = event.target.value;
    setPacienteSelecionado(cpfSelecionado);
  };

  const handleTipoExameChange = (event) => {
    const tipoExame = event.target.value;
    setTipoExameSelecionado(tipoExame);
  };

  const validarCampos = () => {
    const newErros = {};
    if (!tipoExameSelecionado) newErros.tipoExame = "Tipo de exame é obrigatório!";
    if (!pacienteSelecionado) newErros.paciente = "Paciente é obrigatório!";
    if (!periodo) newErros.periodo = "Período é obrigatório!";
    if (!dataCriacao) newErros.dataCriacao = "Data da solicitação é obrigatória!";
    if (!dataRetorno) newErros.dataRetorno = "Data de retorno é obrigatória!";
    if (new Date(dataRetorno) < new Date(dataCriacao)) {
      newErros.dataRetorno = "A data de retorno não pode ser anterior à data da solicitação!";
    }
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return; // Se houver erro, não submete

    const dados = {
      idTipoExame: tipoExameSelecionado,
      periodo,
      dataCriacao,
      dataRetorno,
      status: "Ativo",
      matriculaProfissional: matriculaProfissional,
      cpfPaciente: pacienteSelecionado,
    };

    try {
      await criarSolicitacaoExames(dados);
      onSave();
      onClose();

      // Limpa os campos
      setIdTipoExame("");
      setPeriodo("");
      setDataCriacao("");
      setDataRetorno("");
      setCpfPaciente("");
    } catch (error) {
      console.error("Erro ao adicionar solicitação de exame:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Adicionar Solicitação de Exame</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          {/* Tipo de Exame */}
          <div>
            <label>Tipo de Exame:</label>
            <select
              value={tipoExameSelecionado}
              onChange={handleTipoExameChange}
              required
            >
              <option value="">Selecione o tipo de exame</option>
              {Array.isArray(idTipoExame) &&
                idTipoExame.map((tipo) => (
                  <option key={tipo.idTipoExame} value={tipo.idTipoExame}>
                    {tipo.nomeTipoExame}
                  </option>
                ))}
            </select>
            {erros.tipoExame && <small style={{ color: "red" }}>{erros.tipoExame}</small>}
          </div>

          {/* Matricula Profissional */}
          <ReceitaForm onMatriculaChange={setMatriculaProfissional} />

          {/* Paciente */}
          <div>
            <label>Paciente:</label>
            <select
              value={pacienteSelecionado}
              onChange={handlePacienteChange}
              required
            >
              <option value="">Selecione um paciente</option>
              {Array.isArray(cpfPaciente) &&
                cpfPaciente.map((paciente) => (
                  <option key={paciente.cpf} value={paciente.cpf}>
                    {paciente.nome} {paciente.sobrenome}
                  </option>
                ))}
            </select>
            {erros.paciente && <small style={{ color: "red" }}>{erros.paciente}</small>}
          </div>

          {/* Período */}
          <div>
            <label>Período:</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              required
            >
              <option value="">Selecione o período</option>
              <option value="Manhã">Manhã</option>
              <option value="Tarde">Tarde</option>
              <option value="Noite">Noite</option>
            </select>
            {erros.periodo && <small style={{ color: "red" }}>{erros.periodo}</small>}
          </div>

          {/* Data da Solicitação */}
          <div>
            <label>Data da Solicitação:</label>
            <input
              type="date"
              value={dataCriacao}
              onChange={(e) => setDataCriacao(e.target.value)}
              required
            />
            {erros.dataCriacao && <small style={{ color: "red" }}>{erros.dataCriacao}</small>}
          </div>

          {/* Data de Retorno */}
          <div>
            <label>Data de Retorno:</label>
            <input
              type="date"
              value={dataRetorno}
              onChange={(e) => setDataRetorno(e.target.value)}
              required
            />
            {erros.dataRetorno && <small style={{ color: "red" }}>{erros.dataRetorno}</small>}
          </div>

          <button type="submit">Adicionar Solicitação de Exame</button>
        </form>
      </div>
    </div>
  );
};

export default ModalSolicitacaoExames;
