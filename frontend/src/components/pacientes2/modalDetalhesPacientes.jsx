import React, { useState, useEffect } from "react";
import "./modalPacientesStyle.css"; // Importando o arquivo CSS

const ModalDetalhesPacientes = ({ isOpen, onClose, pacientes }) => {
  // //console.log(`Remedio ${pacientes}`);

  const [loading, setLoading] = useState(true);

  // Garantir que o medicamento esteja pronto
  useEffect(() => {
    if (pacientes) {
      setLoading(false); // Se os dados do medicamento estiverem carregados, desabilita o "Carregando"
    } else {
      setLoading(true); // Se não, mantém o "Carregando"
    }
  }, [pacientes]);

  if (!isOpen) return null; // Se a modal não estiver aberta, retorna null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <h2>Detalhes do Medicamento</h2>

        {loading ? (
          <p className="loading">Carregando dados...</p>
        ) : (
          pacientes && (
            <div className="modal-det">
              <p>
                <strong>CPF:</strong> {pacientes.cpf}
              </p>
              {/* <p>
                <strong>ID:</strong> {pacientes.id}
              </p> */}
              <p>
                <strong>Nome:</strong> {pacientes.nome}
              </p>
              <p>
                <strong>Sobrenome:</strong> {pacientes.sobrenome}
              </p>
              <p>
                <strong>Sexo:</strong> {pacientes.sexo}
              </p>
              <p>
                <strong>Data de Nascimento:</strong> {pacientes.dataNascimento}
              </p>
              <p>
                <strong>E-mail:</strong> {pacientes.email}
              </p>
              <p>
                <strong>Endereço:</strong> {pacientes.endereco}
              </p>
              <p>
                <strong>Telefone:</strong> {pacientes.telefone}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesPacientes;
