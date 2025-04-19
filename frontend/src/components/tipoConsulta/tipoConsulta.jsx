import React, { useState, useEffect } from "react";
import FiltroTipoConsulta from "./filtroTipoConsulta";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getTipoConsulta,
  getTipoConsultaId,
  excluirTipoConsulta,
} from "../../config/apiServices";
import ModalTipoConsulta from "./modalTipoConsulta";
import TabelaTipoConsulta from "./tabelaTipoConsulta";
import ModalEditarTipoConsulta from "./modalEditarTipoConsulta";
import ModalDetalhesTipoConsulta from "./modalDetalhesConsulta";
import Pagination from "../util/Pagination"; // Importando o componente de paginação

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
  const [itemsPerPage] = useState(8); // 10 itens por página

  const loadTipoConsulta = async () => {
    try {
      const response = await getTipoConsulta();
      setTipoConsulta(response.data);
      setCurrentPage(1); // Resetar para a primeira página ao carregar novos dados
    } catch (error) {
      console.error("Erro ao carregar tipos de consulta:", error);
    }
  };

  useEffect(() => {
    loadTipoConsulta();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1); // Resetar para a primeira página ao mudar o filtro
  };

  const tipoConsultaFiltrados = tipoConsulta.filter((tpc) =>
    tpc.nomeTipoConsulta.toLowerCase().includes(filtro.toLowerCase())
  );

  // Calcular índices dos itens da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tipoConsultaFiltrados.slice(
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
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Pesquisar Tipos de Consultas
          </h2>
        </div>

        {showAlert && (
          <AlertMessage
            message="Item excluído com sucesso."
            onClose={() => setShowAlert(false)}
          />
        )}
        {showSuccessAlert && (
          <SuccessAlert
            message="Tipo de consulta adicionado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Tipo de consulta editado com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <FiltroTipoConsulta
            filtro={filtro}
            onFiltroChange={handleFiltroChange}
          />
          <div className="flex-shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-1 invisible">
              Placeholder
            </label>
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
              Adicionar Tipo de Consulta
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <TabelaTipoConsulta
            tpc={currentItems} // Passar apenas os itens da página atual
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>

        {/* Componente de Paginação */}
        <Pagination
          totalItems={tipoConsultaFiltrados.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          maxPageButtons={5} // Mostrar até 5 botões de página
        />

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
          />
        )}
        {isModalOpenDetalhes && tipoConsultaSelecionado && (
          <ModalDetalhesTipoConsulta
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            tipoConsulta={tipoConsultaSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default TipoConsulta;
