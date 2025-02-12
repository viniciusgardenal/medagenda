import React, { useState, useEffect } from "react";
import FiltroMedicamentos from "./filtroMedicamentos";
import "./medicamentosStyle.css";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getMedicamentos,
  getMedicamentosId,
  excluirMedicamentos,
} from "../../config/apiServices";
import ModalMedicamentos from "./modalMedicamentos";
import TabelaMedicamentos from "./tabelaMedicamentos";
import ModalEditarMedicamentos from "./modalEditarMedicamentos";
import ModalDetalhesMedicamentos from "./modalDetalhesMedicamentos";

const Medicamentos = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [filtro, setFiltro] = useState(""); // Filtro agora é uma string simples
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [medicamentosSelecionado, setMedicamentosSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);

  // Função para carregar medicamentos
  const loadMedicamentos = async () => {
    const response = await getMedicamentos();
    setMedicamentos(response.data);
  };

  useEffect(() => {
    loadMedicamentos();
  }, []);

  // Função para lidar com a mudança no filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value); // Atualiza o filtro com o valor digitado
  };

  // Filtro dos medicamentos
  const medicamentosFiltrados = medicamentos.filter((medicamento) => {
    const pesquisa = filtro.toLowerCase(); // Convertendo o filtro para minúsculo
    return (
      medicamento.nomeMedicamento.toLowerCase().includes(pesquisa) || // Filtra pelo nome do medicamento
      // medicamento.dosagem?.toLowerCase().includes(pesquisa) || // Considera que `dosagem` pode ser nulo
      medicamento.nomeFabricante?.toLowerCase().includes(pesquisa) || // Considera que `nomeFabricante` pode ser nulo
      medicamento.descricao?.toLowerCase().includes(pesquisa) // Considera que `descricao` pode ser nulo
    );
  });

  // Deletar medicamento
  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirMedicamentos(idToDelete);
      setShowAlert(true);
      await loadMedicamentos();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  // Salvar medicamento
  const handleSave = async () => {
    await loadMedicamentos();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idMedicamento) => {
    try {
      const response = await getMedicamentosId(idMedicamento);
      const medicamento = response.data;

      //console.log(`Editar Medicamento`, medicamento);

      setMedicamentosSelecionado(medicamento); // Atualiza o estado com o medicamento selecionado
      setIsModalOpenEditar(true); // Abre o modal de edição
    } catch (error) {
      console.error("Erro ao editar medicamento:", error);
    }
  };

  const handleDetalhes = async (idMedicamento) => {
    try {
      const response = await getMedicamentosId(idMedicamento);
      const medicamento = response.data;

      setMedicamentosSelecionado(medicamento); // Atualiza o estado com os detalhes do medicamento
      setIsModalOpenDetalhes(true); // Abre o modal de detalhes
    } catch (error) {
      console.error("Erro ao visualizar detalhes do medicamento:", error);
    }
  };

  // Fechar modal de edição
  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setMedicamentosSelecionado(null);
  };

  const handleUpdateMedicamentos = () => {
    loadMedicamentos();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="medicamentos-crud">
      <h2>Pesquisar Medicamentos</h2>

      {showAlert && (
        <AlertMessage
          message="Item excluído com sucesso."
          onClose={() => setShowAlert(false)}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="Medicamento adicionado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {showEditSuccessAlert && (
        <SuccessAlert
          message="Medicamento editado com sucesso!"
          onClose={() => setShowEditSuccessAlert(false)}
        />
      )}

      <FiltroMedicamentos
        filtros={filtro}
        onFiltroChange={handleFiltroChange}
      />
      <form className="medicamentos-form">
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
          Adicionar Medicamento
        </button>
      </form>

      <ModalMedicamentos
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      <TabelaMedicamentos
        medicamentos={medicamentosFiltrados}
        onExcluir={handleDelete}
        onEditar={handleEditar}
        onDetalhes={handleDetalhes}
      />

      {isModalOpenEditar && medicamentosSelecionado && (
        <ModalEditarMedicamentos
          isOpen={isModalOpenEditar}
          onClose={handleCloseModal}
          medicamentos={medicamentosSelecionado}
          onUpdate={handleUpdateMedicamentos}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ModalDetalhesMedicamentos
        isOpen={isModalOpenDetalhes}
        onClose={() => setIsModalOpenDetalhes(false)}
        medicamentos={medicamentosSelecionado}
      />
    </div>
  );
};

export default Medicamentos;
