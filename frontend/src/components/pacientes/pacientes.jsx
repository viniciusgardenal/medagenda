import React, { useState, useEffect } from "react";
import FiltroPacientes from "./filtroPacientes";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getPacientes,
  getPacientesId,
  excluirPacientes,
} from "../../config/apiServices";
import ModalPacientes from "./modalPacientes";
import TabelaPacientes from "./tabelaPacientes";
import ModalEditarPacientes from "./modalEditarPacientes";
import ModalDetalhesPacientes from "./modalDetalhesPacientes";
import Pagination from "../util/Pagination";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [pacientesSelecionado, setPacientesSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Número fixo de pacientes por página

  const loadPacientes = async () => {
    try {
      const response = await getPacientes();
      setPacientes(response.data);
      setCurrentPage(1); // Reseta para a primeira página ao carregar novos dados
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1); // Reseta para a primeira página ao mudar o filtro
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const pesquisa = filtro.toLowerCase();
    return (
      paciente.cpf.toString().includes(pesquisa) ||
      paciente.nome?.toLowerCase().includes(pesquisa) ||
      paciente.sobrenome?.toLowerCase().includes(pesquisa) ||
      paciente.dataNascimento?.includes(pesquisa)
    );
  });

  // Calcular pacientes da página atual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPacientes = pacientesFiltrados.slice(
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
      await excluirPacientes(idToDelete);
      setShowAlert(true);
      await loadPacientes();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadPacientes();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idPaciente) => {
    try {
      const response = await getPacientesId(idPaciente);
      setPacientesSelecionado(response);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar paciente:", error);
    }
  };

  const handleDetalhes = async (cpfPaciente) => {
    try {
      const response = await getPacientesId(cpfPaciente);
      setPacientesSelecionado(response);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao visualizar detalhes do paciente:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setPacientesSelecionado(null);
  };

  const handleUpdatePacientes = () => {
    loadPacientes();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Título */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Pesquisar Pacientes
          </h2>
        </div>

        {/* Alertas */}
        {showAlert && (
          <AlertMessage
            message="Item excluído com sucesso."
            onClose={() => setShowAlert(false)}
          />
        )}
        {showSuccessAlert && (
          <SuccessAlert
            message="Paciente adicionado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Paciente editado com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        {/* Bloco de filtro e botão */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <FiltroPacientes
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
              Adicionar Paciente
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <TabelaPacientes
            pacientes={currentPacientes}
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>

        {/* Paginação */}
        <Pagination
          totalItems={pacientesFiltrados.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          maxPageButtons={5}
        />

        {/* Modais */}
        {isModalOpenAdd && (
          <ModalPacientes
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && pacientesSelecionado && (
          <ModalEditarPacientes
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            pacientes={pacientesSelecionado}
            onUpdate={handleUpdatePacientes}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
        {isModalOpenDetalhes && pacientesSelecionado && (
          <ModalDetalhesPacientes
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            pacientes={pacientesSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default Pacientes;
