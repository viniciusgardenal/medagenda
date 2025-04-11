import React, { useState, useEffect } from 'react';
import {
    getRegistrosInativosResultadoExames,
    atualizarRegistroResultadoExame,
} from "../../config/apiServices";
import ModalEditObservacao from './ModalEditObservacao';
import ModalAddObservacao from './modalAddObservacao';
import ModalViewObservacao from './ModalViewObservacao';
import FiltroRegistroResultadoExames from './filtroRegistroResultadoExames';

const TableRow = ({ registro, onAdd, onEdit, onView }) => {
    const resultadoDefinido = registro.observacoes && registro.observacoes.trim() !== "";

    return (
        <tr className="hover:bg-blue-50 transition-colors">
            <td className="px-4 py-3 text-sm text-gray-700">{registro.idRegistro}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{registro.solicitacaoExame.idSolicitacaoExame}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{registro.tiposExame?.nomeTipoExame}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{registro.solicitacaoExame.dataSolicitacao}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{registro.profissional.nome}</td>
            <td className="px-4 py-3 text-sm text-gray-700">{registro.paciente.nome}</td>
            <td className="px-4 py-3">
                {resultadoDefinido ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Registrado
                    </span>
                ) : (
                    <button
                        onClick={() => onAdd(registro)}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow hover:bg-orange-700 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Definir
                    </button>
                )}
            </td>
            <td className="px-4 py-3 flex gap-3">
                <button
                    onClick={() => onEdit(registro)}
                    className="text-green-500 hover:text-green-700"
                    title="Editar Resultado"
                    aria-label="Editar resultado do exame"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button
                    onClick={() => onView(registro)}
                    className="text-blue-500 hover:text-blue-700"
                    title="Visualizar Resultado"
                    aria-label="Visualizar resultado do exame"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
            </td>
        </tr>
    );
};

const RegistroResultadoExames = () => {
    const [registros, setRegistros] = useState([]);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [modalViewOpen, setModalViewOpen] = useState(false);
    const [registroSelecionado, setRegistroSelecionado] = useState(null);
    const [observacaoEditada, setObservacaoEditada] = useState("");
    const [filtros, setFiltros] = useState({ filtroId: '', filtroNome: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const handleFiltroChange = (novosFiltros) => {
        setFiltros(novosFiltros);
    };

    const registrosFiltrados = registros.filter((registro) => {
        const { filtroId, filtroNome } = filtros;
        const idMatch = filtroId
            ? String(registro.idRegistro).toLowerCase().includes(filtroId.toLowerCase()) ||
              String(registro.solicitacaoExame.idSolicitacaoExame).toLowerCase().includes(filtroId.toLowerCase())
            : true;
        const nomeMatch = filtroNome
            ? registro.profissional.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
              registro.paciente.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
              (registro.observacoes && registro.observacoes.toLowerCase().includes(filtroNome.toLowerCase()))
            : true;
        return idMatch && nomeMatch;
    });

    const handleUpdateObservacao = async (idRegistro) => {
        setError(null);
        try {
            await atualizarRegistroResultadoExame(idRegistro, { observacoes: observacaoEditada });
            const response = await getRegistrosInativosResultadoExames();
            setRegistros(response.data.data || []);
            setModalAddOpen(false);
            setModalEditOpen(false);
            setObservacaoEditada("");
            setRegistroSelecionado(null);
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

    return (
        <div className="min-h-screen bg-gray-200 backdrop-blur-sm p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
                <div className="border-b pb-4">
                    <h2 className="text-3xl font-bold text-blue-600">Resultados de Exames</h2>
                </div>

                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
                        {error}
                    </div>
                )}

                <FiltroRegistroResultadoExames onFiltroChange={handleFiltroChange} />

                {isLoading ? (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-500">Carregando registros...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-blue-600 text-white">
                                <tr>
                                    {["ID Registro", "Solicitação de Exame", "Nome do Exame", "Data da Solicitação","Profissional", "Paciente", "Definir Resultado", "Ações"].map((header, index) => (
                                        <th
                                            key={header}
                                            className={`px-4 py-3 text-left text-sm font-semibold `}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {registrosFiltrados.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                                            Nenhum registro encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    registrosFiltrados.map((registro) => (
                                        <TableRow
                                            key={registro.idRegistro}
                                            registro={registro}
                                            onAdd={openAddModal}
                                            onEdit={openEditModal}
                                            onView={openViewModal}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

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
            </div>
        </div>
    );
};

export default RegistroResultadoExames;