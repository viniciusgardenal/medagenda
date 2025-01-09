import React from "react";
import "./modalTipoConsultaStyle.css"; // Importando o arquivo CSS

const ModalDetalhesTipoConsulta = ({ isOpen, onClose, tipoConsulta }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Detalhes do Tipo de Consulta</h2>
        {tipoConsulta ? (
          <div className="modal-det">
            <p>
              <strong>ID:</strong> {tipoConsulta.idTipoConsulta}
            </p>
            <p>
              <strong>Nome:</strong> {tipoConsulta.nomeTipoConsulta}
            </p>
            <p>
              <strong>Descrição:</strong> {tipoConsulta.descricao}
            </p>
            <p>
              <strong>Especialidade:</strong> {tipoConsulta.especialidade}
            </p>
            <p>
              <strong>Duração Estimada (min):</strong> {tipoConsulta.duracaoEstimada}
            </p>
            <p>
              <strong>Requisitos Específicos:</strong>{" "}
              {tipoConsulta.requisitosEspecificos}
            </p>
            <p>
              <strong>Prioridade:</strong> {tipoConsulta.prioridade}
            </p>
            <p>
              <strong>Data de Criação:</strong> {tipoConsulta.dataCriacao}
            </p>
            <p>
              <strong>Status:</strong> {tipoConsulta.status}
            </p>
          </div>
        ) : (
          <p className="loading">Carregando dados...</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesTipoConsulta;
