import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    Edit, 
    BookOpenCheck, 
    X, 
    Save 
} from 'lucide-react';
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
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await getRegistrosInativosResultadoExames();
                setRegistros(response.data.data || []);
            } catch (error) {
                console.error("Erro ao carregar registros:", error);
                setError("Erro ao carregar os registros. Tente novamente mais tarde.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const fetchRegistrosInativos = async () => {
        const response = await getRegistrosInativosResultadoExames();
        setRegistros(response.data.data);
    };

    const handleObservacaoChange = (e) => {
        setObservacaoEditada(e.target.value);
    };

    const handleUpdateObservacao = async (idRegistro) => {
        setError(null);
        try {
            const updatedRegistro = { observacoes: observacaoEditada };
            await atualizarRegistroResultadoExame(idRegistro, updatedRegistro);
            fetchRegistrosInativos();
            setObservacaoEditada(""); // Clear input after update
            setModalOpen(false); // Close modal after update
        } catch (error) {
            console.error("Erro ao atualizar observação:", error);
            setError("Erro ao atualizar o resultado. Tente novamente.");
        }
    };

    const openAddModal = (registro) => {
        setRegistroSelecionado(registro);
        setObservacaoEditada(registro.observacoes || "");
        setModalAddOpen(true);
    };

    const openEditModal = (registro) => {
        setRegistroSelecionado(registro);
        setObservacaoEditada(registro.observacoes || "");
        setModalEditOpen(true);
    };

    const openViewModal = (registro) => {
        setRegistroSelecionado(registro);
        setModalViewOpen(true);
    };

    const closeModal = () => {
        setModalAddOpen(false);
        setModalEditOpen(false);
        setModalViewOpen(false);
        setRegistroSelecionado(null);
        setObservacaoEditada("");
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'pendente': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'concluído': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelado': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    // Lógica de paginação
    const indexOfLastRegistro = currentPage * registrosPerPage;
    const indexOfFirstRegistro = indexOfLastRegistro - registrosPerPage;
    const currentRegistros = registros.slice(indexOfFirstRegistro, indexOfLastRegistro);
    const totalPages = Math.ceil(registros.length / registrosPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

            {modalAddOpen && registroSelecionado && (
                <ModalAddObservacao
                    isOpen={modalAddOpen}
                    onClose={closeModal}
                    registro={registroSelecionado}
                    observacaoEditada={observacaoEditada}
                    setObservacaoEditada={setObservacaoEditada}
                    onSave={handleUpdateObservacao}
                />
            )}

            {modalEditOpen && registroSelecionado && (
                <ModalEditObservacao
                    isOpen={modalEditOpen}
                    onClose={closeModal}
                    registro={registroSelecionado}
                    observacaoEditada={observacaoEditada}
                    setObservacaoEditada={setObservacaoEditada}
                    onSave={handleUpdateObservacao}
                />
            )}

            {modalViewOpen && registroSelecionado && (
                <ModalViewObservacao
                    isOpen={modalViewOpen}
                    onClose={closeModal}
                    registro={registroSelecionado}
                />
            )}
        </section>
    );
};

export default RegistroResultadoExames;