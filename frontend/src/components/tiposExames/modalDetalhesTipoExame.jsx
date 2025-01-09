import React from "react";
import "./modalTipoExame.css"; // Importando o arquivo CSS

const ModalDetalhesTipoExame = ({ isOpen, onClose, tipoExame }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Detalhes do TipoExame</h2>
        {tipoExame ? (
          <div className="modal-det">
            <p>
              <strong>Codigo:</strong> {tipoExame.idTipoExame}
            </p>
            <p>
              <strong>Tipo Exame:</strong> {tipoExame.nomeTipoExame}
            </p>
            <p>
              <strong>Material Coletado:</strong> {tipoExame.materialColetado}
            </p>
            <p>
              <strong>Tempo em Jejum (Horas):</strong> {tipoExame.tempoJejum}
            </p>
            <p>
              <strong>Categoria:</strong> {tipoExame.categoria}
            </p>
            <p>
              <strong>Observação:</strong> {tipoExame.observacao}
            </p>
          </div>
        ) : (
          <p className="loading">Carregando dados...</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesTipoExame;
