import React, { useState, useEffect } from "react";
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
    diaSemana: [],
    inicio: "",
    fim: "",
    status: "Ativo",
  });

  const fetchHorarios = async () => {
    setIsLoading(true);
    try {
      const horariosResponse = await getHorarios();
      console.log("Horários recebidos:", JSON.stringify(horariosResponse.data, null, 2));
      setHorarios(horariosResponse.data);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [horariosResponse, profissionaisResponse] = await Promise.all([
          getHorarios(),
          getProfissionais(),
        ]);
        console.log("Horários iniciais:", JSON.stringify(horariosResponse.data, null, 2));
        console.log("Profissionais:", JSON.stringify(profissionaisResponse.data, null, 2));
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
    const nomeCompleto = horario.profissional
      ? `${horario.profissional.nome} ${horario.profissional.sobrenome || ""}`.trim()
      : horario.profissionalNome || `Profissional ID: ${horario.profissionalId}`;
    const nomeMatch = nomeCompleto.toLowerCase().includes(filtroNome.toLowerCase());
    const diaMatch = filtroDia ? horario.diaSemana === filtroDia : true;
    console.log(`Horário: ${horario.diaSemana}, Nome: ${nomeCompleto}, NomeMatch: ${nomeMatch}, DiaMatch: ${diaMatch}`);
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
      diaSemana: [horario.diaSemana],
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
      const { diaSemana, ...restDados } = dadosHorario;
      if (diaSemana.length === 0) {
        alert("Selecione pelo menos um dia da semana.");
        return;
      }
      const promises = diaSemana.map((dia) =>
        criarHorario({ ...restDados, diaSemana: dia })
      );
      const responses = await Promise.all(promises);
      setHorarios([...horarios, ...responses.map((res) => res.data)]);
      closeModal();
      await fetchHorarios();
    } catch (error) {
      console.error("Erro ao salvar horários:", error);
      if (error.response) {
        alert(`Erro: ${error.response.data.error}`);
      } else {
        alert("Erro ao salvar horários. Tente novamente.");
      }
    }
  };

  const handleUpdateHorario = async () => {
    try {
      const response = await updateHorario(horarioSelecionado.id, dadosHorario);
      setHorarios(horarios.map((h) => (h.id === horarioSelecionado.id ? response.data : h)));
      closeModal();
      await fetchHorarios();
    } catch (error) {
      console.error("Erro ao atualizar horário:", error);
    }
  };

  const handleDeleteHorario = async () => {
    try {
      await excluirHorario(horarioSelecionado.id);
      setHorarios(horarios.filter((h) => h.id !== horarioSelecionado.id));
      closeModal();
      await fetchHorarios();
    } catch (error) {
      console.error("Erro ao excluir horário:", error);
    }
  };

  const handleRefresh = async () => {
    await fetchHorarios();
  };

  const handleClearFiltroNome = () => {
    setFiltroNome("");
  };

  return (
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Título */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">Gerenciar Horários Profissionais</h2>
        </div>

        {/* Bloco de filtro e botões */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Busca por Profissional
            </label>
            <div className="relative">
              <input
                type="text"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Digite o nome do profissional..."
              />
              {filtroNome && (
                <button
                  onClick={handleClearFiltroNome}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Filtrar por Dia
            </label>
            <select
              value={filtroDia}
              onChange={(e) => setFiltroDia(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Todos os dias</option>
              {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia) => (
                <option key={dia} value={dia}>{dia}</option>
              ))}
            </select>
          </div>
          <div className="flex-shrink-0">
            <label className="block text-sm font-semibold text-gray-700 mb-1 invisible">
              Placeholder
            </label>
            <div className="flex gap-4">
              <button
                onClick={handleRefresh}
                className="w-full md:w-auto px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Atualizar
              </button>
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Novo Horário
              </button>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center text-gray-700 py-6">Carregando...</div>
          ) : horariosFiltrados.length === 0 ? (
            <div className="text-center text-gray-700 py-6">Nenhum horário encontrado.</div>
          ) : (
            <table className="min-w-full bg-white border rounded-lg">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Profissional</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dia da Semana</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Início</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fim</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {horariosFiltrados.map((horario) => (
                  <tr key={horario.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {horario.profissional
                        ? `${horario.profissional.nome} ${horario.profissional.sobrenome || ""}`
                        : horario.profissionalNome || `Profissional ID: ${horario.profissionalId}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{horario.diaSemana}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{horario.inicio}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{horario.fim}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{horario.status}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 flex gap-2">
                      <button
                        onClick={() => openViewModal(horario)}
                        className="text-blue-600 hover:underline"
                      >
                        Visualizar
                      </button>
                      <button
                        onClick={() => openEditModal(horario)}
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openConfirmModal(horario)}
                        className="text-red-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modais */}
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