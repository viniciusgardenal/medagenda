import React, { useState, useEffect, useCallback, useMemo } from "react";
import ConfirmationModal from "../util/confirmationModal";
import {
  getSolicitacaoExames,
  criarSolicitacaoExames,
  excluirSolicitacaoExames,
  updateSolicitacaoExames,
} from "../../config/apiServices";
// AJUSTE: Corrigindo nomes dos arquivos para minúsculas
import ModalSolicitacaoExames from "./modalSolicitacaoExames";
import TabelaSolicitacaoExames from "./tabelaSolicitacaoExames";
import ModalEditarSolicitacaoExames from "./modalEditarSolicitacaoExames";
import ModalDetalhesSolicitacaoExames from "./modalDetalhesSolicitacaoExames";
import Pagination from "../util/Pagination";
import { FaPlus, FaVial, FaFilter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SolicitacaoExames = () => {
  const [solicitacaoExames, setSolicitacaoExames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);

  const [filtros, setFiltros] = useState({ paciente: "", tipoExame: "", dataSolicitacao: "" });
  const [sortField, setSortField] = useState("dataSolicitacao");
  const [sortDirection, setSortDirection] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const loadSolicitacaoExames = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getSolicitacaoExames();
      const data = Array.isArray(response.data) ? response.data : [];
      const cleanData = data.filter(item => item && item.idSolicitacaoExame);
      setSolicitacaoExames(cleanData);
    } catch (error) {
      toast.error("Erro ao carregar solicitações.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSolicitacaoExames();
  }, [loadSolicitacaoExames]);
  
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };
  
  const handleSort = (field) => {
    const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortDirection(newDirection);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page) => setCurrentPage(page);

  const processedData = useMemo(() => {
    let items = [...solicitacaoExames];
    items = items.filter(item => {
        const nomePaciente = `${item.paciente?.nome ?? ''} ${item.paciente?.sobrenome ?? ''}`.toLowerCase();
        const nomeExame = (item.tipoExame?.nomeTipoExame || '').toLowerCase();
        const dataItem = item.dataSolicitacao ? new Date(item.dataSolicitacao).toISOString().split('T')[0] : '';
        const pacienteMatch = filtros.paciente ? nomePaciente.includes(filtros.paciente.toLowerCase()) : true;
        const exameMatch = filtros.tipoExame ? nomeExame.includes(filtros.tipoExame.toLowerCase()) : true;
        const dataMatch = filtros.dataSolicitacao ? dataItem === filtros.dataSolicitacao : true;
        return pacienteMatch && exameMatch && dataMatch;
    });

    items.sort((a, b) => {
      let vA, vB;
      if (sortField === "paciente") vA = `${a.paciente?.nome ?? ''} ${a.paciente?.sobrenome ?? ''}`.trim();
      else if (sortField === "tipoExame") vA = a.tipoExame?.nomeTipoExame || '';
      else vA = a[sortField];
      
      if (sortField === "paciente") vB = `${b.paciente?.nome ?? ''} ${b.paciente?.sobrenome ?? ''}`.trim();
      else if (sortField === "tipoExame") vB = b.tipoExame?.nomeTipoExame || '';
      else vB = b[sortField];

      const dir = sortDirection === 'asc' ? 1 : -1;
      if (vA == null || vA === '') return 1 * dir;
      if (vB == null || vB === '') return -1 * dir;
      if (['dataSolicitacao', 'dataRetorno'].includes(sortField)) return (new Date(vA) - new Date(vB)) * dir;
      return String(vA).toLowerCase().localeCompare(String(vB).toLowerCase()) * dir;
    });

    return items;
  }, [solicitacaoExames, filtros, sortField, sortDirection]);

  const currentItems = processedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSave = (novaSolicitacao) => {
    setSolicitacaoExames(prev => [...prev, novaSolicitacao]);
    toast.success("Solicitação criada com sucesso!");
    setIsAddModalOpen(false);
  };

  const handleUpdate = (solicitacaoAtualizada) => {
    setSolicitacaoExames(prev => prev.map(item => item.idSolicitacaoExame === solicitacaoAtualizada.idSolicitacaoExame ? solicitacaoAtualizada : item));
    toast.success("Solicitação atualizada com sucesso!");
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsConfirmModalOpen(true);
  };
  
  const confirmDelete = async () => {
    try {
      await excluirSolicitacaoExames(idToDelete);
      setSolicitacaoExames(prev => prev.filter(item => item.idSolicitacaoExame !== idToDelete));
      toast.success("Solicitação excluída com sucesso!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Erro ao excluir.");
    } finally {
      setIsConfirmModalOpen(false);
      setIdToDelete(null);
    }
  };

  const openModal = (type, item) => {
    setSelectedSolicitacao(item);
    if (type === 'details') setIsDetailsModalOpen(true);
    if (type === 'edit') setIsEditModalOpen(true);
  };
  
  const closeModal = () => {
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      setIsDetailsModalOpen(false);
      setSelectedSolicitacao(null);
  }

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="border-b pb-4 flex justify-between items-center">
            <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3"><FaVial /> Solicitações de Exames</h2>
            <button onClick={() => setIsAddModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700">
                <FaPlus /> Nova Solicitação
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 rounded-lg border">
            <div><label htmlFor="paciente" className="block text-sm font-semibold text-gray-700 mb-1"><FaFilter className="inline-block mr-2 h-3 w-3" />Paciente</label><input type="text" name="paciente" value={filtros.paciente} onChange={handleFiltroChange} placeholder="Filtrar por paciente..." className="w-full px-3 py-2 text-sm border rounded-md" /></div>
            <div><label htmlFor="tipoExame" className="block text-sm font-semibold text-gray-700 mb-1"><FaFilter className="inline-block mr-2 h-3 w-3" />Tipo de Exame</label><input type="text" name="tipoExame" value={filtros.tipoExame} onChange={handleFiltroChange} placeholder="Filtrar por exame..." className="w-full px-3 py-2 text-sm border rounded-md" /></div>
            <div><label htmlFor="dataSolicitacao" className="block text-sm font-semibold text-gray-700 mb-1"><FaFilter className="inline-block mr-2 h-3 w-3" />Data da Solicitação</label><input type="date" name="dataSolicitacao" value={filtros.dataSolicitacao} onChange={handleFiltroChange} className="w-full px-3 py-2 text-sm border rounded-md" /></div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? <p className="p-4 text-center">Carregando...</p> : 
            <TabelaSolicitacaoExames
              tse={currentItems}
              onExcluir={handleDelete}
              onEditar={(item) => openModal('edit', item)}
              onDetalhes={(item) => openModal('details', item)}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          }
        </div>

        {processedData.length > itemsPerPage && <div className="mt-4 flex justify-center"><Pagination totalItems={processedData.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={handlePageChange} /></div>}

        {isAddModalOpen && <ModalSolicitacaoExames isOpen={isAddModalOpen} onClose={closeModal} onSave={handleSave} />}
        {selectedSolicitacao && isEditModalOpen && <ModalEditarSolicitacaoExames isOpen={isEditModalOpen} onClose={closeModal} solicitacaoExames={selectedSolicitacao} onUpdate={handleUpdate} />}
        {selectedSolicitacao && isDetailsModalOpen && <ModalDetalhesSolicitacaoExames isOpen={isDetailsModalOpen} onClose={closeModal} solicitacaoExames={selectedSolicitacao} />}
        {isConfirmModalOpen && <ConfirmationModal isOpen={isConfirmModalOpen} onConfirm={confirmDelete} onCancel={() => setIsConfirmModalOpen(false)} message="Deseja excluir esta solicitação de exame?" />}
      </div>
    </div>
  );
};

export default SolicitacaoExames;