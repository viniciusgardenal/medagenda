import React, { useState, useEffect } from "react";
import "./modalTipoConsultaStyle.css";
import "../util/geral.css";
import { updateTipoConsulta } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import moment from "moment";

const ModalEditarTipoConsulta = ({
  isOpen,
  onClose,
  tipoConsulta,
  onUpdate,
}) => {
  const [nomeTipoConsulta, setNomeTipoConsulta] = useState(
    tipoConsulta?.nomeTipoConsulta || ""
  );
  const [descricao, setDescricao] = useState(tipoConsulta?.descricao || "");
  const [especialidade, setEspecialidade] = useState(
    tipoConsulta?.especialidade || ""
  );
  const [duracaoEstimada, setDuracaoEstimada] = useState(
    tipoConsulta?.duracaoEstimada || ""
  );
  const [requisitosEspecificos, setRequisitosEspecificos] = useState(
    tipoConsulta?.requisitosEspecificos || ""
  );
  const [prioridade, setPrioridade] = useState(tipoConsulta?.prioridade || "");
  //console.log(tipoConsulta.dataCriacao);

  const [dataCriacao, setDataCriacao] = useState(
    tipoConsulta?.dataCriacao
      ? moment(tipoConsulta.dataCriacao, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [status, setStatus] = useState(tipoConsulta?.status || "ativo");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validação dos dados
  const validarCampos = () => {
    const newErros = {};
    if (!nomeTipoConsulta)
      newErros.nomeTipoConsulta = "O nome do tipo de consulta é obrigatório!";
    if (!duracaoEstimada)
      newErros.duracaoEstimada = "A duração estimada é obrigatória!";
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validarCampos()) return;

    const dadosAtualizados = {
      nomeTipoConsulta,
      descricao,
      especialidade,
      duracaoEstimada,
      requisitosEspecificos,
      prioridade,
      dataCriacao,
      status,
    };

    try {
      await updateTipoConsulta(tipoConsulta.idTipoConsulta, dadosAtualizados);
      setShowSuccessAlert(true);
      onUpdate(); // Atualiza a lista de tipos de consulta
      onClose(); // Fecha a modal
    } catch (error) {
      console.error("Erro ao atualizar tipo de consulta:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        {showSuccessAlert && (
          <SuccessAlert
            message="Tipo de consulta atualizado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        <h2>Editar Tipo de Consulta</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          <div>
            <label>Nome do Tipo de Consulta:</label>
            <input
              type="text"
              value={nomeTipoConsulta}
              onChange={(e) => setNomeTipoConsulta(e.target.value)}
            />
            {erros.nomeTipoConsulta && (
              <small style={{color: "red"}} className="error">{erros.nomeTipoConsulta}</small>
            )}
          </div>
          <div>
            <label>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Especialidade:</label>
            <input
              type="text"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              required
            />
            {erros.especialidade && (
              <small style={{color: "red"}} className="error">{erros.especialidade}</small>
            )}
          </div>
          <div>
            <label>Duração Estimada (min):</label>
            <input
              type="number"
              value={duracaoEstimada}
              onChange={(e) => setDuracaoEstimada(e.target.value)}
              required
            />
            {erros.duracaoEstimada && (
              <small style={{color: "red"}}  className="error">{erros.duracaoEstimada}</small>
            )}
          </div>
          <div>
            <label>Requisitos Específicos:</label>
            <textarea
              value={requisitosEspecificos}
              onChange={(e) => setRequisitosEspecificos(e.target.value)}
              required
            />
            {erros.requisitosEspecificos && (
              <small style={{color: "red"}}  className="error">{erros.requisitosEspecificos}</small>
            )}
          </div>
          <div>
            <label>Prioridade:</label>
            <select
              value={prioridade}
              onChange={(e) => setPrioridade(e.target.value)}
              required
            >
              <option value="">Selecione a Prioridade</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
            {erros.prioridade && (
              <small style={{color: "red"}}  className="error">{erros.prioridade}</small>
            )}
          </div>
          <div>
            <label>Data de Criação:</label>
            <input
              type="date"
              value={dataCriacao}
              onChange={(e) => setDataCriacao(e.target.value)} // Atualiza o estado corretamente
              required
            />
            {erros.dataCriacao && (
              <small style={{color: "red"}} className="erro">{erros.dataCriacao}</small>
            )}
          </div>
          <div>
            <label>Status:</label>
            <select required value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          
          <button type="submit">Salvar Alterações</button>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarTipoConsulta;
