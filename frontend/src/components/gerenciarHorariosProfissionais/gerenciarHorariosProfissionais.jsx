import React, { useState, useEffect } from "react";
import { FaEye, FaPlus, FaEdit, FaTrash, FaCalendarAlt } from 'react-icons/fa';
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
  const [filtroMatricula, setFiltroMatricula] = useState("");
  const [filtroTipoProfissional, setFiltroTipoProfissional] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState(null);
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(null);
  const [dadosHorario, setDadosHorario] = useState({
    profissionalId: "",
    diaSemana: [],
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

  const fetchHorarios = async () => {
    setIsLoading(true);
    try {
      const horariosResponse = await getHorarios();
      setHorarios(horariosResponse.data);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const profissionaisFiltrados = profissionais.filter((prof) => {
    const nomeCompleto = `${prof.nome} ${prof.sobrenome || ""}`.trim().toLowerCase();
    const nomeMatch = nomeCompleto.includes(filtroNome.toLowerCase());
    const matriculaMatch = filtroMatricula
      ? (prof.matricula?.toString() || "").toLowerCase().includes(filtroMatricula.toLowerCase())
      : true;
    const tipoProfissionalMatch = filtroTipoProfissional ? prof.tipoProfissional === filtroTipoProfissional : true;
    return nomeMatch && matriculaMatch && tipoProfissionalMatch;
  });

  const openAddModal = (profissionalId) => {
    setDadosHorario({ profissionalId, diaSemana: [], inicio: "", fim: "", status: "Ativo" });
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

  const openViewModal = (profissional) => {
    setProfissionalSelecionado(profissional);
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
    setProfissionalSelecionado(null);
    setDadosHorario({ profissionalId: "", diaSemana: [], inicio: "", fim: "", status: "Ativo" });
  };

  const handleSaveHorario = async () => {
    try {
      const { diaSemana, ...restDados } = dadosHorario;
      const diasValidos = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
      if (diaSemana.length === 0) {
        alert("Selecione pelo menos um dia da semana.");
        return;
      }
      if (!diaSemana.every((dia) => diasValidos.includes(dia))) {
        alert("Um ou mais dias da semana são inválidos!");
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
      alert("Erro ao salvar horários. Tente novamente.");
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
      alert(`Erro ao excluir horário: ${error.response?.data?.error || error.message}`);
    }
  };

  const formatarHorario = (horario) => {
    if (!horario || typeof horario !== "string") return "Não definido";
    const [hours, minutes] = horario.split(":").slice(0, 2);
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-200 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        {/* Título */}
        <div className="border-b pb-4">
          <h2 className="text-3xl font-bold text-blue-600">Gerenciar Horários Profissionais</h2>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nome</label>
            <div className="relative">
              <input
                type="text"
                value={filtroNome}
                onChange={(e) => setFiltroNome(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Filtrar por nome..."
              />
              {filtroNome && (
                <button
                  onClick={() => setFiltroNome("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Matrícula</label>
            <div className="relative">
              <input
                type="text"
                value={filtroMatricula}
                onChange={(e) => setFiltroMatricula(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Filtrar por matrícula..."
              />
              {filtroMatricula && (
                <button
                  onClick={() => setFiltroMatricula("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo Profissional</label>
            <select
              value={filtroTipoProfissional}
              onChange={(e) => setFiltroTipoProfissional(e.target.value)}
              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              <option value="">Todos</option>
              <option value="Medico">Médico</option>
              <option value="Atendente">Atendente</option>
              <option value="Diretor">Diretor</option>
            </select>
          </div>
        </div>

        {/* Tabela de Profissionais */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Carregando profissionais...</p>
            </div>
          ) : profissionaisFiltrados.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Nenhum profissional encontrado.</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Matrícula</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tipo Profissional</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {profissionaisFiltrados.map((prof) => (
                  <tr key={prof.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">{`${prof.nome} ${prof.sobrenome || ""}`}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{prof.matricula || "N/A"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{prof.tipoProfissional || "N/A"}</td>
                    <td className="px-4 py-3 flex gap-3">
                      <button
                        onClick={() => openViewModal(prof)}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
                        title="Ver Horários"
                      >
                        <FaCalendarAlt className="h-4 w-4" /> Ver Horários
                      </button>
                      <button
                        onClick={() => openAddModal(prof.id)}
                        className="text-green-500 hover:text-green-700 flex items-center gap-1 text-sm"
                        title="Adicionar Horário"
                      >
                        <FaPlus className="h-4 w-4" /> Adicionar
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
          profissional={profissionalSelecionado}
          horarios={horarios.filter((h) => h.profissionalId.toString() === profissionalSelecionado?.id.toString())}
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