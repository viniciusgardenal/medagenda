// Profissionais.js
import React, { useState, useEffect } from "react";
import FiltroProfissionais from "./filtroProfissionais";
import "./profissionaisStyle.css";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getProfissionais,
  getProfissionaisId,
  excluirProfissional,
} from "../../config/apiServices";
import ModalProfissional from "./modalProfissional";
import TabelaProfissionais from "../profissionais/tabelaProfissionais";
import ModalEditarProfissional from "./modalEditarProfissional";
import ModalDetalhesProfissional from "./modalDetalhesProfissional"; // Importar o modal de detalhes

const Profissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [filtro, setFiltro] = useState(""); // Filtro agora é uma string simples
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false); // Estado para o modal de detalhes

  // Carregar profissionais
  const loadProfissionais = async () => {
    const response = await getProfissionais();
    setProfissionais(response.data);
  };

  useEffect(() => {
    loadProfissionais();
  }, []);

  // Função para lidar com a mudança no filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value); // Atualiza o filtro com o valor digitado
  };

  // Função para filtrar os profissionais com base no filtro
  const profissionaisFiltrados = profissionais.filter((profissional) => {
    const pesquisa = filtro.toLowerCase(); // Convertendo o filtro para minúsculo
    return (
      profissional.nome.toLowerCase().includes(pesquisa) ||
      profissional.email.toLowerCase().includes(pesquisa) ||
      profissional.telefone.includes(pesquisa) ||
      profissional.tipoProfissional.toLowerCase().includes(pesquisa) ||
      profissional.dataNascimento.toLowerCase().includes(pesquisa)
    );
  });

  // Deletar profissional
  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirProfissional(idToDelete);
      setShowAlert(true);
      await loadProfissionais();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  // Salvar profissional
  const handleSave = async () => {
    await loadProfissionais();
    setShowSuccessAlert(true);
  };

  // Editar profissional
  const handleEditar = async (matricula) => {
    const response = await getProfissionaisId(matricula);
    const profissional = response.data;

    setProfissionalSelecionado({
      ...profissional,
    });
    setIsModalOpenEditar(true);
  };

  // Exibir detalhes do profissional
  const handleDetalhes = async (matricula) => {
    const response = await getProfissionaisId(matricula);
    const profissional = response.data;

    setProfissionalSelecionado({
      ...profissional,
    });
    setIsModalOpenDetalhes(true); // Abrir o modal de detalhes
  };

  // Fechar modal de edição
  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setProfissionalSelecionado(null);
  };

  // Atualizar profissionais após edição
  const handleUpdateProfissionais = () => {
    loadProfissionais();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="profissionais-crud">
      <h2>Pesquisar Profissionais</h2>

      {showAlert && (
        <AlertMessage
          message="Item excluído com sucesso."
          onClose={() => setShowAlert(false)}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="Profissional adicionado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {showEditSuccessAlert && (
        <SuccessAlert
          message="Profissional editado com sucesso!"
          onClose={() => setShowEditSuccessAlert(false)}
        />
      )}

      <FiltroProfissionais
        filtro={filtro}
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
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Cadastrar Profissional
        </button>
      </form>

      <ModalProfissional
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      <TabelaProfissionais
        profissionais={profissionaisFiltrados}
        onExcluir={handleDelete}
        onEditar={handleEditar}
        onDetalhes={handleDetalhes} // Adicionando a função para mostrar os detalhes
      />

      {isModalOpenEditar && profissionalSelecionado && (
        <ModalEditarProfissional
          isOpen={isModalOpenEditar}
          onClose={handleCloseModal}
          profissional={profissionalSelecionado}
          onUpdate={handleUpdateProfissionais}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ModalDetalhesProfissional
        isOpen={isModalOpenDetalhes}
        onClose={() => setIsModalOpenDetalhes(false)}
        profissional={profissionalSelecionado}
      />
    </div>
  );
};

export default Profissionais;
