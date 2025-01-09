import React from "react";
import "./modalProfissional.css"; // Importando o arquivo CSS
import { aplicarMascaraCRM } from "../util/mascaras";

const ModalDetalhesProfissional = ({ isOpen, onClose, profissional }) => {
  //console.log(profissional);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>
          <button className="modal-close-button" onClick={onClose}>
            X
          </button>
        </div>

        <h2>Detalhes do Profissional</h2>
        {profissional ? (
          <div className="modal-det">
            <p>
              <strong>Nome:</strong> {profissional.nome}
            </p>
            <p>
              <strong>Email:</strong> {profissional.email}
            </p>
            <p>
              <strong>Telefone:</strong> {profissional.telefone}
            </p>
            <p>
              <strong>Tipo:</strong> {profissional.tipoProfissional}
            </p>
            {/* Condicional para atributos específicos */}
            {profissional.tipoProfissional === "Medico" && (
              <p>
                <strong>CRM:</strong> {aplicarMascaraCRM(profissional.crm)}
              </p>
            )}
            {profissional.tipoProfissional === "Atendente" && (
              <p>
                <strong>Setor:</strong> {profissional.setor}
              </p>
            )}
            {profissional.tipoProfissional === "Diretor" && (
              <p>
                <strong>Departamento:</strong> {profissional.departamento}
              </p>
            )}
            <p>
              <strong>Data de Nascimento:</strong> {profissional.dataNascimento}
            </p>
            <p>
              <strong>Data de Admissão:</strong> {profissional.dataAdmissao}
            </p>
            <p>
              <strong>Matricula:</strong> {profissional.matricula}
            </p>
          </div>
        ) : (
          <p className="loading">Carregando dados...</p>
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesProfissional;
