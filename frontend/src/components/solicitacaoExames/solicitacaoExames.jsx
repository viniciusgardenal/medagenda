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
  const [solicitacaoExamesSelecionado, setSolicitacaoExamesSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

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
      setError(error.error || "Não foi possível carregar as solicitações. Verifique a conexão com a API.");
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
    const tipoExame = normalizarString(tse.tipoExame?.nomeTipoExame || tse.nomeTipoExame || "");
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSolicitacoes = solicitacaoExamesFiltrados.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(solicitacaoExamesFiltrados.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center mt-6">
        <nav className="inline-flex rounded-md shadow">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-white border border-gray-300 rounded-l-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-2 border border-gray-300 text-sm font-medium ${
                currentPage === number
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-white border border-gray-300 rounded-r-md text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            Próximo
          </button>
        </nav>
      </div>
    );
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
          : `Erro ao excluir solicitação: ${error.error || error.message || "Tente novamente."}`
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
    <div className="min-h-screen bg-gray-200 p-6 z-0">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <div className="border-b pb-4 flex justify-between items-center">
          <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
            Solicitações de Exames
          </h2>
          <button
            onClick={() => setIsModalOpenAdd(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
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
            Nova Solicitação
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm font-medium">
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

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nome do Paciente
            </label>
            <div className="relative">
              <input
                type="text"
                name="paciente"
                value={filtros.paciente}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tipo de Exame
            </label>
            <div className="relative">
              <input
                type="text"
                name="tipoExame"
                value={filtros.tipoExame}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Período
            </label>
            <div className="relative">
              <input
                type="text"
                name="periodo"
                value={filtros.periodo}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Data de Retorno
            </label>
            <div className="relative">
              <input
                type="text"
                name="dataRetorno"
                value={filtros.dataRetorno}
                onChange={handleFiltroChange}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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

        <div className="overflow-x-auto rounded-lg shadow-md">
          {solicitacaoExames.length === 0 ? (
            <p className="text-center text-gray-600 py-4 text-base font-medium">
              Nenhuma solicitação de exame encontrada.
            </p>
          ) : currentSolicitacoes.length === 0 ? (
            <p className="text-center text-gray-600 py-4 text-base font-medium">
              Nenhuma solicitação encontrada com os filtros aplicados.
            </p>
          ) : (
            <TabelaSolicitacaoExames
              tse={currentSolicitacoes}
              onExcluir={handleDelete}
              onEditar={handleEditar}
              onDetalhes={handleDetalhes}
            />
          )}
        </div>

        {solicitacaoExamesFiltrados.length > 0 && renderPagination()}

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