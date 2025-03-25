<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import FiltroRegistroResultadoExames from "./filtroRegistroResultadoExames";
=======
import React, { useState, useEffect } from 'react';
import { 
    FileText, 
    Edit, 
    BookOpenCheck, 
    X, 
    Save 
} from 'lucide-react';
>>>>>>> c7ec108 (update styles)
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

const ModalEditObservacao = ({ 
    isOpen, 
    onClose, 
    registro, 
    observacaoEditada, 
    setObservacaoEditada, 
    onSave 
}) => {
    if (!isOpen) return null;

    const handleSave = () => {
        onSave(registro.idRegistro);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 transform transition-all duration-300 scale-100">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <FileText className="mr-3 text-indigo-600" size={26} />
                        Resultado do Exame
                    </h2>
                    <button 
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Detalhes</label>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium text-gray-800">Paciente:</span> {registro.paciente.nome}
                            </p>
                            <p className="text-sm text-gray-600 mb-2">
                                <span className="font-medium text-gray-800">Solicitação:</span> {registro.solicitacaoExame.idSolicitacaoExame}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium text-gray-800">Profissional:</span> {registro.profissional.nome}
                            </p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="observacao" className="block text-sm font-semibold text-gray-700 mb-2">
                            Observações
                        </label>
                        <textarea
                            id="observacao"
                            value={observacaoEditada}
                            onChange={(e) => setObservacaoEditada(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all min-h-[100px] text-gray-700 placeholder-gray-400"
                            placeholder="Digite as observações aqui..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button 
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center font-medium"
                    >
                        <Save className="mr-2" size={18} />
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

const RegistroResultadoExames = () => {
<<<<<<< HEAD
  const [registros, setRegistros] = useState([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [registroSelecionado, setRegistroSelecionado] = useState(null);
  const [observacaoEditada, setObservacaoEditada] = useState("");
  const [filtros, setFiltros] = useState({ filtroId: "", filtroNome: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
=======
    const [registros, setRegistros] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [registroSelecionado, setRegistroSelecionado] = useState(null);
    const [observacaoEditada, setObservacaoEditada] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const registrosPerPage = 10;
>>>>>>> c7ec108 (update styles)

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

<<<<<<< HEAD
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
=======
    const handleUpdateObservacao = async (idRegistro) => {
        try {
            const updatedRegistro = { observacoes: observacaoEditada };
            await atualizarRegistroResultadoExame(idRegistro, updatedRegistro);
            fetchRegistrosInativos();
            setObservacaoEditada("");
            setModalOpen(false);
        } catch (error) {
            console.error("Erro ao atualizar observação:", error);
        }
    };
>>>>>>> c7ec108 (update styles)

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

<<<<<<< HEAD
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            

=======
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            

>>>>>>> c7ec108 (update styles)
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