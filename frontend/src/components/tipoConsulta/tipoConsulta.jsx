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

  const loadTipoConsulta = async () => {
    try {
      const response = await getTipoConsulta();
      setTipoConsulta(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao carregar tipos de consulta:", error);
    }
  };

  useEffect(() => {
    loadTipoConsulta();
  }, []);

  const [sortField, setSortField] = useState("nomeTipoConsulta");
  const [sortDirection, setSortDirection] = useState("asc");

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortTiposConsulta = (lista) => {
    return [...lista].sort((a, b) => {
      const valueA = (a[sortField] || "").toString().toLowerCase();
      const valueB = (b[sortField] || "").toString().toLowerCase();
      const direction = sortDirection === "asc" ? 1 : -1;
      return valueA.localeCompare(valueB) * direction;
    });
  };

  const tipoConsultaFiltrados = tipoConsulta.filter((tpc) =>
    tpc.nomeTipoConsulta.toLowerCase().includes(filtro.toLowerCase())
  );

  const tipoConsultaOrdenados = sortTiposConsulta(tipoConsultaFiltrados);

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
    <div className="min-h-screen bg-slate-50 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tipos de Consulta</h2>
            <p className="text-sm text-slate-500 mt-0.5">Categorias de consultas disponíveis</p>
          </div>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
          >
            <FaPlus className="h-4 w-4" />
            Adicionar Tipo de Consulta
          </button>
        </div>

        {showAlert && (
          <div className="mt-6 p-4 text-sm text-amber-800 bg-amber-50 rounded-md border border-amber-200">
            Item excluído com sucesso.
          </div>
        )}
        {showSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-emerald-800 bg-emerald-50 rounded-md border border-emerald-200">
            Tipo de consulta adicionado com sucesso!
          </div>
        )}
        {showEditSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-emerald-800 bg-emerald-50 rounded-md border border-emerald-200">
            Tipo de consulta editado com sucesso!
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Busca por Nome do Tipo de Consulta
            </label>
            <div className="relative">
              <input
                id="filtro"
                type="text"
                value={filtro}
                onChange={handleFiltroChange}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
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

        <div className="mt-6 overflow-x-auto rounded-md border border-slate-200">
          {tipoConsultaFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Nenhum tipo de consulta encontrado.
            </p>
          ) : (
            <TabelaTipoConsulta
              tpc={currentItems}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>

        {tipoConsultaFiltrados.length > 0 && (
          <div className="mt-6">
            <Pagination
              totalItems={tipoConsultaFiltrados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

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