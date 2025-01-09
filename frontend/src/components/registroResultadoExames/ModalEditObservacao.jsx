import React from 'react';
import "./RegistroResultadoExamesStyles.css";

const ModalEditObservacao = ({ isOpen, onClose, registro, observacaoEditada, setObservacaoEditada, onSave }) => {
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        setObservacaoEditada(e.target.value);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>X</button>
                <h2>Editar Observações</h2>
                <div>
                    <label>Observações:</label>
                    <textarea
                        value={observacaoEditada}
                        onChange={handleInputChange}
                        placeholder="Editar observações"
                    />
                </div>
                <button onClick={() => onSave(registro.idRegistro)}>Salvar</button>
            </div>
        </div>
    );
};

export default ModalEditObservacao;
