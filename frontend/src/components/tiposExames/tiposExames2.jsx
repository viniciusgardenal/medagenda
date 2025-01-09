import React, { useState, useEffect } from "react";
import FiltroTiposExames from "./filtroTiposExames";
import "./tiposExamesStyle.css";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getTiposExames,
  getTiposExamesId,
  excluirTipoExame,
} from "../../config/apiServices";
import ModalTipoExame from "./modalTipoExame";
import TabelaTiposExames from "./tabelaTipoExame";
import ModalEditarTipoExame from "./modalEditarTipoExame";
import ModalDetalhesTipoExame from "./modalDetalhesTipoExame";

const TiposExames = () => {
  const [tiposExames, setTiposExames] = useState([]);
  const [filtro, setFiltro] = useState(""); // Filtro agora é uma string simples
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

  // Função para lidar com a mudança no filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value); // Atualiza o filtro com o valor digitado
  };

  // Filtro dos tiposExames
  const tiposExamesFiltrados = tiposExames.filter((tipoExame) => {
    const pesquisa = filtro.toLowerCase(); // Convertendo o filtro para minúsculo
    return (
      tipoExame.nomeTipoExame.toLowerCase().includes(pesquisa) ||
      tipoExame.materialColetado.toLowerCase().includes(pesquisa) ||
      tipoExame.categoria.toLowerCase().includes(pesquisa)
    );
  });

  // Deletar tipoExame
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
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  // Salvar tipoExame
  const handleSave = async () => {
    await loadTiposExames();
    setShowSuccessAlert(true);
  };

  // Editar tipoExame
  const handleEditar = async (idTipoExame) => {
    const response = await getTiposExamesId(idTipoExame);
    const tipoExame = response.data;

    setTipoExameSelecionado(tipoExame);
    setIsModalOpenEditar(true);
  };

  // Exibir detalhes do profissional
  const handleDetalhes = async (idTipoExame) => {
    const response = await getTiposExamesId(idTipoExame);
    const tipoExame = response.data;

    setTipoExameSelecionado({
      ...tipoExame,
    });
    setIsModalOpenDetalhes(true); // Abrir o modal de detalhes
  };

  // Fechar modal de edição
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
    <div className="tipos-exames-crud">
      <h2>Pesquisar Tipos de Exames</h2>

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

      <FiltroTiposExames filtros={filtro} onFiltroChange={handleFiltroChange} />
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
          Adicionar Tipo de Exame
        </button>
      </form>

      <ModalTipoExame
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      <TabelaTiposExames
        tiposExames={tiposExamesFiltrados}
        onExcluir={handleDelete}
        onEditar={handleEditar}
        onDetalhes={handleDetalhes}
      />

      {isModalOpenEditar && tipoExameSelecionado && (
        <ModalEditarTipoExame
          isOpen={isModalOpenEditar}
          onClose={handleCloseModal}
          tipoExame={tipoExameSelecionado}
          onUpdate={handleUpdateTiposExames}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ModalDetalhesTipoExame
        isOpen={isModalOpenDetalhes}
        onClose={() => setIsModalOpenDetalhes(false)}
        tipoExame={tipoExameSelecionado}
      />
    </div>
  );
};

export default TiposExames;
