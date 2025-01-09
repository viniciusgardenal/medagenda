import React from "react";
import "./modalPlanoDeSaude.css"; // Importando o arquivo CSS

const ModalDetalhesPlanoDeSaude = ({ isOpen, onClose, planoDeSaude }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Detalhes do Plano de Saúde</h2>
        {planoDeSaude ? (
          <div className="modal-det">
            <p>
              <strong>ID:</strong> {planoDeSaude.idPlanoDeSaude}
            </p>
            <p>
              <strong>Nome Do Plano:</strong> {planoDeSaude.nomePlanoDeSaude}
            </p>
            <p>
              <strong>Descrição:</strong> {planoDeSaude.descricao}
            </p>
            <p>
              <strong>Tipo do Plano:</strong> {planoDeSaude.tipoPlanoDeSaude}
            </p>
            <p>
              <strong>Data de Inicio:</strong> {planoDeSaude.dataInicio}
            </p>
            <p>
              <strong>Data do Fim:</strong> {planoDeSaude.dataFim}
            </p>
            <p>
              <strong>Status:</strong> {planoDeSaude.status}
            </p>
          </div>
        ) : (
          <p className="loading">Carregando dados...</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesPlanoDeSaude;
