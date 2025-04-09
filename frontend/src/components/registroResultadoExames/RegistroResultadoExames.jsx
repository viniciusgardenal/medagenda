import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import FiltroRegistroResultadoExames from "./filtroRegistroResultadoExames";
import {
  getRegistrosInativosResultadoExames,
  atualizarRegistroResultadoExame,
  getRegistrosInativosResultadoExames,
  atualizarRegistroResultadoExame,
} from "../../config/apiServices";
import ModalEditObservacao from "./ModalEditObservacao";
import ModalAddObservacao from "./modalAddObservacao";
import ModalViewObservacao from "./ModalViewObservacao";

// Componente para cada linha da tabela
const TableRow = ({ registro, onAdd, onEdit, onView }) => {
  const resultadoDefinido = registro.observacoes && registro.observacoes.trim() !== "";

  return (
    <tr className="hover:bg-gray-100">
      <td className="px-4 py-3 text-sm text-gray-700">{registro.idRegistro}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{registro.solicitacaoExame.idSolicitacaoExame}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{registro.profissional.nome}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{registro.paciente.nome}</td>
      <td className="px-4 py-3">
        {resultadoDefinido ? (
          <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
            className="inline-flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm font-medium hover:bg-orange-200 transition-colors duration-150"
            title="Definir Resultado"
            aria-label="Definir resultado do exame"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
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
      <td className="px-4 py-3 text-sm text-gray-700 flex space-x-2">
        <button
          onClick={() => onEdit(registro)}
          className="text-blue-600 hover:text-blue-800 transition-colors duration-150"
          title="Editar Resultado"
          aria-label="Editar resultado do exame"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
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
          className="text-indigo-600 hover:text-indigo-800 transition-colors duration-150"
          title="Visualizar Resultado"
          aria-label="Visualizar resultado do exame"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
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
  const [filtros, setFiltros] = useState({ filtroId: "", filtroNome: "" });
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
    const idMatch =
      filtroId
        ? String(registro.idRegistro)
            .toLowerCase()
            .includes(filtroId.toLowerCase()) ||
          String(registro.solicitacaoExame.idSolicitacaoExame)
            .toLowerCase()
            .includes(filtroId.toLowerCase())
        : true;
    const nomeMatch =
      filtroNome
        ? registro.profissional.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
          registro.paciente.nome.toLowerCase().includes(filtroNome.toLowerCase()) ||
          (registro.observacoes &&
            registro.observacoes.toLowerCase().includes(filtroNome.toLowerCase()))
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="max-h-[70vh] overflow-y-auto"><div className="flex items-center mb-8 ml-8 mt-4">
                <BookOpenCheck className="mr-4 text-indigo-600" size={36} />
                <h2 className="text-3xl font-bold text-gray-900">Registrar Resultados de Exames</h2>
            </div>
                    <table className="w-full table-auto">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Solicitação</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Profissional</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Resultado</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentRegistros.map((registro) => (
                                <tr key={registro.idRegistro} className="hover:bg-gray-50 transition-colors duration-150">
                                    <td className="px-6 py-4 text-sm text-gray-700">{registro.idRegistro}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{registro.solicitacaoExame.idSolicitacaoExame}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{registro.profissional.nome}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{registro.paciente.nome}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusStyle(registro.status)}`}>
                                            {registro.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 truncate max-w-xs" title={registro.observacoes || 'Sem observações'}>
                                        {registro.observacoes || 'Sem observações'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => openModal(registro)}
                                            className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm font-medium transition-colors"
                                        >
                                            <Edit size={16} className="mr-2" /> Definir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                        Mostrando {indexOfFirstRegistro + 1} a {Math.min(indexOfLastRegistro, registros.length)} de {registros.length} registros
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded-lg ${currentPage === page ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-all`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Próximo
                        </button>
                    </div>
                </div>
            )}

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
