import React, { useState, useEffect } from "react";
import ModalAddHorario from "./modalAddHorario";
import ModalEditHorario from "./modalEditHorario";
import ModalViewHorario from "./modalViewHorario";
import ConfirmationModal from "./confirmationModal";
import Pagination from "../util/Pagination";
import {
  criarHorario,
  updateHorario,
  excluirHorario,
  getHorarios,
  getProfissionais,
} from "../../config/apiServices";
import { FaPlus, FaEye, FaSyncAlt, FaClock } from "react-icons/fa";

const GerenciarHorariosProfissionais = () => {
  const [profissionais, setProfissionais] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroMatricula, setFiltroMatricula] = useState("");
  const [filtroTipoProfissional, setFiltroTipoProfissional] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [dadosHorario, setDadosHorario] = useState({
    matriculaProfissional: "",
    diaSemana: [],
    inicio: "",
    fim: "",
    intervaloInicio: "",
    intervaloFim: "",
    status: "Ativo",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [profResponse, horResponse] = await Promise.all([
        getProfissionais(),
        getHorarios(),
      ]);
      const validProfissionais = profResponse.data.filter(
        (p) => p.matricula != null && p.nome
      );
      const validHorarios = horResponse.data.filter(
        (h) =>
          h.id &&
          h.matriculaProfissional != null &&
          h.diaSemana &&
          h.inicio &&
          h.fim
      );
      setProfissionais(validProfissionais);
      setHorarios(validHorarios);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Não foi possível carregar os dados. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshHorarios = async () => {
    setIsLoading(true);
    try {
      const response = await getHorarios();
      const validHorarios = response.data.filter(
        (h) =>
          h.id &&
          h.matriculaProfissional != null &&
          h.diaSemana &&
          h.inicio &&
          h.fim
      );
      setHorarios(validHorarios);
    } catch (error) {
      console.error("Erro ao atualizar horários:", error);
      setError("Erro ao atualizar horários. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const sortProfissionais = (profissionais) => {
    return [...profissionais].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        matricula: (item) => {
          const matricula = item.matricula.toString();
          return /^\d+$/.test(matricula) ? parseInt(matricula, 10) : matricula.toLowerCase();
        },
        nome: (item) => `${item.nome} ${item.sobrenome || ""}`.toLowerCase(),
        cargo: (item) => item.tipoProfissional.toLowerCase(),
      };
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);

      const direction = sortDirection === "asc" ? 1 : -1;

      if (sortField === "matricula") {
        if (typeof valueA === "number" && typeof valueB === "number") {
          return (valueA - valueB) * direction;
        }
        return valueA.localeCompare(valueB) * direction;
      }

      return valueA > valueB ? direction : -direction;
    });
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const profissionaisFiltrados = profissionais.filter((prof) => {
    const nomeCompleto = `${prof.nome} ${prof.sobrenome || ""}`.toLowerCase();
    const matriculaStr = prof.matricula
      ? prof.matricula.toString().toLowerCase()
      : "";
    const tipo = prof.tipoProfissional
      ? prof.tipoProfissional.toLowerCase()
      : "";
    return (
      nomeCompleto.includes(filtroNome.toLowerCase()) &&
      matriculaStr.includes(filtroMatricula.toLowerCase()) &&
      (filtroTipoProfissional
        ? tipo === filtroTipoProfissional.toLowerCase()
        : true)
    );
  });

  const profissionaisOrdenados = sortProfissionais(profissionaisFiltrados);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfissionais = profissionaisOrdenados.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openAddModal = (prof) => {
    setSelectedProfissional(prof);
    setDadosHorario({
      matriculaProfissional: prof.matricula.toString(),
      diaSemana: [],
      inicio: "",
      fim: "",
      intervaloInicio: "",
      intervaloFim: "",
      status: "Ativo",
    });
    setModalAddOpen(true);
  };

  const openEditModal = (horario) => {
    setSelectedHorario(horario);
    setSelectedProfissional(
      profissionais.find(
        (p) =>
          p.matricula.toString() === horario.matriculaProfissional.toString()
      ) || null
    );
    setDadosHorario({
      matriculaProfissional: horario.matriculaProfissional.toString(),
      diaSemana: [horario.diaSemana],
      inicio: horario.inicio,
      fim: horario.fim,
      intervaloInicio: horario.intervaloInicio || "",
      intervaloFim: horario.intervaloFim || "",
      status: horario.status,
    });
    setModalViewOpen(false);
    setModalEditOpen(true);
  };

  const openViewModal = (prof) => {
    setSelectedProfissional(prof);
    setModalViewOpen(true);
  };

  const openConfirmDelete = (horario) => {
    setSelectedHorario(horario);
    setModalConfirmOpen(true);
  };

  const closeModals = () => {
    setModalAddOpen(false);
    setModalEditOpen(false);
    setModalViewOpen(false);
    setModalConfirmOpen(false);
    setSelectedProfissional(null);
    setSelectedHorario(null);
    setDadosHorario({
      matriculaProfissional: "",
      diaSemana: [],
      inicio: "",
      fim: "",
      intervaloInicio: "",
      intervaloFim: "",
      status: "Ativo",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { diaSemana, ...rest } = dadosHorario;
      const diasValidos = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      if (diaSemana.length === 0) {
        alert("Selecione pelo menos um dia da semana.");
        return;
      }
      if (!diaSemana.every((dia) => diasValidos.includes(dia))) {
        alert("Um ou mais dias da semana são inválidos!");
        return;
      }
      for (const dia of diaSemana) {
        await criarHorario({
          ...rest,
          matriculaProfissional: rest.matriculaProfissional,
          diaSemana: dia,
          intervaloInicio: rest.intervaloInicio || null,
          intervaloFim: rest.intervaloFim || null,
        });
      }
      closeModals();
      await refreshHorarios();
    } catch (error) {
      console.error("Erro ao salvar horário:", error);
      alert("Erro ao salvar horário. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updateHorario(selectedHorario.id, {
        ...dadosHorario,
        matriculaProfissional: dadosHorario.matriculaProfissional,
        diaSemana: dadosHorario.diaSemana[0],
        intervaloInicio: dadosHorario.intervaloInicio || null,
        intervaloFim: dadosHorario.intervaloFim || null,
      });
      closeModals();
      await refreshHorarios();
    } catch (error) {
      console.error("Erro ao atualizar horário:", error);
      alert("Erro ao atualizar horário. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsSaving(true);
    try {
      await excluirHorario(selectedHorario.id);
      closeModals();
      await refreshHorarios();
    } catch (error) {
      console.error("Erro ao excluir horário:", error, error.response?.data);
      if (error.response?.status === 403) {
        alert("Acesso negado. Verifique suas permissões ou tente novamente.");
      } else {
        alert(
          "Erro ao excluir horário. Verifique a conexão ou tente novamente."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  const profissionaisAtivos = profissionais.filter((prof) =>
    horarios.some(
      (h) => h.matriculaProfissional.toString() === prof.matricula.toString()
    )
  ).length;

  return (
    <section className="max-w-6xl mx-auto mt-6 px-4 py-6 bg-gray-50 rounded-2xl shadow-lg">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
          <FaClock className="h-6 w-6" />
          Gerenciar Horários
        </h2>
      </div>

      {/* Mensagem de Erro */}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por nome"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Matrícula
            </label>
            <input
              type="text"
              value={filtroMatricula}
              onChange={(e) => setFiltroMatricula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Filtrar por matrícula"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Tipo Profissional
            </label>
            <select
              value={filtroTipoProfissional}
              onChange={(e) => setFiltroTipoProfissional(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Filtrar por tipo</option>
              <option value="medico">Médico</option>
              <option value="atendente">Atendente</option>
              <option value="diretor">Diretor</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Profissionais */}
      <div className="overflow-x-auto rounded-lg shadow-md">
        {isLoading ? (
          <p className="text-center text-gray-600 py-4 text-base font-medium">Carregando...</p>
        ) : profissionaisOrdenados.length === 0 ? (
          <p className="text-center text-gray-600 py-4 text-base font-medium">
            Nenhum profissional encontrado.
          </p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                {["Matrícula", "Nome do Profissional", "Cargo"].map(
                  (header, index) => (
                    <th
                      key={header}
                      onClick={() =>
                        handleSort(["matricula", "nome", "cargo"][index])
                      }
                      className="px-4 py-3.5 text-left text-sm font-semibold uppercase tracking-wide cursor-pointer"
                    >
                      {header}
                      {sortField ===
                        ["matricula", "nome", "cargo"][index] && (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </th>
                  )
                )}
                <th className="px-4 py-3.5 text-left text-sm font-semibold uppercase tracking-wide">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentProfissionais.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-4 text-center text-gray-600 text-base font-medium"
                  >
                    Nenhum profissional encontrado.
                  </td>
                </tr>
              ) : (
                currentProfissionais.map((prof) => (
                  <tr
                    key={prof.matricula}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-4 text-sm text-gray-800 font-medium">
                      {prof.matricula || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-800">{`${
                      prof.nome
                    } ${prof.sobrenome || ""}`}</td>
                    <td className="px-4 py-4 text-sm text-gray-800">
                      {prof.tipoProfissional || "N/A"}
                    </td>
                    <td className="px-4 py-4 text-sm flex gap-2">
                      <button
                        onClick={() => openViewModal(prof)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="Ver Horários"
                      >
                        <FaEye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => openAddModal(prof)}
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        title="Adicionar Horário"
                      >
                        <FaPlus className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginação */}
      {profissionaisOrdenados.length > 0 && (
        <div className="mb-4">
          <Pagination
            totalItems={profissionaisOrdenados.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        </div>
      )}

      {/* Modals */}
      <ModalAddHorario
        isOpen={modalAddOpen}
        onClose={closeModals}
        dadosHorario={dadosHorario}
        setDadosHorario={setDadosHorario}
        onSave={handleSave}
        isSaving={isSaving}
        profissionais={profissionais}
      />
      <ModalEditHorario
        isOpen={modalEditOpen}
        onClose={closeModals}
        horario={selectedHorario}
        dadosHorario={dadosHorario}
        setDadosHorario={setDadosHorario}
        onSave={handleUpdate}
        isSaving={isSaving}
        profissionais={profissionais}
      />
      <ModalViewHorario
        isOpen={modalViewOpen}
        onClose={closeModals}
        profissional={selectedProfissional}
        horarios={horarios.filter(
          (h) =>
            h.matriculaProfissional.toString() ===
            selectedProfissional?.matricula.toString()
        )}
        onEdit={openEditModal}
        onDelete={openConfirmDelete}
      />
      <ConfirmationModal
        isOpen={modalConfirmOpen}
        onConfirm={handleDelete}
        onCancel={closeModals}
        message={
          selectedHorario
            ? `Deseja excluir o horário de ${
                profissionais.find(
                  (p) =>
                    p.matricula.toString() ===
                    selectedHorario.matriculaProfissional.toString()
                )?.nome || ""
              } ${
                profissionais.find(
                  (p) =>
                    p.matricula.toString() ===
                    selectedHorario.matriculaProfissional.toString()
                )?.sobrenome || ""
              } em ${selectedHorario.diaSemana} das ${
                selectedHorario.inicio
              } às ${selectedHorario.fim}?`
            : ""
        }
        isSaving={isSaving}
      />
    </section>
  );
};

export default GerenciarHorariosProfissionais;