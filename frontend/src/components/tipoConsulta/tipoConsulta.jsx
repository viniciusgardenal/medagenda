import React, { useState, useEffect } from "react";
import FiltroTipoConsulta from "./filtroTipoConsulta";
import "./tipoConsultaStyle.css";
import ConfirmationModal from "../util/confirmationModal";
import AlertMessage from "../util/alertMessage";
import SuccessAlert from "../util/successAlert";
import {
  getTipoConsulta,
  getTipoConsultaId,
  excluirTipoConsulta,
} from "../../config/apiServices";
import ModalTipoConsulta from "./modalTipoConsulta";
import TabelaTipoConsulta from "./tabelaTipoConsulta";
import ModalEditarTipoConsulta from "./modalEditarTipoConsulta";
import ModalDetalhesTipoConsulta from "./modalDetalhesConsulta";

const TipoConsulta = () => {
  const [tipoConsulta, setTipoConsulta] = useState([]);
  const [filtro, setFiltro] = useState(""); // Filtro agora é uma string simples
  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showEditSuccessAlert, setShowEditSuccessAlert] = useState(false);
  const [isModalOpenEditar, setIsModalOpenEditar] = useState(false);
  const [tipoConsultaSelecionado, setTipoConsultaSelecionado] = useState(null);
  const [isModalOpenDetalhes, setIsModalOpenDetalhes] = useState(false);

  const loadTipoConsulta = async () => {
    try {
      //console.log("Função loadTipoConsulta chamada");
      const response = await getTipoConsulta(); // Certifique-se de que getTipoConsulta está funcionando
      setTipoConsulta(response.data); // Certifique-se de que setTipoConsulta está acessível
    } catch (error) {
      console.error("Erro ao carregar tipos de consulta:", error);
    }
  };

  useEffect(() => {
    //console.log("useEffect chamado");
    loadTipoConsulta();
  }, []);

  // Função para lidar com a mudança no filtro
  const handleFiltroChange = (e) => {
    setFiltro(e.target.value); // Atualiza o filtro com o valor digitado
  };

  // Filtro dos tipoConsultas
  const tipoConsultaFiltrados = tipoConsulta.filter((tpc) => {
    const pesquisa = filtro.toLowerCase(); // Convertendo o filtro para minúsculo
    return (
      tpc.idTipoConsulta.toString().includes(pesquisa) || // Filtra pelo id (como string)
      tpc.nomeTipoConsulta.toLowerCase().includes(pesquisa) ||
      tpc.especialidade?.toLowerCase().includes(pesquisa) || // Considera que `especialidade` pode ser nulo
      tpc.duracaoEstimada?.toLowerCase().includes(pesquisa) || // Considera que `duracaoEstimada` pode ser nulo
      tpc.requisitosEspecificos?.toLowerCase().includes(pesquisa) || // Considera que `requisitosEspecificos` pode ser nulo
      tpc.prioridade?.toLowerCase().includes(pesquisa) || // Considera que `prioridade` pode ser nulo
      tpc.status?.toLowerCase().includes(pesquisa) // Considera que `status` pode ser nulo
    );
  });

  // Deletar tipoConsulta
  const handleDelete = (id) => {
    setIdToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await excluirTipoConsulta(idToDelete);
      setShowAlert(true);
      await loadTipoConsulta();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  // Salvar tipoConsulta
  const handleSave = async () => {
    await loadTipoConsulta();
    setShowSuccessAlert(true);
  };

  // Editar tipoConsulta
  const handleEditar = async (idTipoConsulta) => {
    const response = await getTipoConsultaId(idTipoConsulta);
    const tipoConsulta = response.data;

    setTipoConsultaSelecionado(tipoConsulta);
    setIsModalOpenEditar(true);
  };

  // Exibir detalhes do tipo Consulta
  const handleDetalhes = async (idTipoConsulta) => {
    const response = await getTipoConsultaId(idTipoConsulta);
    const tipoConsulta = response.data;

    setTipoConsultaSelecionado({
      ...tipoConsulta,
    });
    setIsModalOpenDetalhes(true); // Abrir o modal de detalhes
  };

  // Fechar modal de edição
  const handleCloseModal = () => {
    setIsModalOpenEditar(false);
    setTipoConsultaSelecionado(null);
  };

  const handleUpdateTipoConsulta = () => {
    loadTipoConsulta();
    setShowEditSuccessAlert(true);
    handleCloseModal();
  };

  return (
    <div className="tipos-exames-crud">
      <h2>Pesquisar Tipos de Consultas</h2>

      {showAlert && (
        <AlertMessage
          message="Item excluído com sucesso."
          onClose={() => setShowAlert(false)}
        />
      )}

      {showSuccessAlert && (
        <SuccessAlert
          message="Tipo de consulta adicionado com sucesso!"
          onClose={() => setShowSuccessAlert(false)}
        />
      )}

      {showEditSuccessAlert && (
        <SuccessAlert
          message="Tipo de consulta editado com sucesso!"
          onClose={() => setShowEditSuccessAlert(false)}
        />
      )}

      <FiltroTipoConsulta
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
          Adicionar Tipo de Consulta
        </button>
      </form>

      <ModalTipoConsulta
        isOpen={isModalOpenAdd}
        onClose={() => setIsModalOpenAdd(false)}
        onSave={handleSave}
      />

      <TabelaTipoConsulta
        tpc={tipoConsultaFiltrados}
        onExcluir={handleDelete}
        onEditar={handleEditar}
        onDetalhes={handleDetalhes}
      />

      {isModalOpenEditar && tipoConsultaSelecionado && (
        <ModalEditarTipoConsulta
          isOpen={isModalOpenEditar}
          onClose={handleCloseModal}
          tipoConsulta={tipoConsultaSelecionado}
          onUpdate={handleUpdateTipoConsulta}
        />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <ModalDetalhesTipoConsulta
        isOpen={isModalOpenDetalhes}
        onClose={() => setIsModalOpenDetalhes(false)}
        tipoConsulta={tipoConsultaSelecionado}
      />
    </div>
  );
};

export default TipoConsulta;
