import React, { useState, useEffect } from "react";
import "./modalMedicamentosStyle.css"; // Importando o arquivo CSS

const ModalDetalhesMedicamentos = ({ isOpen, onClose, medicamentos }) => {
  // //console.log(`Remedio ${medicamentos}`);

  const [loading, setLoading] = useState(true);

  // Garantir que o medicamento esteja pronto
  useEffect(() => {
    if (medicamentos) {
      setLoading(false); // Se os dados do medicamento estiverem carregados, desabilita o "Carregando"
    } else {
      setLoading(true); // Se não, mantém o "Carregando"
    }
  }, [medicamentos]);

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
          medicamentos && (
            <div className="modal-det">
              <p>
                <strong>ID:</strong> {medicamentos.idMedicamento}
              </p>
              <p>
                <strong>Nome:</strong> {medicamentos.nomeMedicamento}
              </p>
              {/* <p>
                <strong>Dosagem:</strong> {medicamentos.dosagem}
              </p> */}
              <p>
                <strong>Controlado:</strong> {medicamentos.controlado}
              </p>
              <p>
                <strong>Fabricante:</strong> {medicamentos.nomeFabricante}
              </p>
              <p>
                <strong>Descrição:</strong> {medicamentos.descricao}
              </p>
              <p>
                <strong>Instrução de Uso:</strong> {medicamentos.instrucaoUso}
              </p>
              <p>
                <strong>Interações Medicamentosas:</strong> {medicamentos.interacao}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ModalDetalhesMedicamentos;
