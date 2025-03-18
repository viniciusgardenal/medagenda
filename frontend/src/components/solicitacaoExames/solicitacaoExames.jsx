import React, { useState, useEffect } from "react";
import { 
  getSolicitacaoExames, 
  getSolicitacaoExamesId, 
  excluirSolicitacaoExames 
} from "../../config/apiServices";

// Componentes
import FiltroSolicitacaoExames from "./filtroSolicitacaoExames";
import TabelaSolicitacaoExames from "./tabelaSolicitacaoExames";
import ModalSolicitacaoExames from "./modalSolicitacaoExames";
import ModalEditarSolicitacaoExames from "./modalEditarSolicitacaoExames";
import ModalDetalhesSolicitacaoExames from "./modalDetalhesSolicitacaoExames";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";

const SolicitacaoExames = () => {
  // Estados
  const [solicitacaoExames, setSolicitacaoExames] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [solicitacaoExamesSelecionado, setSolicitacaoExamesSelecionado] = useState(null);
  const [idToDelete, setIdToDelete] = useState(null);
  
  // Estados para controle de modais
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estados para alertas
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);

  // Carregar dados
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

  // Filtragem de dados
  const solicitacaoExamesFiltrados = solicitacaoExames.filter((tse) => {
    const pesquisa = filtro.toLowerCase();
    return (
      tse.tiposExame?.nomeTipoExame?.toLowerCase().includes(pesquisa) ||
      tse.cpfPaciente?.nome?.toLowerCase().includes(pesquisa) ||
      tse.periodo?.toLowerCase().includes(pesquisa) ||
      tse.retorno?.toLowerCase().includes(pesquisa)
    );
  });

  // Handlers
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirSolicitacaoExames(idToDelete);
      await loadSolicitacaoExames();
      setShowAlert(true);
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
    try {
      const response = await getSolicitacaoExamesId(idSolicitacaoExames);
      setSolicitacaoExamesSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao carregar dados para edição:", error);
    }
  };

  const handleDetalhes = async (idSolicitacaoExames) => {
    try {
      const response = await getSolicitacaoExamesId(idSolicitacaoExames);
      setSolicitacaoExamesSelecionado({...response.data});
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
    }
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
    <div className="bg-white mt-12 rounded-lg shadow-md p-6 max-w-6xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Solicitações de Exames</h2>
        <button 
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200"
          onClick={() => setIsModalOpenAdd(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Adicionar Solicitação
        </button>
      </div>

      {/* Zona de alertas */}
      <div className="mb-4">
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
      </div>

      {/* Área de filtro */}
      <div className="mb-2 bg-gray-50 p-2 rounded-md">
        <FiltroSolicitacaoExames
          filtros={filtro}
          onFiltroChange={handleFiltroChange}
        />
      </div>

      {/* Tabela de dados */}
      <div className="overflow-x-auto">
        <TabelaSolicitacaoExames
          tse={solicitacaoExamesFiltrados}
          onExcluir={handleDelete}
          onEditar={handleEditar}
          onDetalhes={handleDetalhes}
        />
      </div>

      {/* Modais */}
      <ModalSolicitacaoExames
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      {isModalOpenEditar && solicitacaoExamesSelecionado && (
        <ModalEditarSolicitacaoExames
          isOpen={isModalOpenEditar}
          onClose={handleCloseModal}
          solicitacaoExames={solicitacaoExamesSelecionado}
          onUpdate={handleUpdateSolicitacaoExames}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ModalDetalhesSolicitacaoExames
        isOpen={isModalOpenDetalhes}
        onClose={() => setIsModalOpenDetalhes(false)}
        solicitacaoExames={solicitacaoExamesSelecionado}
      />
    </div>
  );
};

export default SolicitacaoExames;