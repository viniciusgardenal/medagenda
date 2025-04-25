import React, { useState, useEffect } from "react";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import Pagination from "../util/Pagination";
import {
  getPlanoDeSaude,
  getPlanoDeSaudeId,
  excluirPlanoDeSaude,
} from "../../config/apiServices";
import ModalPlanoSaude from "./modalPlanoDeSaude";
import TabelaPlanoSaude from "./tabelaPlanoDeSaude";
import ModalEditarPlanoSaude from "./modalEditarPlanoDeSaude";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  const loadPlanosSaude = async () => {
    try {
      const response = await getPlanoDeSaude();
      setPlanosSaude(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao carregar planos de saúde:", error);
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
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Gerenciar Planos de Saúde
          </h2>
        </div>

        {showAlert && (
          <AlertMessage
            message="Plano de saúde excluído com sucesso."
            onClose={() => setShowAlert(false)}
          />
        )}
        {showSuccessAlert && (
          <SuccessAlert
            message="Plano de saúde adicionado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Plano de saúde editado com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={filtro}
            onChange={handleFiltroChange}
            placeholder="Filtrar por operadora"
            className="w-full md:w-1/2 px-4 py-2 border rounded-md"
          />
          <div className="flex-shrink-0">
            <button
              onClick={() => setIsModalOpenAdd(true)}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
              Adicionar Plano de Saúde
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <TabelaPlanoSaude
            planos={currentItems}
            onExcluir={handleDelete}
            onEditar={handleEditar}
          />
        </div>

        <Pagination
          totalItems={planosSaudeFiltrados.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          maxPageButtons={5}
        />

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
            planoSaude={planoSaudeSelecionado}
            onUpdate={handleUpdatePlanoSaude}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default PlanoSaude;
