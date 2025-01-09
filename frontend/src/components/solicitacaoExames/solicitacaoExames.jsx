import React, { useState, useEffect } from "react";
import FiltroSolicitacaoExames from "./filtroSolicitacaoExames";
import "./solicitacaoExamesStyle.css";
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
  const [filtro, setFiltro] = useState(""); // Filtro agora é uma string simples
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

  const loadSolicitacaoExames = async () => {
    const response = await getSolicitacaoExames(); // Certifique-se de que getSolicitacaoExames está funcionando
    // console.log(response.data);

    setSolicitacaoExames(response.data); // Certifique-se de que setSolicitacaoExames está acessível
  };

  useEffect(() => {
    loadSolicitacaoExames();
  }, []);

  // Função para lidar com a mudança no filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value); // Atualiza o filtro com o valor digitado
  };

  // Filtro dos tipoConsultas
  const solicitacaoExamesFiltrados = solicitacaoExames.filter((tse) => {
    const pesquisa = filtro.toLowerCase();
    return (
      tse.tiposExame?.nomeTipoExame?.toLowerCase().includes(pesquisa) || // Verifica se tiposExame e nomeTipoExame existem
      tse.cpfPaciente?.nome?.toLowerCase().includes(pesquisa) || // Verifica se cpfPaciente e nome existem
      tse.periodo?.toLowerCase().includes(pesquisa) || // Verifica se periodo existe
      tse.retorno?.toLowerCase().includes(pesquisa) // Verifica se retorno existe
    );
  });
  

  // Deletar solicitacaoExames
  const handleDelete = (id) => {
    //console.log(id);

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

  // Salvar solicitacaoExames
  const handleSave = async () => {
    await loadSolicitacaoExames();
    setShowSuccessAlert(true);
  };

  // Editar solicitacaoExames
  const handleEditar = async (idSolicitacaoExames) => {
    const response = await getSolicitacaoExamesId(idSolicitacaoExames);
    const solicitacaoExames = response.data;
    // console.log(solicitacaoExames);

    setSolicitacaoExamesSelecionado(solicitacaoExames);
    setIsModalOpenEditar(true);
  };

  // Exibir detalhes do tipo Consulta
  const handleDetalhes = async (idSolicitacaoExames) => {
    const response = await getSolicitacaoExamesId(idSolicitacaoExames);
    const solicitacaoExames = response.data;
    setSolicitacaoExamesSelecionado({
      ...solicitacaoExames,
    });
    setIsModalOpenDetalhes(true); // Abrir o modal de detalhes
  };

  // Fechar modal de edição
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
    <div className="tipos-exames-crud">
      <h2>Pesquisar Solicitações de Exames</h2>

      {showAlert && (
        <AlertMessage
          message="Item excluído com sucesso."
          onClose={() => setShowAlert(false)}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="Solicitação de exame adicionado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {showEditSuccessAlert && (
        <SuccessAlert
          message="Solicitação de exame editado com sucesso!"
          onClose={() => setShowEditSuccessAlert(false)}
        />
      )}

      <FiltroSolicitacaoExames
        filtros={filtro}
        onFiltroChange={handleFiltroChange}
      />
      <form className="tipo-exame-form">
        <button type="button" onClick={() => setIsModalOpenAdd(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroleLinecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Adicionar Solicitações de Exames
        </button>
      </form>

      <ModalSolicitacaoExames
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      <TabelaSolicitacaoExames
        tse={solicitacaoExamesFiltrados}
        onExcluir={handleDelete}
        onEditar={handleEditar}
        onDetalhes={handleDetalhes}
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
