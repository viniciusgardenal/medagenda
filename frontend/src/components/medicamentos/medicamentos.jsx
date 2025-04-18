import React, { useState, useEffect } from "react";
import FiltroMedicamentos from "./filtroMedicamentos";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getMedicamentos,
  getMedicamentosId,
  excluirMedicamentos,
} from "../../config/apiServices";
import ModalMedicamentos from "./modalMedicamentos";
import TabelaMedicamentos from "./tabelaMedicamentos";
import ModalEditarMedicamentos from "./modalEditarMedicamentos";
import ModalDetalhesMedicamentos from "./modalDetalhesMedicamentos";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [medicamentosSelecionado, setMedicamentosSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);

  const loadMedicamentos = async () => {
    const response = await getMedicamentos();
    setMedicamentos(response.data);
  };

  useEffect(() => {
    loadMedicamentos();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const medicamentosFiltrados = medicamentos.filter((medicamento) => {
    const pesquisa = filtro.toLowerCase();
    return (
      medicamento.nomeMedicamento.toLowerCase().includes(pesquisa) ||
      medicamento.nomeFabricante?.toLowerCase().includes(pesquisa) ||
      medicamento.descricao?.toLowerCase().includes(pesquisa)
    );
  });

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirMedicamentos(idToDelete);
      setShowAlert(true);
      await loadMedicamentos();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadMedicamentos();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idMedicamento) => {
    try {
      const response = await getMedicamentosId(idMedicamento);
      setMedicamentosSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar medicamento:", error);
    }
  };

  const handleDetalhes = async (idMedicamento) => {
    try {
      const response = await getMedicamentosId(idMedicamento);
      setMedicamentosSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao visualizar detalhes do medicamento:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setMedicamentosSelecionado(null);
  };

  const handleUpdateMedicamentos = () => {
    loadMedicamentos();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Título */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">
            Pesquisar Medicamentos
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
            message="Medicamento adicionado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Medicamento editado com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        {/* Bloco de filtro e botão */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <FiltroMedicamentos
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
              Adicionar Medicamento
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <TabelaMedicamentos
            medicamentos={medicamentosFiltrados}
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>

        {/* Modais */}
        {isModalOpenAdd && (
          <ModalMedicamentos
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && medicamentosSelecionado && (
          <ModalEditarMedicamentos
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            medicamentos={medicamentosSelecionado}
            onUpdate={handleUpdateMedicamentos}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
        {isModalOpenDetalhes && medicamentosSelecionado && (
          <ModalDetalhesMedicamentos
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            medicamentos={medicamentosSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default Medicamentos;
