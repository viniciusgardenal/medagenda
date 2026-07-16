import React, { useState, useEffect } from "react";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getSolicitacaoExames,
  getSolicitacaoExamesId,
  excluirSolicitacaoExames,
} from "../../config/apiServices";
import ModalSolicitacaoExames from "./modalSolicitacaoExames";
import TabelaSolicitacaoExames from "./tabelaSolicitacaoExames";
import ModalEditarSolicitacaoExames from "./modalEditarSolicitacaoExames";
import ModalDetalhesSolicitacaoExames from "./modalDetalhesSolicitacaoExames";

import Pagination from "../util/Pagination";

// Função para normalizar strings (remover acentos e espaços extras)
const normalizarString = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, " ") // Normaliza espaços
    .trim();
};

const SolicitacaoExames = () => {
  const [solicitacaoExames, setSolicitacaoExames] = useState([]);
  const [filtros, setFiltros] = useState({
    paciente: "",
    tipoExame: "",
    periodo: "",
    dataRetorno: "",
  });
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [solicitacaoExamesSelecionado, setSolicitacaoExamesSelecionado] =
    useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("exame");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadSolicitacaoExames = async () => {
    try {
      const response = await getSolicitacaoExames();
      if (Array.isArray(response.data)) {
        setSolicitacaoExames(response.data);
        console.log("Dados de solicitações carregados:", response.data);
        response.data.forEach((tse, index) => {
          console.log(`Solicitação ${index}:`, {
            id: tse.idSolicitacaoExame,
            paciente: tse.paciente,
            tipoExame: tse.tipoExame,
            nomeTipoExame: tse.nomeTipoExame,
            periodo: tse.periodo,
            dataRetorno: tse.dataRetorno,
            profissional: tse.profissional,
          });
        });
      } else {
        console.warn("Dados retornados não são um array:", response.data);
        setError("Formato de dados inválido retornado pela API.");
      }
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
      setError(
        error.error ||
          "Não foi possível carregar as solicitações. Verifique a conexão com a API."
      );
    }
  };

  useEffect(() => {
    loadSolicitacaoExames();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleClearFiltro = (field) => {
    setFiltros((prev) => ({ ...prev, [field]: "" }));
    setCurrentPage(1);
  };

  const solicitacaoExamesFiltrados = solicitacaoExames.filter((tse) => {
    const pacienteNome = normalizarString(tse.paciente?.nome || "");
    const tipoExame = normalizarString(
      tse.tipoExame?.nomeTipoExame || tse.nomeTipoExame || ""
    );
    const periodo = normalizarString(tse.periodo || "");
    const dataRetorno = normalizarString(tse.dataRetorno || "");

    const filtroPaciente = normalizarString(filtros.paciente);
    const filtroTipoExame = normalizarString(filtros.tipoExame);
    const filtroPeriodo = normalizarString(filtros.periodo);
    const filtroDataRetorno = normalizarString(filtros.dataRetorno);

    console.log("Filtrando solicitação:", {
      id: tse.idSolicitacaoExame,
      pacienteNome,
      tipoExame,
      periodo,
      dataRetorno,
      filtros: { filtroPaciente, filtroTipoExame, filtroPeriodo, filtroDataRetorno },
    });

    return (
      (filtroPaciente === "" || pacienteNome.includes(filtroPaciente)) &&
      (filtroTipoExame === "" || tipoExame.includes(filtroTipoExame)) &&
      (filtroPeriodo === "" || periodo.includes(filtroPeriodo)) &&
      (filtroDataRetorno === "" || dataRetorno.includes(filtroDataRetorno))
    );
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const sortSolicitacoes = (lista) => {
    return [...lista].sort((a, b) => {
      const fieldMap = {
        exame: (item) => (item.tipoExame?.nomeTipoExame || item.nomeTipoExame || "").toLowerCase(),
        paciente: (item) => `${item.paciente?.nome || ""} ${item.paciente?.sobrenome || ""}`.trim().toLowerCase(),
        periodo: (item) => (item.periodo || "").toLowerCase(),
        dataSolicitacao: (item) => (item.dataSolicitacao || "").toLowerCase(),
        dataRetorno: (item) => (item.dataRetorno || "").toLowerCase(),
        status: (item) => (item.status || "").toLowerCase(),
      };
      const valueA = fieldMap[sortField] ? fieldMap[sortField](a) : "";
      const valueB = fieldMap[sortField] ? fieldMap[sortField](b) : "";
      const direction = sortDirection === "asc" ? 1 : -1;
      return valueA.localeCompare(valueB) * direction;
    });
  };

  const solicitacaoExamesOrdenados = sortSolicitacoes(solicitacaoExamesFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitacoes = solicitacaoExamesOrdenados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = (id) => {
    console.log("Iniciando exclusão do ID:", id);
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) {
      console.error("Nenhum ID para exclusão definido");
      setError("Erro: Nenhum registro selecionado para exclusão.");
      setIsModalOpen(false);
      return;
    }

    try {
      console.log("Enviando solicitação de exclusão para ID:", idToDelete);
      await excluirSolicitacaoExames(idToDelete);
      setShowAlert(true);
      await loadSolicitacaoExames();
    } catch (error) {
      console.error("Erro ao excluir solicitação ID:", idToDelete, error);
      setError(
        error.error === "Solicitação não encontrada"
          ? "Registro não encontrado. Pode já ter sido excluído."
          : `Erro ao excluir solicitação: ${
              error.error || error.message || "Tente novamente."
            }`
      );
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadSolicitacaoExames();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (id) => {
    try {
      const response = await getSolicitacaoExamesId(id);
      console.log("Dados para edição:", response.data);
      setSolicitacaoExamesSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao carregar solicitação para edição:", error);
      setError(error.error || "Erro ao carregar dados para edição.");
    }
  };

  const handleDetalhes = async (id) => {
    try {
      const response = await getSolicitacaoExamesId(id);
      console.log("Dados para detalhes:", response.data);
      setSolicitacaoExamesSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes da solicitação:", error);
      setError(error.error || "Erro ao carregar detalhes da solicitação.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setIsModalOpenDetalhes(false);
    setSolicitacaoExamesSelecionado(null);
  };

  const handleUpdateSolicitacaoExames = () => {
    loadSolicitacaoExames();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Solicitação de Exames</h2>
            <p className="text-sm text-slate-500 mt-0.5">Requisições e pedidos de exames clínicos</p>
          </div>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            Nova Solicitação
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}

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

        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nome do Paciente
            </label>
            <div className="relative">
              <input
                type="text"
                name="paciente"
                value={filtros.paciente}
                onChange={handleFiltroChange}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                placeholder="Filtrar por paciente"
              />
              {filtros.paciente && (
                <button
                  onClick={() => handleClearFiltro("paciente")}
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
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tipo de Exame
            </label>
            <div className="relative">
              <input
                type="text"
                name="tipoExame"
                value={filtros.tipoExame}
                onChange={handleFiltroChange}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                placeholder="Filtrar por tipo de exame"
              />
              {filtros.tipoExame && (
                <button
                  onClick={() => handleClearFiltro("tipoExame")}
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
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Período
            </label>
            <div className="relative">
              <input
                type="text"
                name="periodo"
                value={filtros.periodo}
                onChange={handleFiltroChange}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                placeholder="Filtrar por período"
              />
              {filtros.periodo && (
                <button
                  onClick={() => handleClearFiltro("periodo")}
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
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Data de Retorno
            </label>
            <div className="relative">
              <input
                type="text"
                name="dataRetorno"
                value={filtros.dataRetorno}
                onChange={handleFiltroChange}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
                placeholder="Filtrar por data de retorno"
              />
              {filtros.dataRetorno && (
                <button
                  onClick={() => handleClearFiltro("dataRetorno")}
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
          {solicitacaoExames.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Nenhuma solicitação de exame encontrada.
            </p>
          ) : currentSolicitacoes.length === 0 ? (
            <p className="text-center text-gray-500 py-4 text-sm bg-white">
              Nenhuma solicitação encontrada com os filtros aplicados.
            </p>
          ) : (
            <TabelaSolicitacaoExames
              tse={currentSolicitacoes}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </div>

        {solicitacaoExamesFiltrados.length > 0 && (
          <div className="mt-6">
            <Pagination
              totalItems={solicitacaoExamesFiltrados.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              maxPageButtons={5}
            />
          </div>
        )}

        {isModalOpenAdd && (
          <ModalSolicitacaoExames
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && solicitacaoExamesSelecionado && (
          <ModalEditarSolicitacaoExames
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            solicitacaoExames={solicitacaoExamesSelecionado}
            onUpdate={handleUpdateSolicitacaoExames}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => {
              console.log("Cancelando exclusão, ID:", idToDelete);
              setIsModalOpen(false);
              setIdToDelete(null);
            }}
            message="Deseja excluir esta solicitação de exame?"
          />
        )}
        {isModalOpenDetalhes && solicitacaoExamesSelecionado && (
          <ModalDetalhesSolicitacaoExames
            isOpen={isModalOpenDetalhes}
            onClose={handleCloseModal}
            solicitacaoExames={solicitacaoExamesSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default SolicitacaoExames;