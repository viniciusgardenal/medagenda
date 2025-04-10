import React, { useState, useEffect } from "react";
import FiltroSolicitacaoExames from "./filtroSolicitacaoExames";
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

const SolicitacaoExames = () => {
  const [solicitacaoExames, setSolicitacaoExames] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [solicitacaoExamesSelecionado, setSolicitacaoExamesSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);

  const loadSolicitacaoExames = async () => {
    try {
      const response = await getSolicitacaoExames();
      setSolicitacaoExames(response.data);
    } catch (error) {
      console.error("Erro ao carregar solicitações:", error);
    }
  };

  useEffect(() => {
    loadSolicitacaoExames();
  }, []);

  const handleFiltroChange = (e) => setFiltro(e.target.value);

  const solicitacaoExamesFiltrados = solicitacaoExames.filter((tse) =>
    [
      tse.tiposExame?.nomeTipoExame,
      tse.Paciente?.nome,
      tse.periodo,
      tse.dataRetorno,
    ].some((field) => field?.toLowerCase().includes(filtro.toLowerCase()))
  );

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirSolicitacaoExames(idToDelete);
      setShowAlert(true);
      await loadSolicitacaoExames();
    } catch (error) {
      console.error("Erro ao excluir:", error);
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
    const response = await getSolicitacaoExamesId(id);
    setSolicitacaoExamesSelecionado(response.data);
    setIsModalOpenEditar(true);
  };

  const handleDetalhes = async (id) => {
    const response = await getSolicitacaoExamesId(id);
    setSolicitacaoExamesSelecionado(response.data);
    setIsModalOpenDetalhes(true);
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setSolicitacaoExamesSelecionado(null);
  };

  const handleUpdateSolicitacaoExames = () => {
    loadSolicitacaoExames();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">

        {/* Título */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">Solicitações de Exames</h2>
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

        {/* Bloco de filtro e botão - versão reorganizada */}
        <div className="space-y-1 mb-6">
          {/* Label */}
          <label htmlFor="filtro" className="text-sm font-medium text-gray-600 block">
            Buscar exame, paciente ou período
          </label>

          {/* Filtro + Botão lado a lado */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {/* Campo de busca */}
            <div className="relative w-full md:w-3/4">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                id="filtro"
                type="text"
                value={filtro}
                onChange={handleFiltroChange}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Digite para buscar..."
              />
            </div>

            {/* Botão */}
            <div className="w-full md:w-1/4 flex">
              <button
                onClick={() => setIsModalOpenAdd(true)}
                className="w-full bg-blue-600 text-white flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                    d="M12 4v16m8-8H4" />
                </svg>
                Nova Solicitação
              </button>
            </div>
          </div>

          {/* Subtexto */}
          <p className="text-xs text-gray-500">
            Pressione Enter para refinar a busca.
          </p>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto">
          <TabelaSolicitacaoExames
            tse={solicitacaoExamesFiltrados}
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>
      </div>

      {/* Modais */}
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
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      {isModalOpenDetalhes && solicitacaoExamesSelecionado && (
        <ModalDetalhesSolicitacaoExames
          isOpen={isModalOpenDetalhes}
          onClose={() => setIsModalOpenDetalhes(false)}
          solicitacaoExames={solicitacaoExamesSelecionado}
        />
      )}
    </div>
  );
};

export default SolicitacaoExames;
