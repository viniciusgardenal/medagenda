import React, { useState } from "react";
import "./modalTipoConsultaStyle.css";
import "../util/geral.css";
import { criarTipoConsulta } from "../../config/apiServices";
import ValidadorGenerico from "../util/validadorGenerico";
import { RegrasTipoConsulta } from "./regrasValidacao";

const ModalTipoConsulta = ({ isOpen, onClose, onSave }) => {
  const [nomeTipoConsulta, setNomeTipoConsulta] = useState("");
  const [descricao, setDescricao] = useState("");
  const [especialidade, setEspecialidade] = useState(""); // Novo campo
  const [duracaoEstimada, setDuracaoEstimada] = useState(""); // Novo campo
  const [requisitosEspecificos, setRequisitosEspecificos] = useState(""); // Novo campo
  const [prioridade, setPrioridade] = useState(""); // Alterado para garantir valor
  const [dataCriacao, setDataCriacao] = useState(""); // Corrigido para guardar data
  const [status, setStatus] = useState("ativo"); // Corrigido para garantir valor inicial
  const [erros, setErros] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const dados = {
      nomeTipoConsulta,
      descricao,
      especialidade,
      duracaoEstimada,
      requisitosEspecificos,
      prioridade,
      dataCriacao,
      status,
    };

    const errosValidacao = ValidadorGenerico(dados, RegrasTipoConsulta);

    if (errosValidacao) {
      setErros(errosValidacao);
      return;
    }

    try {
      await criarTipoConsulta(dados);
      onSave();
      onClose();

      setNomeTipoConsulta("");
      setDescricao("");
      setEspecialidade("");
      setDuracaoEstimada("");
      setRequisitosEspecificos("");
      setPrioridade("");
      setDataCriacao("");
      setStatus("");
      setErros({});
    } catch (error) {
      console.error("Erro ao adicionar tipo de consulta:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Adicionar Tipo de Consulta</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Nome da Consulta:</label>
            <input
              type="text"
              value={nomeTipoConsulta}
              onChange={(e) => setNomeTipoConsulta(e.target.value)}
            />
            {erros.nomeTipoConsulta && (
              <small style={{ color: "red" }} className="erro">
                {erros.nomeTipoConsulta}
              </small>
            )}
          </div>

          <div>
            <label>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            {erros.descricao && (
              <small style={{ color: "red" }} className="erro">
                {erros.descricao}
              </small>
            )}
          </div>

          <div>
            <label>Especialidade:</label>
            <input
              type="text"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
            />
            {erros.especialidade && (
              <small style={{ color: "red" }} className="erro">
                {erros.especialidade}
              </small>
            )}
          </div>

          <div>
            <label>Duração Estimada (min):</label>
            <input
              type="number"
              value={duracaoEstimada}
              onChange={(e) => setDuracaoEstimada(e.target.value)}
            />
            {erros.duracaoEstimada && (
              <small style={{ color: "red" }} className="erro">
                {erros.duracaoEstimada}
              </small>
            )}
          </div>

          <div>
            <label>Requisitos Específicos:</label>
            <textarea
              value={requisitosEspecificos}
              onChange={(e) => setRequisitosEspecificos(e.target.value)}
            />
            {erros.requisitosEspecificos && (
              <small style={{ color: "red" }} className="erro">
                {erros.requisitosEspecificos}
              </small>
            )}
          </div>

          <div>
            <label>Prioridade:</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
            >
              <option>Selecione a Prioridade</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
            {erros.prioridade && (
              <small style={{ color: "red" }} className="erro">
                {erros.prioridade}
              </small>
            )}
          </div>

          <div>
            <label>Data de Criação:</label>
            <input
              type="date"
              value={dataCriacao} // Valor associado ao estado
              onChange={(e) => setDataCriacao(e.target.value)} // Atualiza o estado corretamente
            />
            {erros.dataCriacao && (
              <small style={{ color: "red" }} className="erro">
                {erros.dataCriacao}
              </small>
            )}
          </div>

          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>Selecione o Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
            {erros.status && (
              <small style={{ color: "red" }} className="erro">
                {erros.status}
              </small>
            )}
          </div>

          <button type="submit">Adicionar Consulta</button>
        </form>
      </div>
    </div>
  );
};

export default ModalTipoConsulta;
