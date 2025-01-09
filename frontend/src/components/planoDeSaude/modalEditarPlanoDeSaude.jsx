import React, { useState, useEffect } from "react";
import "./modalPlanoDeSaude.css";
import "../util/geral.css";
import { atualizarPlanoDeSaude } from "../../config/apiServices"; // Importação correta do serviço
import SuccessAlert from "../util/successAlert"; // Supondo que você tenha esse componente de alerta
import moment from "moment";

const ModalEditarPlanoDeSaude = ({ isOpen, onClose, plano, onUpdate }) => {
  const [nomePlanoDeSaude, setNomePlanoDeSaude] = useState(
    plano?.nomePlanoDeSaude || ""
  );
  const [descricao, setDescricao] = useState(plano?.descricao || "");
  const [tipoPlanoDeSaude, setTipoPlanoDeSaude] = useState(
    plano?.tipoPlanoDeSaude || ""
  );
  const [dataInicio, setDataInicio] = useState(
    plano?.dataInicio
      ? moment(plano.dataInicio, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [dataFim, setDataFim] = useState(
    plano?.dataFim
      ? moment(plano.dataFim, "DD/MM/YYYY").format("YYYY-MM-DD")
      : ""
  );
  const [status, setStatus] = useState(plano?.status || "");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Validação dos campos
  const validarCampos = () => {
    const newErros = {};

    if (!nomePlanoDeSaude)
      newErros.nomePlanoDeSaude = "Nome do Plano de Saúde é obrigatório!";
    if (!tipoPlanoDeSaude)
      newErros.tipoPlanoDeSaude = "Tipo do Plano de Saúde é obrigatório!";
    if (!dataInicio) newErros.dataInicio = "Data de início é obrigatória!";
    if (!dataFim) newErros.dataFim = "Data de fim é obrigatória!";
    if (dataFim && new Date(dataFim) < new Date(dataInicio)) {
      newErros.dataFim = "A data de fim não pode ser menor que a data de início.";
    }
    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  // Função para enviar o formulário
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return; // Se houver erro, não submete

    const dadosAtualizados = {
      nomePlanoDeSaude,
      descricao,
      tipoPlanoDeSaude,
      dataInicio,
      dataFim,
      status,
    };

    try {
      await atualizarPlanoDeSaude(plano.idPlanoDeSaude, dadosAtualizados);
      setShowSuccessAlert(true); // Mostra o alerta de sucesso

      onUpdate(); // Atualiza a lista após a edição
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao atualizar Plano de Saúde:", error);
    }
  };

  // Função para manipular o status do plano de saúde
  const handlePlanoDeSaudeChange = (e) => {
    setStatus(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Editar Plano de Saúde</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          {/* Nome do Plano de Saúde */}
          <div>
            <label>Nome do Plano de Saúde:</label>
            <textarea
              value={nomePlanoDeSaude}
              onChange={(e) => setNomePlanoDeSaude(e.target.value)}
            />
            {erros.nomePlanoDeSaude && (
              <small style={{color:"red" }} className="error">{erros.nomePlanoDeSaude}</small>
            )}
          </div>

          {/* Descrição do Plano de Saúde */}
          <div>
            <label>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            {erros.descricao && (
              <small style={{color:"red" }} className="error">{erros.descricao}</small>
            )}
          </div>

          {/* Tipo do Plano de Saúde */}
          <div>
            <label>Tipo do Plano de Saúde:</label>
            <input
              type="text"
              value={tipoPlanoDeSaude}
              onChange={(e) => setTipoPlanoDeSaude(e.target.value)}
            />
            {erros.tipoPlanoDeSaude && (
              <small style={{color:"red" }} className="error">{erros.tipoPlanoDeSaude}</small>
            )}
          </div>

          {/* Data de Início */}
          <div>
            <label>Data de Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
            {erros.dataInicio && (
              <small style={{color:"red" }} className="error">{erros.dataInicio}</small>
            )}
          </div>

          {/* Data de Fim */}
          <div>
            <label>Data de Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
            {erros.dataFim && <small style={{color:"red" }} className="error">{erros.dataFim}</small>}
          </div>

          {/* Status */}
          <div>
            <label>Status:</label>
            <select value={status} onChange={handlePlanoDeSaudeChange}>
              <option value="">Selecione o Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="cancelado">Cancelado</option>
            </select>
            {erros.status && <small style={{color:"red" }} className="error">{erros.status}</small>}
          </div>

          <button type="submit">Salvar Alterações</button>
        </form>
      </div>

      {showSuccessAlert && (
        <SuccessAlert
          message="Plano de Saúde Atualizado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}
    </div>
  );
};

export default ModalEditarPlanoDeSaude;
