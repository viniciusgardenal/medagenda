import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import ConfirmationModal from "../util/confirmationModal";
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
  const [itemsPerPage] = useState(8);

  const loadPacientes = async () => {
    try {
      const response = await getPacientes();
      setPacientes(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Erro ao carregar pacientes:", error);
    }
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1);
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
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Pacientes
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="h-5 w-5" />
            Adicionar Paciente
          </button>
        </div>

        {showAlert && (
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            Item excluído com sucesso.
          </div>
        )}
        {showSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-red-300">
            Paciente adicionado com sucesso!
          </div>
        )}
        {showEditSuccessAlert && (
          <div className="mt-6 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-red-300">
            Paciente editado com sucesso!
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por CPF, Nome, Sobrenome ou Data de Nascimento
            </label>
            <div className="relative">
              <input
                id="filtro"
                type="text"
                value={filtro}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Filtrar por CPF, nome, sobrenome ou data de nascimento"
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
          <TabelaPacientes
            pacientes={currentPacientes}
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>

        {pacientesFiltrados.length > 0 && (
          <div className="mt-6">
            <Pagination
              totalItems={pacientesFiltrados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

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
            message="Deseja excluir este paciente?"
          />
        )}
        {isModalOpenDetalhes && pacientesSelecionado && (
          <ModalDetalhesPacientes
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            pacientes={pacientesSelecionado}
          />
        )}
      </section>
    </div>
  );
};

export default Pacientes;