import React, { useState, useEffect } from 'react';
import FiltroTiposExames from './filtroTiposExames';
import ConfirmationModal from '../util/confirmationModal';
import AlertMessage from '../util/alertMessage';
import SuccessAlert from '../util/successAlert';
import {
  getTiposExames,
  getTiposExamesId,
  excluirTipoExame,
} from '../../config/apiServices';
import ModalExame from './modalTipoExame';
import TabelaTiposExames from './tabelaTipoExame';
import ModalEditarTipoExame from './modalEditarTipoExame';
import ModalDetalhesTipoExame from './modalDetalhesTipoExame';

const TiposExames = () => {
  const [tiposExames, setTiposExames] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [tipoExameSelecionado, setTipoExameSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);

  const loadTiposExames = async () => {
    const response = await getTiposExames();
    setTiposExames(response.data);
  };

  useEffect(() => {
    loadTiposExames();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const tiposExamesFiltrados = tiposExames.filter((tipoExame) => {
    const pesquisa = filtro.toLowerCase();
    return (
      tipoExame.nomeTipoExame.toLowerCase().includes(pesquisa) ||
      tipoExame.materialColetado.toLowerCase().includes(pesquisa) ||
      tipoExame.categoria.toLowerCase().includes(pesquisa)
    );
  });

  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirTipoExame(idToDelete);
      setShowAlert(true);
      await loadTiposExames();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSave = async () => {
    await loadTiposExames();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idTipoExame) => {
    try {
      const response = await getTiposExamesId(idTipoExame);
      setTipoExameSelecionado(response.data);
      setIsModalOpenEditar(true);
    } catch (error) {
      console.error('Erro ao editar tipo de exame:', error);
    }
  };

  const handleDetalhes = async (idTipoExame) => {
    try {
      const response = await getTiposExamesId(idTipoExame);
      setTipoExameSelecionado(response.data);
      setIsModalOpenDetalhes(true);
    } catch (error) {
      console.error('Erro ao visualizar detalhes do tipo de exame:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setTipoExameSelecionado(null);
  };

  const handleUpdateTiposExames = () => {
    loadTiposExames();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">Pesquisar Tipos de Exames</h2>
        </div>

        {showAlert && (
          <AlertMessage
            message="Item excluído com sucesso."
            onClose={() => setShowAlert(false)}
          />
        )}
        {showSuccessAlert && (
          <SuccessAlert
            message="Tipo de exame adicionado com sucesso!"
            onClose={() => setShowSuccessAlert(false)}
          />
        )}
        {showEditSuccessAlert && (
          <SuccessAlert
            message="Tipo de exame editado com sucesso!"
            onClose={() => setShowEditSuccessAlert(false)}
          />
        )}

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <FiltroTiposExames filtro={filtro} onFiltroChange={handleFiltroChange} />
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
              Adicionar Tipo de Exame
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          <TabelaTiposExames
            tiposExames={tiposExamesFiltrados}
            onExcluir={handleDelete}
            onEditar={handleEditar}
            onDetalhes={handleDetalhes}
          />
        </div>

        {isModalOpenAdd && (
          <ModalExame
            isOpen={isModalOpenAdd}
            onClose={() => setIsModalOpenAdd(false)}
            onSave={handleSave}
          />
        )}
        {isModalOpenEditar && tipoExameSelecionado && (
          <ModalEditarTipoExame
            isOpen={isModalOpenEditar}
            onClose={handleCloseModal}
            tipoExame={tipoExameSelecionado}
            onUpdate={handleUpdateTiposExames}
          />
        )}
        {isModalOpen && (
          <ConfirmationModal
            isOpen={isModalOpen}
            onConfirm={confirmDelete}
            onCancel={() => setIsModalOpen(false)}
          />
        )}
        {isModalOpenDetalhes && tipoExameSelecionado && (
          <ModalDetalhesTipoExame
            isOpen={isModalOpenDetalhes}
            onClose={() => setIsModalOpenDetalhes(false)}
            tipoExame={tipoExameSelecionado}
          />
        )}
      </div>
    </div>
  );
};

export default TiposExames;