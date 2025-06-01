import React, { useState, useEffect } from "react";
import FiltroMedicamentos from "./filtroMedicamentos";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getMedicamentos,
  getMedicamentosId,
  excluirMedicamentos,
  generateMedicamentosReport,
} from "../../config/apiServices";
import ModalMedicamentos from "./modalMedicamentos";
import TabelaMedicamentos from "./tabelaMedicamentos";
import ModalEditarMedicamentos from "./modalEditarMedicamentos";
import ModalDetalhesMedicamentos from "./modalDetalhesMedicamentos";
import Pagination from "../util/Pagination";
import { FaPlus } from "react-icons/fa";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("nomeMedicamento");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const loadMedicamentos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMedicamentos();
      const validMedicamentos = response.data.filter(
        (m) =>
          m.idMedicamento &&
          m.nomeMedicamento &&
          m.nomeFabricante &&
          m.controlado
      );
      setMedicamentos(validMedicamentos);
    } catch (error) {
      console.error("Erro ao carregar medicamentos:", error);
      setError("Não foi possível carregar os medicamentos. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedicamentos();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
    setCurrentPage(1);
  };

  const sortMedicamentos = (medicamentos) => {
    return [...medicamentos].sort((a, b) => {
      const fieldMap = {
        nomeMedicamento: (item) => (item.nomeMedicamento || "").toLowerCase(),
        nomeFabricante: (item) => (item.nomeFabricante || "").toLowerCase(),
        controlado: (item) => (item.controlado || "").toLowerCase(),
      };
      const valueA = fieldMap[sortField](a);
      const valueB = fieldMap[sortField](b);
      const direction = sortDirection === "asc" ? 1 : -1;
      return valueA.localeCompare(valueB) * direction;
    });
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

  const medicamentosFiltrados = medicamentos.filter((medicamento) => {
    const pesquisa = filtro.toLowerCase();
    return (
      (medicamento.nomeMedicamento || "").toLowerCase().includes(pesquisa) ||
      (medicamento.nomeFabricante || "").toLowerCase().includes(pesquisa) ||
      (medicamento.descricao || "").toLowerCase().includes(pesquisa)
    );
  });

  const medicamentosOrdenados = sortMedicamentos(medicamentosFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicamentos = medicamentosOrdenados.slice(
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
    setIsSaving(true);
    try {
      await excluirMedicamentos(idToDelete);
      setShowAlert(true);
      await loadMedicamentos();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      setError("Erro ao excluir medicamento. Tente novamente.");
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await loadMedicamentos();
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setError("Erro ao salvar medicamento. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditar = async (idMedicamento) => {
    try {
      const response = await getMedicamentosId(idMedicamento);
      setMedicamentosSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar medicamento:", error);
      setError("Erro ao editar medicamento. Tente novamente.");
    }
  };

  const handleDetalhes = async (idMedicamento) => {
    try {
      const response = await getMedicamentosId(idMedicamento);
      setMedicamentosSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao visualizar detalhes do medicamento:", error);
      setError("Erro ao visualizar detalhes do medicamento. Tente novamente.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setMedicamentosSelecionado(null);
  };

  const handleUpdateMedicamentos = () => {
    setIsSaving(true);
    try {
      loadMedicamentos();
      setShowEditSuccessAlert(true);
      handleCloseModal();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setError("Erro ao atualizar medicamento. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportExcel = async () => {
    setIsSaving(true);
    try {
      const response = await generateMedicamentosReport({ filtro });
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Relatorio_Medicamentos_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
      setError("Erro ao gerar o relatório Excel: " + (error.error || "Tente novamente."));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Título e Botão Adicionar */}
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Gerenciar Medicamentos
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaPlus className="h-5 w-5" />
            Novo Medicamento
          </button>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium">
            {error}
          </div>
        )}

        {/* Alertas */}
        {showAlert && (
          <AlertMessage
            message="Medicamento excluído com sucesso."
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

        {/* Filtro e Botão Exportar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Pesquisar Medicamento
            </label>
            <FiltroMedicamentos
              filtro={filtro}
              onFiltroChange={handleFiltroChange}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1 invisible">
              Placeholder
            </label>
            <button
              onClick={handleExportExcel}
              disabled={isSaving}
              className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-600 py-4 text-base font-medium">
              Carregando registros...
            </p>
          ) : medicamentosOrdenados.length === 0 ? (
            <p className="text-center text-gray-600 py-4 text-base font-medium">
              Nenhum medicamento encontrado.
            </p>
          ) : (
            <TabelaMedicamentos
              medicamentos={currentMedicamentos}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>

        {/* Paginação */}
        {medicamentosOrdenados.length > 0 && (
          <div className="mt-6">
            <Pagination
              totalItems={medicamentosOrdenados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

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
            message="Deseja excluir este medicamento?"
            isSaving={isSaving}
          />
        )}
        {isModalOpenDetalhes && medicamentosSelecionado && (
          <ModalDetalhesMedicamentos
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            medicamentos={medicamentosSelecionado}
          />
        )}
      </section>
    </div>
  );
};

export default Medicamentos;
