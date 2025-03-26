import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
    const response = await getSolicitacaoExames();
    setSolicitacaoExames(response.data);
  };

  useEffect(() => {
    loadSolicitacaoExames();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const solicitacaoExamesFiltrados = solicitacaoExames.filter((tse) => {
    const pesquisa = filtro.toLowerCase();
    return (
      tse.tiposExame?.nomeTipoExame?.toLowerCase().includes(pesquisa) ||
      tse.Paciente?.nome?.toLowerCase().includes(pesquisa) || // Ajustado para usar Paciente
      tse.periodo?.toLowerCase().includes(pesquisa) ||
      tse.dataRetorno?.toLowerCase().includes(pesquisa) // Ajustado para dataRetorno
    );
  });

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

  const handleEditar = async (idSolicitacaoExames) => {
    const response = await getSolicitacaoExamesId(idSolicitacaoExames);
    setSolicitacaoExamesSelecionado(response.data);
    setIsModalOpenEditar(true);
  };

  const handleDetalhes = async (idSolicitacaoExames) => {
    const response = await getSolicitacaoExamesId(idSolicitacaoExames);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Pesquisar Solicitações de Exames</h2>
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
            message="Solicitação de exame adicionada com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Solicitação de exame editada com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        {/* Filtro */}
        <FiltroSolicitacaoExames filtro={filtro} onFiltroChange={handleFiltroChange} />

        {/* Botão Adicionar */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setIsModalOpenAdd(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-150 flex items-center font-medium"
          >
            <Plus className="mr-2" size={18} />
            Adicionar Solicitação de Exame
          </button>
        </div>

        {/* Modal Adicionar */}
        <ModalSolicitacaoExames
          isOpen={isModalOpenAdd}
          onClose={() => setIsModalOpenAdd(false)}
          onSave={handleSave}
        />

        {/* Tabela */}
        <TabelaSolicitacaoExames
          tse={solicitacaoExamesFiltrados}
          onExcluir={handleDelete}
          onEditar={handleEditar}
          onDetalhes={handleDetalhes}
        />

        {/* Modal Editar */}
        {isModalOpenEditar && solicitacaoExamesSelecionado && (
          <ModalEditarSolicitacaoExames
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            solicitacaoExames={solicitacaoExamesSelecionado}
            onUpdate={handleUpdateSolicitacaoExames}
          />
        )}

        {/* Modal Confirmação */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={confirmDelete}
          onCancel={() => setIsModalOpen(false)}
        />

        {/* Modal Detalhes */}
        <ModalDetalhesSolicitacaoExames
          isOpen={isModalOpenDetalhes}
          onClose={() => setIsModalOpenDetalhes(false)}
          solicitacaoExames={solicitacaoExamesSelecionado}
        />
      </div>
    </div>
  );
};

export default SolicitacaoExames;