import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./RegistroResultadoExamesStyles.css";
import ModalEditObservacao from './ModalEditObservacao'; // Importing the modal component

import {
    getRegistrosInativosResultadoExames,
    atualizarRegistroResultadoExame,
} from "../../config/apiServices";

const RegistroResultadoExames = () => {
    const [registros, setRegistros] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [registroSelecionado, setRegistroSelecionado] = useState(null); // Store selected record for editing
    const [observacaoEditada, setObservacaoEditada] = useState("");

    useEffect(() => {
        fetchRegistrosInativos();
    }, []);

    const fetchRegistrosInativos = async () => {
        const response = await getRegistrosInativosResultadoExames();
        setRegistros(response.data.data);
    };

    const handleObservacaoChange = (e) => {
        setObservacaoEditada(e.target.value);
    };

    const handleUpdateObservacao = async (idRegistro) => {
        try {
            const updatedRegistro = { observacoes: observacaoEditada };
            await atualizarRegistroResultadoExame(idRegistro, updatedRegistro);
            fetchRegistrosInativos();
            setObservacaoEditada(""); // Clear input after update
            setModalOpen(false); // Close modal after update
        } catch (error) {
            console.error("Erro ao atualizar observação:", error);
        }
    };

    const openModal = (registro) => {
        setRegistroSelecionado(registro);
        setObservacaoEditada(registro.observacoes || "");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setRegistroSelecionado(null);
        setObservacaoEditada("");
    };

    return (
        <div className="registro-resultados-exames">
            <h2>Resultados de Exames</h2>

            <table className="registro-resultados-table">
                <thead>
                    <tr>
                        <th>ID Registro</th>
                        <th>Solicitação de Exame</th>
                        <th>Profissional</th>
                        <th>Paciente</th>
                        <th>Status</th>
                        <th>Resultado</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map((registro) => (
                        <tr key={registro.idRegistro}>
                            <td>{registro.idRegistro}</td>
                            <td>{registro.solicitacaoExame.idSolicitacaoExame}</td>
                            <td>{registro.profissional.nome}</td>
                            <td>{registro.paciente.nome}</td>
                            <td>{registro.status}</td>
                            <td>{registro.observacoes}</td>
                            <td>
                                <button onClick={() => openModal(registro)}>
                                    Definir Resultado
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {modalOpen && (
                <ModalEditObservacao
                    isOpen={modalOpen}
                    onClose={closeModal}
                    registro={registroSelecionado}
                    observacaoEditada={observacaoEditada}
                    setObservacaoEditada={setObservacaoEditada}
                    onSave={handleUpdateObservacao}
                />
            )}
        </div>
    );
};

export default RegistroResultadoExames;
