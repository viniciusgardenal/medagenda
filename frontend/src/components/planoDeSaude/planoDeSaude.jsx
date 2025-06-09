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
  const [filtros, setFiltros] = useState({
    nomeOperadora: "",
    tipoPlano: "",
  });

  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [isModalOpenDetalhes, setIsModalDetalhesOpen] = useState(false);
  const [planoSaudeSelecionado, setPlanoSaudeSelecionado] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState("nomeOperadora");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadPlanosSaude = async () => {
    setIsLoading(true);
    try {
      const response = await getPlanoDeSaude();
      console.log("Planos recebidos:", response.data); // Log para diagnóstico
      setPlanosSaude(response.data || []);
    } catch (error) {
      console.error("Erro ao carregar planos de saúde:", error);
      alert("Erro ao carregar planos de saúde. Verifique o console para detalhes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlanosSaude();
  }, []);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortData = (data) => {
    return [...data].sort((a, b) => {
      if (!a || !b || !a.hasOwnProperty(sortField) || !b.hasOwnProperty(sortField)) {
        console.warn(`Campo ${sortField} ausente em alguns planos`, a, b); // Log para diagnóstico
        return 0;
      }
      const valueA = a[sortField];
      const valueB = b[sortField];
      const direction = sortDirection === "asc" ? 1 : -1;

      if (valueA == null || valueA === "") return 1 * direction;
      if (valueB == null || valueB === "") return -1 * direction;

      if (["dataInicio", "dataFim"].includes(sortField)) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return (dateA.getTime() - dateB.getTime()) * direction;
      }

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return (Number(valueA) - Number(valueB)) * direction;
      }

      return String(valueA)
        .toLowerCase()
        .localeCompare(String(valueB).toLowerCase()) * direction;
    });
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prevFiltros) => ({
      ...prevFiltros,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  const planosSaudeFiltrados = planosSaude.filter((plano) => {
    const nomeOperadoraMatch = (plano.nomeOperadora || "")
      .toLowerCase()
      .includes(filtros.nomeOperadora.toLowerCase());
    const tipoPlanoMatch = (plano.tipoPlano || "")
      .toLowerCase()
      .includes(filtros.tipoPlano.toLowerCase());
    return nomeOperadoraMatch && tipoPlanoMatch;
  });

  const planosSaudeOrdenados = sortData(planosSaudeFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = planosSaudeOrdenados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleDelete = (id) => {
    console.log("Excluir plano com ID:", id); // Log para diagnóstico
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirPlanoDeSaude(idToDelete);
      setPlanosSaude((planosAnteriores) =>
        planosAnteriores.filter((p) => p.idPlanoSaude !== idToDelete)
      );
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      await loadPlanosSaude(); // Recarrega a lista após exclusão
    } catch (error) {
      console.error("Erro ao excluir plano de saúde:", error);
      alert("Erro ao excluir plano de saúde. Verifique o console.");
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async (novoPlano) => {
    setPlanosSaude((planosAnteriores) => [...planosAnteriores, novoPlano]);
    setFiltros({ nomeOperadora: "", tipoPlano: "" }); // Resetar filtros
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
    await loadPlanosSaude(); // Recarrega a lista após salvar
  };

  const openModalWithData = async (id, modalType) => {
    console.log(`Abrindo modal ${modalType} para ID: ${id}`); // Log para diagnóstico
    try {
      const response = await getPlanoDeSaudeId(id);
      console.log("Dados do plano:", response.data); // Log para diagnóstico
      setPlanoSaudeSelecionado(response.data);
      if (modalType === "editar") {
        setIsModalOpenEditar(true);
      } else if (modalType === "detalhes") {
        setIsModalDetalhesOpen(true);
      }
    } catch (error) {
      console.error(`Erro ao carregar dados do plano para ${modalType}:`, error);
      alert(`Erro ao abrir ${modalType}: ${error.message}`);
    }
  };

  const handleEditar = (id) => openModalWithData(id, "editar");
  const handleDetalhes = (id) => openModalWithData(id, "detalhes");

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setIsModalDetalhesOpen(false);
    setPlanoSaudeSelecionado(null);
  };

  const handleUpdatePlanoSaude = async (planoAtualizado) => {
    if (!planoAtualizado || !planoAtualizado.idPlanoSaude) {
      console.error(
        "Falha ao receber os dados atualizados. Recarregando a lista completa como fallback."
      );
      await loadPlanosSaude();
      handleCloseModal();
      return;
    }

    setPlanosSaude((planosAnteriores) =>
      planosAnteriores.map((plano) =>
        plano.idPlanoSaude === planoAtualizado.idPlanoSaude
          ? planoAtualizado
          : plano
      )
    );
    setShowEditSuccessAlert(true);
    setTimeout(() => setShowEditSuccessAlert(false), 3000);
    handleCloseModal();
    await loadPlanosSaude(); // Recarrega a lista após atualização
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600">
            Gerenciar Planos de Saúde
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
          >
            <FaPlus /> Adicionar Plano
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div>
            <label
              htmlFor="nomeOperadora"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Busca por Nome da Operadora
            </label>
            <input
              id="nomeOperadora"
              name="nomeOperadora"
              type="text"
              value={filtros.nomeOperadora}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filtrar por operadora..."
            />
          </div>
          <div>
            <label
              htmlFor="tipoPlano"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Busca por Tipo do Plano
            </label>
            <select
              id="tipoPlano"
              name="tipoPlano"
              value={filtros.tipoPlano}
              onChange={handleFiltroChange}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            >
              <option value="">Todos os Tipos</option>
              <option value="Individual">Individual</option>
              <option value="Familiar">Familiar</option>
              <option value="Empresarial">Empresarial</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4">Carregando...</p>
          ) : (
            <TabelaPlanoSaude
              planos={currentItems}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
            />
          )}
        </div>

        {planosSaudeOrdenados.length > itemsPerPage && (
          <div className="mt-6">
            <Pagination
              totalItems={planosSaudeOrdenados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
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

        {planoSaudeSelecionado && (
          <>
            <ModalEditarPlanoSaude
              isOpen={isModalOpenEditar}
              onClose={handleCloseModal}
              plano={planoSaudeSelecionado}
              onUpdate={handleUpdatePlanoSaude}
            />
            <ModalDetalhesPlanoDeSaude
              isOpen={isModalOpenDetalhes}
              onClose={handleCloseModal}
              planoDeSaude={planoSaudeSelecionado}
            />
          </>
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