import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "../util/confirmationModal";
import Pagination from "../util/Pagination";
import {
  getPlanoDeSaude,
  getPlanoDeSaudeId,
  excluirPlanoDeSaude,
} from "../../config/apiServices";
import ModalPlanoSaude from "./modalPlanoDeSaude";
import TabelaPlanoSaude from "./tabelaPlanoDeSaude";
import ModalEditarPlanoSaude from "./modalEditarPlanoDeSaude";
import ModalDetalhesPlanoDeSaude from "./modalDetalhesPlanoDeSaude";

const PlanoSaude = () => {
  const [planosSaude, setPlanosSaude] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [planoSaudeSelecionado, setPlanoSaudeSelecionado] = useState(null);
  const [isModalDetalhesOpen, setIsModalDetalhesOpen] = useState(false);
  const [planoParaDetalhes, setPlanoParaDetalhes] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const loadPlanosSaude = async () => {
    setIsLoading(true);
    try {
      const response = await getPlanoDeSaude();
      setPlanosSaude(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao carregar planos de saúde:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlanosSaude();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1);
  };

  const planosSaudeFiltrados = planosSaude.filter((ps) =>
    ps.nomeOperadora.toLowerCase().includes(filtro.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = planosSaudeFiltrados.slice(
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
      await excluirPlanoDeSaude(idToDelete);
      setShowAlert(true);
      await loadPlanosSaude();
    } catch (error) {
      console.error("Erro ao excluir plano de saúde:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadPlanosSaude();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idPlanoSaude) => {
    try {
      const response = await getPlanoDeSaudeId(idPlanoSaude);
      setPlanoSaudeSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar plano de saúde:", error);
    }
  };

  const handleDetalhes = (plano) => {
    setPlanoParaDetalhes(plano);
    setIsModalDetalhesOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setPlanoSaudeSelecionado(null);
  };

  const handleUpdatePlanoSaude = () => {
    loadPlanosSaude();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Planos de Saúde
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-5 w-5" />
            Adicionar Plano de Saúde
          </button>
        </div>

        {showAlert && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            Plano de saúde excluído com sucesso.
          </div>
        )}
        {showSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200">
            Plano de saúde adicionado com sucesso!
          </div>
        )}
        {showEditSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200">
            Plano de saúde editado com sucesso!
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por Nome da Operadora
            </label>
            <div className="relative">
              <input
                id="filtro"
                type="text"
                value={filtro}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Filtrar por operadora"
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

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Carregando registros...
            </p>
          ) : planosSaudeFiltrados.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Nenhum plano de saúde encontrado.
            </p>
          ) : (
            <TabelaPlanoSaude
              planos={currentItems}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
            />
          )}
        </div>

        {planosSaudeFiltrados.length > 0 && (
          <div className="mt-6">
            <Pagination
              totalItems={planosSaudeFiltrados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

        {isModalOpenAdd && (
          <ModalPlanoSaude
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && planoSaudeSelecionado && (
          <ModalEditarPlanoSaude
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            plano={planoSaudeSelecionado}
            onUpdate={handleUpdatePlanoSaude}
          />
        )}
        {isModalDetalhesOpen && planoParaDetalhes && (
          <ModalDetalhesPlanoDeSaude
            isOpen={isModalDetalhesOpen}
            onClose={() => {
              setIsModalDetalhesOpen(false);
              setPlanoParaDetalhes(null);
            }}
            planoDeSaude={planoParaDetalhes}
            onEditar={handleEditar}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
            message="Deseja excluir este plano de saúde?"
          />
        )}
      </section>
    </div>
  );
};

export default PlanoSaude;