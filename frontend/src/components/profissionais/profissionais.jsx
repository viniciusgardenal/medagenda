import React, { useState, useEffect } from "react";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getProfissionais,
  getProfissionaisId,
  excluirProfissional,
} from "../../config/apiServices";
import ModalProfissional from "./modalProfissional";
import TabelaProfissionais from "../profissionais/tabelaProfissionais";
import ModalEditarProfissional from "./modalEditarProfissional";
import ModalDetalhesProfissional from "./modalDetalhesProfissional";
import Pagination from "../util/Pagination";

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Número fixo de profissionais por página

  const loadProfissionais = async () => {
    try {
      const response = await getProfissionais();
      setProfissionais(response.data);
      setCurrentPage(1); // Reseta para a primeira página ao carregar novos dados
    } catch (error) {
      console.error("Erro ao carregar profissionais:", error);
    }
  };

  useEffect(() => {
    loadProfissionais();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1); // Reseta para a primeira página ao mudar o filtro
  };

  const profissionaisFiltrados = profissionais.filter((profissional) => {
    const pesquisa = filtro.toLowerCase();
    return (
      profissional.nome.toLowerCase().includes(pesquisa) ||
      profissional.email.toLowerCase().includes(pesquisa) ||
      profissional.telefone.includes(pesquisa) ||
      profissional.tipoProfissional.toLowerCase().includes(pesquisa) ||
      profissional.dataNascimento.toLowerCase().includes(pesquisa)
    );
  });

  // Calcular profissionais da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfissionais = profissionaisFiltrados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirProfissional(idToDelete);
      setShowAlert(true);
      await loadProfissionais();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadProfissionais();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (matricula) => {
    try {
      const response = await getProfissionaisId(matricula);
      const profissional = response.data;
      setProfissionalSelecionado({ ...profissional });
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar profissional:", error);
    }
  };

  const handleDetalhes = async (matricula) => {
    try {
      const response = await getProfissionaisId(matricula);
      const profissional = response.data;
      setProfissionalSelecionado({ ...profissional });
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao visualizar detalhes do profissional:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setProfissionalSelecionado(null);
  };

  const handleUpdateProfissionais = () => {
    loadProfissionais();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Título */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Pesquisar Profissionais
          </h2>
        </div>

        {/* Alertas */}
        {showAlert && (
          <AlertMessage
            message="Excluído com sucesso."
            onClose={() => setShowAlert(false)}
          />
        )}
        {showSuccessAlert && (
          <SuccessAlert
            message="Adicionado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Editado com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        {/* Bloco de filtro e botão */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por Nome, E-mail, Telefone ou Profissional
            </label>
            <div className="relative">
              <input
                id="filtro"
                type="text"
                value={filtro}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite para buscar..."
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
              Cadastrar Profissional
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <TabelaProfissionais
            profissionais={currentProfissionais}
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>

        {/* Paginação */}
        <Pagination
          totalItems={profissionaisFiltrados.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          maxPageButtons={5}
        />

        {/* Modais */}
        {isModalOpenAdd && (
          <ModalProfissional
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && profissionalSelecionado && (
          <ModalEditarProfissional
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            profissional={profissionalSelecionado}
            onUpdate={handleUpdateProfissionais}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
        {isModalOpenDetalhes && profissionalSelecionado && (
          <ModalDetalhesProfissional
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            profissional={profissionalSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default Profissionais;
