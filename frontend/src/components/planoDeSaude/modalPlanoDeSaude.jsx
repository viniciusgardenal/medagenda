import React, { useState } from "react";
import "./modalPlanoDeSaude.css";
import "../util/geral.css";
import { criarPlanoDeSaude } from "../../config/apiServices";
import SuccessAlert from "../util/successAlert";
import { RegrasPlanoDeSaude } from "./regrasValidacao";

const ModalPlanoDeSaude = ({ isOpen, onClose, onSave }) => {
  const [nomePlanoDeSaude, setNomePlanoDeSaude] = useState("");
  const [descricao, setDescricao] = useState("");
  const [tipoPlanoDeSaude, setTipoPlanoDeSaude] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState("");
  const [erros, setErros] = useState({});
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [erroDataFim, setErroDataFim] = useState("");

  const validarCampos = () => {
    const newErros = {};

    // Valida cada campo usando as regras definidas em RegrasMedicamento
    Object.keys(RegrasPlanoDeSaude).forEach((campo) => {
      RegrasPlanoDeSaude[campo].forEach((regra) => {
        const valorCampo = eval(campo);
        if (!regra.regra(valorCampo)) {
          newErros[campo] = regra.mensagem;
        }
      });
    });

    setErros(newErros);
    return Object.keys(newErros).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validarCampos()) return;

    const novoPlanoDeSaude = {
      nomePlanoDeSaude,
      descricao,
      tipoPlanoDeSaude,
      dataInicio,
      dataFim,
      status,
    };

    try {
      setIsLoading(true); // Desabilita o botão de envio durante a requisição
      await criarPlanoDeSaude(novoPlanoDeSaude);
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false); // Fecha o alerta após 3 segundos
      }, 3000);
      onSave(); // Atualiza a lista após adicionar
      onClose(); // Fecha o modal

      setNomePlanoDeSaude("");
      setDescricao("");
      setTipoPlanoDeSaude("");
      setDataInicio("");
      setDataFim("");
      setStatus("");
      setErros({});
    } catch (error) {
      console.error("Erro ao criar Plano de Saúde:", error);
    } finally {
      setIsLoading(false); // Reabilita o botão de envio após a requisição
    }
  };

  const handleDataFimChange = (e) => {
    const novaDataFim = e.target.value;
    setDataFim(novaDataFim);

    // Verifica se a data de fim é menor que a data de início
    if (novaDataFim && new Date(novaDataFim) < new Date(dataInicio)) {
      setErroDataFim("A data de fim não pode ser menor que a data de início.");
    } else {
      setErroDataFim(""); // Se a data de fim for válida, remove a mensagem de erro
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Adicionar Plano de Saúde</h2>
        <form className="modal-add" onSubmit={handleSubmit}>
          {/* Nome do Plano de Saúde */}
          <div>
            <label>Nome do Plano de Saúde:</label>
            <input
              value={nomePlanoDeSaude}
              onChange={(e) => setNomePlanoDeSaude(e.target.value)}
              className={erros.nomePlanoDeSaude ? "error-input" : ""}
            />
            {erros.nomePlanoDeSaude && (
              <small style={{ color: "red" }} className="error">
                {erros.nomePlanoDeSaude}
              </small>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label>Descrição:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className={erros.descricao ? "error-input" : ""}
            />
            {erros.descricao && (
              <small style={{ color: "red" }} className="error">
                {erros.descricao}
              </small>
            )}
          </div>

          {/* Tipo de Plano de Saúde */}
          <div>
            <label>Tipo do Plano de Saúde:</label>
            <input
              type="text"
              value={tipoPlanoDeSaude}
              onChange={(e) => setTipoPlanoDeSaude(e.target.value)}
              className={erros.tipoPlanoDeSaude ? "error-input" : ""}
            />
            {erros.tipoPlanoDeSaude && (
              <small style={{ color: "red" }} className="error">
                {erros.tipoPlanoDeSaude}
              </small>
            )}
          </div>

          {/* Data de Início */}
          <div>
            <label>Data de Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => {
                setDataInicio(e.target.value);
                setDataFim(""); // Limpa a data de fim quando a data de início mudar
                setErroDataFim(""); // Remove a mensagem de erro ao mudar a data de início
              }}
            />
            {erros.dataInicio && (
              <small style={{ color: "red" }} className="error">
                {erros.dataInicio}
              </small>
            )}
          </div>

          {/* Data de Fim */}
          <div>
            <label>Data de Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={handleDataFimChange}
              min={dataInicio || ""}
            />
            {erros.dataFim && (
              <small style={{ color: "red" }} className="error">
                {erros.dataFim}
              </small>
            )}
          </div>

          {/* Status */}
          <div>
            <label>Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Selecione o Status</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            {erros.status && (
              <small style={{ color: "red" }} className="error">
                {erros.status}
              </small>
            )}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Plano de Saúde"}
          </button>
        </form>

        {showSuccessAlert && (
          <SuccessAlert
            message="Plano de Saúde criado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ModalPlanoDeSaude;
