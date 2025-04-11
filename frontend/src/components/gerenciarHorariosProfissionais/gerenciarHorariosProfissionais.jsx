import React, { useState, useEffect } from "react";
import axios from "axios";
import ModalAddHorario from "./modalAddHorario";
import ModalEditHorario from "./modalEditHorario";
import ModalViewHorario from "./modalViewHorario";
import ConfirmationModal from "./confirmationModal";
import { criarHorario, updateHorario, excluirHorario, getHorarios } from "../../config/apiServices";
import { getProfissionais } from "../../config/apiServices";

const GerenciarHorariosProfissionais = () => {
  const [horarios, setHorarios] = useState([]);
  const [profissionais, setProfissionais] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroDia, setFiltroDia] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [dadosHorario, setDadosHorario] = useState({
    profissionalId: "",
    diaSemana: [], // Array para múltiplos dias
    inicio: "",
    fim: "",
    status: "Ativo",
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [horariosResponse, profissionaisResponse] = await Promise.all([
          getHorarios(),
          getProfissionais(),
        ]);
        setHorarios(horariosResponse.data);
        setProfissionais(profissionaisResponse.data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const horariosFiltrados = horarios.filter((horario) => {
    const nomeCompleto = `${horario.profissional?.nome || ""} ${horario.profissional?.sobrenome || ""}`.trim();
    const nomeMatch = nomeCompleto.toLowerCase().includes(filtroNome.toLowerCase());
    const diaMatch = filtroDia ? horario.diaSemana === filtroDia : true;
    return nomeMatch && diaMatch;
  });

  const openAddModal = () => {
    setDadosHorario({ profissionalId: "", diaSemana: [], inicio: "", fim: "", status: "Ativo" });
    setModalAddOpen(true);
  };

  const openEditModal = (horario) => {
    setHorarioSelecionado(horario);
    setDadosHorario({
      profissionalId: horario.profissionalId,
      diaSemana: [horario.diaSemana], // Para edição, começa com o dia atual (ajustar se suportar múltiplos)
      inicio: horario.inicio,
      fim: horario.fim,
      status: horario.status,
    });
    setModalEditOpen(true);
  };

  const openViewModal = (horario) => {
    setHorarioSelecionado(horario);
    setModalViewOpen(true);
  };

  const openConfirmModal = (horario) => {
    setHorarioSelecionado(horario);
    setModalConfirmOpen(true);
  };

  const closeModal = () => {
    setModalAddOpen(false);
    setModalEditOpen(false);
    setModalViewOpen(false);
    setModalConfirmOpen(false);
    setHorarioSelecionado(null);
    setDadosHorario({ profissionalId: "", diaSemana: [], inicio: "", fim: "", status: "Ativo" });
  };

  const handleSaveHorario = async () => {
    try {
      const response = await criarHorario(dadosHorario); // Envia o array diretamente
      setHorarios([...horarios, response.data]);
      closeModal();
    } catch (error) {
      console.error("Erro ao salvar horário:", error);
      if (error.response) {
        alert(`Erro: ${error.response.data.error}`);
      } else {
        alert("Erro ao salvar horário. Tente novamente.");
      }
    }
  };

  const handleUpdateHorario = async () => {
    try {
      const response = await updateHorario(horarioSelecionado.id, dadosHorario);
      setHorarios(horarios.map((h) => (h.id === horarioSelecionado.id ? response.data : h)));
      closeModal();
    } catch (error) {
      console.error("Erro ao atualizar horário:", error);
    }
  };

  const handleDeleteHorario = async () => {
    try {
      await excluirHorario(horarioSelecionado.id);
      setHorarios(horarios.filter((h) => h.id !== horarioSelecionado.id));
      closeModal();
    } catch (error) {
      console.error("Erro ao excluir horário:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">Gerenciar Horários dos Profissionais</h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Busca por Profissional</label>
            <input
              type="text"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              placeholder="Digite o nome do profissional..."
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dia da Semana</label>
            <select
              value={filtroDia}
              onChange={(e) => setFiltroDia(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia) => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>
          <div className="flex-shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-1 invisible">Placeholder</label>
            <button
              onClick={openAddModal}
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo Horário
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Carregando horários...</p>
          </div>
        ) : horarios.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">Nenhum horário disponível.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-lg">Profissional</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dia da Semana</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Início</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fim</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold rounded-tr-lg">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {horariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                      Nenhum horário encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  horariosFiltrados.map((horario) => (
                    <tr key={horario.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {`${horario.profissional?.nome || ""} ${horario.profissional?.sobrenome || ""}`.trim() || "Sem nome"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {Array.isArray(horario.diaSemana) ? horario.diaSemana.join(", ") : horario.diaSemana}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{horario.inicio}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{horario.fim}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{horario.status}</td>
                      <td className="px-4 py-3 flex gap-3">
                        <button
                          onClick={() => openViewModal(horario)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Consultar"
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
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditModal(horario)}
                          className="text-green-500 hover:text-green-700"
                          title="Editar"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => openConfirmModal(horario)}
                          className="text-red-500 hover:text-red-700"
                          title="Excluir"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12M3 7h18"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

<ModalAddHorario
          isOpen={modalAddOpen}
          onClose={closeModal}
          dadosHorario={dadosHorario}
          setDadosHorario={setDadosHorario}
          onSave={handleSaveHorario}
          profissionais={profissionais}
        />
        <ModalEditHorario
          isOpen={modalEditOpen}
          onClose={closeModal}
          horario={horarioSelecionado}
          dadosHorario={dadosHorario}
          setDadosHorario={setDadosHorario}
          onSave={handleUpdateHorario}
        />
        <ModalViewHorario
          isOpen={modalViewOpen}
          onClose={closeModal}
          horario={horarioSelecionado}
        />
        <ConfirmationModal
          isOpen={modalConfirmOpen}
          onConfirm={handleDeleteHorario}
          onCancel={closeModal}
          message={
            horarioSelecionado
              ? `Deseja excluir o horário de ${horarioSelecionado.profissional?.nome || ""} ${
                  horarioSelecionado.profissional?.sobrenome || ""
                } em ${horarioSelecionado.diaSemana}?`
              : ""
          }
        />
      </div>
    </div>
  );
};

export default GerenciarHorariosProfissionais;