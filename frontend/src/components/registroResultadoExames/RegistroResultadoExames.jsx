import React, { useState, useEffect } from 'react';
import {
    getRegistrosInativosResultadoExames,
    atualizarRegistroResultadoExame,
} from "../../config/apiServices";
import ModalEditObservacao from './ModalEditObservacao';
import ModalAddObservacao from './modalAddObservacao';
import ModalViewObservacao from './ModalViewObservacao';
import FiltroRegistroResultadoExames from './filtroRegistroResultadoExames';

// Componente para cada linha da tabela
const TableRow = ({ registro, onAdd, onEdit, onView }) => {
    const resultadoDefinido = registro.observacoes && registro.observacoes.trim() !== "";

    return (
        <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition-colors text-left">
            <td className="py-3 px-2 text-gray-700 text-sm">{registro.idRegistro}</td>
            <td className="py-3 px-2 text-gray-700 text-sm">{registro.solicitacaoExame.idSolicitacaoExame}</td>
            <td className="py-3 px-2 text-gray-700 text-sm">{registro.profissional.nome}</td>
            <td className="py-3 px-2 text-gray-700 text-sm">{registro.paciente.nome}</td>
            <td className="py-3 px-2">
                {resultadoDefinido ? (
                    <span className="bg-green-500 text-white px-3 py-1.5 rounded-md font-semibold text-sm flex items-center gap-1">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        Registrado
                    </span>
                ) : (
                    <button
                        onClick={() => onAdd(registro)}
                        className="bg-orange-500 text-white px-3 py-1.5 rounded-md font-semibold text-sm hover:bg-orange-600 transition-colors flex items-center text-left gap-1"
                        title="Definir Resultado"
                        aria-label="Definir resultado do exame"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Definir
                    </button>
                )}
            </td>
            <td className="py-3 px-2 flex gap-2 justify-center">
                <button
                    onClick={() => onEdit(registro)}
                    className="bg-[#001233] text-white p-2 rounded-md hover:bg-[#153a80] transition-colors"
                    title="Editar Resultado"
                    aria-label="Editar resultado do exame"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </button>
                <button
                    onClick={() => onView(registro)}
                    className="bg-[#001233] text-white p-2 rounded-md hover:bg-[#153a80] transition-colors"
                    title="Visualizar Resultado"
                    aria-label="Visualizar resultado do exame"
                >
                     <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
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
        <section className="container mx-auto my-10 p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-3xl text-gray-800 font-bold text-center mb-6">Resultados de Exames</h2>

            <FiltroRegistroResultadoExames onFiltroChange={handleFiltroChange} />

            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-3">
                    <p className="text-gray-600">Carregando registros...</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-lg shadow-md">
                    <table className="min-w-full bg-white rounded-lg shadow-md">
                        <thead className="bg-gray-100">
                            <tr>
                                {[
                                    "ID Registro",
                                    "Solicitação de Exame",
                                    "Profissional",
                                    "Paciente",
                                    "Definir Resultado",
                                    "Ações"
                                ].map((header) => (
                                    <th
                                        key={header}
                                        className="py-3 px-2 text-[#001233] font-semibold text-xs uppercase tracking-wider"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {registrosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-3 px-2 text-center text-gray-500">
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
        </section>
    );
};

export default RegistroResultadoExames;