import React, { useState, useEffect } from "react";
import FiltroPacientes from "./filtroPacientes";
import "./pacientesStyle.css";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getPacientes,
  getPacientesId,
  excluirPacientes,
} from "../../config/apiServices";
import ModalPacientes from "./modalPacientes";
import TabelaPacientes from "./tabelaPacientes";
import ModalEditarPacientes from "./modalEditarPacientes";
import ModalDetalhesPacientes from "./modalDetalhesPacientes";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [filtro, setFiltro] = useState(""); // Filtro agora é uma string simples
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [pacientesSelecionado, setPacientesSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);

  const loadPacientes = async () => {
    const response = await getPacientes();
    setPacientes(response.data);
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  // Função para lidar com a mudança no filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value); // Atualiza o filtro com o valor digitado
  };

  const pacientesFiltrados = pacientes.filter((paciente) => {
    const pesquisa = filtro.toLowerCase(); // Convertendo o filtro para minúsculo
    return (
      paciente.cpf.toString().includes(pesquisa) || // Filtra pelo id (como string)
      paciente.nome?.toLowerCase().includes(pesquisa) || // Filtra pelo nome do paciente
      paciente.sobrenome?.toLowerCase().includes(pesquisa) || // Considera que `dosagem` pode ser nulo
      paciente.dataNascimento?.includes(pesquisa) // Considera que `descricao` pode ser nulo
    );
  });

  // Deletar paciente
  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirPacientes(idToDelete);
      setShowAlert(true);
      await loadPacientes();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  // Salvar paciente
  const handleSave = async () => {
    await loadPacientes();
    setShowSuccessAlert(true);
  };

  const handleEditar = async (idPaciente) => {
    try {
      const response = await getPacientesId(idPaciente);
      const paciente = response;

      setPacientesSelecionado(paciente); // Atualiza o estado com o paciente selecionado
      setIsModalOpenEditar(true); // Abre o modal de edição
    } catch (error) {
      console.error("Erro ao editar paciente:", error);
    }
  };

  const handleDetalhes = async (cpfPaciente) => {
    try {
      const response = await getPacientesId(cpfPaciente);
      const paciente = response;

      setPacientesSelecionado(paciente); // Atualiza o estado com os detalhes do paciente
      setIsModalOpenDetalhes(true); // Abre o modal de detalhes
    } catch (error) {
      console.error("Erro ao visualizar detalhes do paciente:", error);
    }
  };

  // Fechar modal de edição
  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setPacientesSelecionado(null);
  };

  const handleUpdatePacientes = () => {
    loadPacientes();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="pacientes-crud">
      <h2>Pesquisar Pacientes</h2>

      {showAlert && (
        <AlertMessage
          message="Item excluído com sucesso."
          onClose={() => setShowAlert(false)}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="paciente adicionado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {showEditSuccessAlert && (
        <SuccessAlert
          message="paciente editado com sucesso!"
          onClose={() => setShowEditSuccessAlert(false)}
        />
      )}

      <FiltroPacientes filtros={filtro} onFiltroChange={handleFiltroChange} />
      <form className="pacientes-form">
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
          Adicionar paciente
        </button>
      </form>

      <ModalPacientes
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      <TabelaPacientes
        pacientes={pacientesFiltrados}
        onExcluir={handleDelete}
        onEditar={handleEditar}
        onDetalhes={handleDetalhes}
      />

      {isModalOpenEditar && pacientesSelecionado && (
        <ModalEditarPacientes
          isOpen={isModalOpenEditar}
          onClose={handleCloseModal}
          pacientes={pacientesSelecionado}
          onUpdate={handleUpdatePacientes}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ModalDetalhesPacientes
        isOpen={isModalOpenDetalhes}
        onClose={() => setIsModalOpenDetalhes(false)}
        pacientes={pacientesSelecionado}
      />
    </div>
  );
};

export default Pacientes;
