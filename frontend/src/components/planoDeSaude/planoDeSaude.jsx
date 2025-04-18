import React, { useState, useEffect } from 'react';
import FiltroPlanoDeSaude from './filtroPlanoDeSaude';
import ConfirmationModal from '../util/confirmationModal';
import AlertMessage from '../util/alertMessage';
import SuccessAlert from '../util/successAlert';
import {
  getPlanoDeSaude,
  getPlanoDeSaudeId,
  excluirPlanoDeSaude,
} from '../../config/apiServices';
import ModalPlanoDeSaude from './modalPlanoDeSaude';
import TabelaPlanoDeSaude from './tabelaPlanoDeSaude';
import ModalEditarPlanoDeSaude from './modalEditarPlanoDeSaude';
import ModalDetalhesPlanoDeSaude from './modalDetalhesPlanoDeSaude';

const PlanoDeSaude = () => {
  const [planosSaude, setPlanosDeSaude] = useState([]);
  const [filtro, setFiltro] = useState('');
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
      setPlanosDeSaude(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar planos de saúde:', error);
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
      plano.nomePlanoDeSaude?.toLowerCase().includes(pesquisa) ||
      plano.descricao?.toLowerCase().includes(pesquisa) ||
      plano.tipoPlanoDeSaude?.toLowerCase().includes(pesquisa) ||
      plano.status?.toLowerCase().includes(pesquisa)
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
      await loadPlanoDeSaude();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadPlanoDeSaude();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idPlanoDeSaude) => {
    try {
      const response = await getPlanoDeSaudeId(idPlanoDeSaude);
      setPlanoDeSaudeSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error('Erro ao editar plano de saúde:', error);
    }
  };

  const handleDetalhes = async (idPlanoDeSaude) => {
    try {
      const response = await getPlanoDeSaudeId(idPlanoDeSaude);
      setPlanoDeSaudeSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error('Erro ao visualizar detalhes do plano de saúde:', error);
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
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">Gerenciar Planos de Saúde</h2>
        </div>

        {showAlert && (
          <AlertMessage
            message="Plano de saúde excluído com sucesso."
            onClose={() => setShowAlert(false)}
          />
        )}
        {showSuccessAlert && (
          <SuccessAlert
            message="Plano de saúde adicionado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Plano de saúde editado com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <FiltroPlanoDeSaude filtro={filtro} onFiltroChange={handleFiltroChange} />
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
              Adicionar Plano de Saúde
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <TabelaPlanoDeSaude
            planos={planosDeSaudeFiltrados}
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>

        {isModalOpenAdd && (
          <ModalPlanoDeSaude
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && planoDeSaudeSelecionado && (
          <ModalEditarPlanoDeSaude
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            plano={planoDeSaudeSelecionado}
            onUpdate={handleUpdatePlanoDeSaude}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
        {isModalOpenDetalhes && planoDeSaudeSelecionado && (
          <ModalDetalhesPlanoDeSaude
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            planoDeSaude={planoDeSaudeSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default PlanoDeSaude;