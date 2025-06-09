import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "../util/confirmationModal";
import {
  getTipoConsulta,
  getTipoConsultaId,
  excluirTipoConsulta,
} from "../../config/apiServices";
import ModalTipoConsulta from "./modalTipoConsulta";
import TabelaTipoConsulta from "./tabelaTipoConsulta";
import ModalEditarTipoConsulta from "./modalEditarTipoConsulta";
import ModalDetalhesTipoConsulta from "./modalDetalhesConsulta";
import Pagination from "../util/Pagination";

const TipoConsulta = () => {
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [tipoConsultaSelecionado, setTipoConsultaSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  // Estados para ordenação
  const [sortField, setSortField] = useState("nomeTipoConsulta");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadTipoConsulta = async () => {
    setIsLoading(true);
    try {
      const response = await getTipoConsulta();
      setTipoConsulta(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar tipos de consulta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTipoConsulta();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1);
  };

  // Função para lidar com a ordenação
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Função de ordenação mais robusta (CORRIGIDA)
  const sortData = (data) => {
    return [...data].sort((a, b) => {
      // Garante que o campo de ordenação existe em ambos os objetos
      if (!a.hasOwnProperty(sortField) || !b.hasOwnProperty(sortField)) {
        return 0;
      }

      const valueA = a[sortField];
      const valueB = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;

      // Trata valores nulos ou vazios para que fiquem no final
      if (valueA === null || valueA === undefined || valueA === '') return 1 * direction;
      if (valueB === null || valueB === undefined || valueB === '') return -1 * direction;

      // Se ambos os valores forem numéricos, faz a ordenação numérica
      if (!isNaN(valueA) && !isNaN(valueB)) {
        return (Number(valueA) - Number(valueB)) * direction;
      }

      // Caso contrário, usa a ordenação de texto (padrão)
      return String(valueA).toLowerCase().localeCompare(String(valueB).toLowerCase()) * direction;
    });
  };

  // 1. Filtrar
  const tipoConsultaFiltrados = tipoConsulta.filter((tpc) =>
    (tpc.nomeTipoConsulta || '').toLowerCase().includes(filtro.toLowerCase())
  );

  // 2. Ordenar
  const tipoConsultaOrdenados = sortData(tipoConsultaFiltrados);

  // 3. Paginar
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tipoConsultaOrdenados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirTipoConsulta(idToDelete);
      setShowAlert(true);
      await loadTipoConsulta();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadTipoConsulta();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idTipoConsulta) => {
    try {
      const response = await getTipoConsultaId(idTipoConsulta);
      setTipoConsultaSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar tipo de consulta:", error);
    }
  };

  const handleDetalhes = async (idTipoConsulta) => {
    try {
      const response = await getTipoConsultaId(idTipoConsulta);
      setTipoConsultaSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao visualizar detalhes do tipo de consulta:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setTipoConsultaSelecionado(null);
  };

  const handleUpdateTipoConsulta = () => {
    loadTipoConsulta();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Tipos de Consultas
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-5 w-5" />
            Adicionar Tipo de Consulta
          </button>
        </div>

        {/* Alertas de Feedback */}
        {showAlert && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            Item excluído com sucesso.
          </div>
        )}
        {showSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border-green-300">
            Tipo de consulta adicionado com sucesso!
          </div>
        )}
        {showEditSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border-green-300">
            Tipo de consulta editado com sucesso!
          </div>
        )}

        {/* Filtro */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por Nome do Tipo de Consulta
            </label>
            <div className="relative">
              <input
                id="filtro"
                type="text"
                value={filtro}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Filtrar por nome do tipo de consulta"
              />
              {filtro && (
                <button
                  onClick={() => handleFiltroChange({ target: { value: "" } })}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
           {isLoading ? (
             <p className="text-center text-gray-500 py-4">Carregando...</p>
           ) : (
            <TabelaTipoConsulta
              tpc={currentItems}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )}
        </div>

        {/* Paginação */}
        {tipoConsultaOrdenados.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              totalItems={tipoConsultaOrdenados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

        {/* Modais */}
        {isModalOpenAdd && (
          <ModalTipoConsulta
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && tipoConsultaSelecionado && (
          <ModalEditarTipoConsulta
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            tipoConsulta={tipoConsultaSelecionado}
            onUpdate={handleUpdateTipoConsulta}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
            message="Deseja excluir este tipo de consulta?"
          />
        )}
        {isModalOpenDetalhes && tipoConsultaSelecionado && (
          <ModalDetalhesTipoConsulta
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            tipoConsulta={tipoConsultaSelecionado}
          />
        )}
      </section>
    </div>
  );
};

export default TipoConsulta;