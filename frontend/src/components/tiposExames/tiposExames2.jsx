import React, { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from '../util/confirmationModal';
import {
  getTiposExames,
  getTiposExamesId,
  excluirTipoExame,
} from '../../config/apiServices';
import ModalExame from './modalTipoExame';
import TabelaTiposExames from './tabelaTipoExame';
import ModalEditarTipoExame from './modalEditarTipoExame';
import ModalDetalhesTipoExame from './modalDetalhesTipoExame';
import Pagination from '../util/Pagination'; // Certifique-se que o caminho está correto

const TiposExames = () => {
  const [tiposExames, setTiposExames] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para Paginação e Ordenação
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("nomeTipoExame");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadTiposExames = async () => {
    setIsLoading(true);
    try {
      const response = await getTiposExames();
      setTiposExames(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar tipos de exames:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTiposExames();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1); // Reseta para a primeira página ao filtrar
  };

  // Lógica de Ordenação
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      const valueA = a[sortField] || '';
      const valueB = b[sortField] || '';
      const direction = sortDirection === "asc" ? 1 : -1;
      return String(valueA).toLowerCase().localeCompare(String(valueB).toLowerCase()) * direction;
    });
  };

  // Manipulador para alterar a ordenação
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirTipoExame(idToDelete);
      setShowAlert(true);
      await loadTiposExames();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };
  
  const handleSave = async () => {
    await loadTiposExames();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idTipoExame) => {
    try {
      const response = await getTiposExamesId(idTipoExame);
      setTipoExameSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error('Erro ao editar tipo de exame:', error);
    }
  };
  
  const handleDetalhes = async (idTipoExame) => {
    try {
      const response = await getTiposExamesId(idTipoExame);
      setTipoExameSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error('Erro ao visualizar detalhes do tipo de exame:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setTipoExameSelecionado(null);
  };

  const handleUpdateTiposExames = () => {
    loadTiposExames();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 1. Filtrar
  const tiposExamesFiltrados = tiposExames.filter((tipoExame) => {
    const pesquisa = filtro.toLowerCase();
    return (
      (tipoExame.nomeTipoExame || '').toLowerCase().includes(pesquisa) ||
      (tipoExame.materialColetado || '').toLowerCase().includes(pesquisa) ||
      (tipoExame.categoria || '').toLowerCase().includes(pesquisa)
    );
  });
  
  // 2. Ordenar
  const tiposExamesOrdenados = sortData(tiposExamesFiltrados);

  // 3. Paginar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTiposExames = tiposExamesOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Tipos de Exames
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-5 w-5" />
            Adicionar Tipo de Exame
          </button>
        </div>

        {/* Alertas */}
        {showAlert && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            Item excluído com sucesso.
          </div>
        )}
        {showSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
            Tipo de exame adicionado com sucesso!
          </div>
        )}
        {showEditSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-300">
            Tipo de exame editado com sucesso!
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por Nome, Material Coletado ou Categoria
            </label>
            <input
              id="filtro"
              type="text"
              value={filtro}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por nome, material coletado ou categoria"
            />
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Carregando tipos de exames...
            </p>
          ) : (
            <TabelaTiposExames
              tiposExames={currentTiposExames}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              isFiltered={filtro.length > 0}
            />
          )}
        </div>

        {tiposExamesOrdenados.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              totalItems={tiposExamesOrdenados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

        {/* Modais */}
        {isModalOpenAdd && (
          <ModalExame
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && tipoExameSelecionado && (
          <ModalEditarTipoExame
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            tipoExame={tipoExameSelecionado}
            onUpdate={handleUpdateTiposExames}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
            message="Deseja excluir este tipo de exame?"
          />
        )}
        {isModalOpenDetalhes && tipoExameSelecionado && (
          <ModalDetalhesTipoExame
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            tipoExame={tipoExameSelecionado}
          />
        )}
      </section>
    </div>
  );
};

export default TiposExames;