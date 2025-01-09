import React, { useState, useEffect } from "react";
import FiltroPlanoDeSaude from "./filtroPlanoDeSaude";
import "./planoDeSaudeStyle.css";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getPlanoDeSaude,
  getPlanoDeSaudeId,
  excluirPlanoDeSaude,
} from "../../config/apiServices";
import ModalPlanoDeSaude from "./modalPlanoDeSaude";
import TabelaPlanoDeSaude from "./tabelaPlanoDeSaude";
import ModalEditarPlanoDeSaude from "./modalEditarPlanoDeSaude";
import ModalDetalhesPlanoDeSaude from "./modalDetalhesPlanoDeSaude";

const PlanoDeSaude = () => {
  const [planosSaude, setPlanosDeSaude] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [planoDeSaudeSelecionado, setPlanoDeSaudeSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);

  const loadPlanoDeSaude = async () => {
    try {
      const response = await getPlanoDeSaude();
      // //console.log("Planos de saúde carregados:", response.data); // Verifique a resposta aqui
      setPlanosDeSaude(response.data);
    } catch (error) {
      console.error("Erro ao carregar planos de saúde:", error);
    }
  };
  useEffect(() => {
    loadPlanoDeSaude();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const planosDeSaudeFiltrados = planosSaude.filter((plano) => {
    const pesquisa = filtro.toLowerCase();
    return (
      plano.nomePlanoDeSaude.toLowerCase().includes(pesquisa) ||
      plano.tipoPlanoDeSaude.toLowerCase().includes(pesquisa) ||
      plano.status.toLowerCase().includes(pesquisa)
    );
  });

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirPlanoDeSaude(idToDelete);
      setShowAlert(true);
      // Remover o plano da lista localmente após a exclusão
      await loadPlanoDeSaude();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    try {
      // Adicionar o novo plano de saúde à API
      await loadPlanoDeSaude(); // Carregar novamente a lista de planos
      setShowSuccessAlert(true);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleEditar = async (idPlanoDeSaude) => {
    try {
      const response = await getPlanoDeSaudeId(idPlanoDeSaude);
      const plano = response.data;
      // //console.log(`Editar Medicamento`, plano);

      setPlanoDeSaudeSelecionado(plano);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error("Erro ao editar plano de saúde:", error);
    }
  };

  const handleDetalhes = async (idPlanoDeSaude) => {
    try {
      const response = await getPlanoDeSaudeId(idPlanoDeSaude);

      setPlanoDeSaudeSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error("Erro ao visualizar detalhes do plano de saúde:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setPlanoDeSaudeSelecionado(null);
  };

  const handleUpdatePlanoDeSaude = () => {
    loadPlanoDeSaude();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="plano-de-saude-crud">
      <h2>Gerenciar de Planos de Saúde</h2>

      {showAlert && (
        <AlertMessage
          message="Plano de Saúde excluído com sucesso."
          onClose={() => setShowAlert(false)}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="Plano de Saúde adicionado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {showEditSuccessAlert && (
        <SuccessAlert
          message="Plano de Saúde editado com sucesso!"
          onClose={() => setShowEditSuccessAlert(false)}
        />
      )}

      <FiltroPlanoDeSaude filtro={filtro} onFiltroChange={handleFiltroChange} />

      <form className="plano-de-saude-form">
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
          Adicionar Plano de Saúde
        </button>
      </form>

      <ModalPlanoDeSaude
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      <TabelaPlanoDeSaude
        planos={planosDeSaudeFiltrados}
        onExcluir={handleDelete}
        onEditar={handleEditar}
        onDetalhes={handleDetalhes}
      />

      {isModalOpenEditar && planoDeSaudeSelecionado && (
        <ModalEditarPlanoDeSaude
          isOpen={isModalOpenEditar}
          onClose={handleCloseModal}
          plano={planoDeSaudeSelecionado}
          onUpdate={handleUpdatePlanoDeSaude}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      {isModalOpenDetalhes && planoDeSaudeSelecionado && (
        <ModalDetalhesPlanoDeSaude
          isOpen={isModalOpenDetalhes}
          onClose={() => setIsModalOpenDetalhes(false)}
          planoDeSaude={planoDeSaudeSelecionado}
        />
      )}
    </div>
  );
};

export default PlanoDeSaude;
