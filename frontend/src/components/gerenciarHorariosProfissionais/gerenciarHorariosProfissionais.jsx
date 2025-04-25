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

const EyeIcon = () => (
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
);

const PlusIcon = () => (
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
);

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
    status: "Ativo",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("nome");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
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
        // console.log("Dados brutos de profissionais:", profResponse.data);
        // console.log("Profissionais carregados:", validProfissionais);
        // console.log("Horários carregados:", validHorarios);
        setProfissionais(validProfissionais);
        setHorarios(validHorarios);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Não foi possível carregar os dados. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    };
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
      console.log("Horários atualizados:", validHorarios);
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
        matricula: (item) => item.matricula.toString().toLowerCase(),
        nome: (item) => `${item.nome} ${item.sobrenome || ""}`.toLowerCase(),
        cargo: (item) => item.tipoProfissional.toLowerCase(),
      };
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);
      const direction = sortDirection === "asc" ? 1 : -1;
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

  useEffect(() => {
    // console.log("Profissionais filtrados:", profissionaisFiltrados);
  }, [profissionaisFiltrados]);

  const openAddModal = (prof) => {
    console.log("Abrindo ModalAddHorario, profissional:", prof);
    setSelectedProfissional(prof);
    setDadosHorario({
      matriculaProfissional: prof.matricula.toString(),
      diaSemana: [],
      inicio: "",
      fim: "",
      status: "Ativo",
    });
    setModalAddOpen(true);
  };

  const openEditModal = (horario) => {
    console.log("Abrindo ModalEditHorario, horário:", horario);
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
      status: horario.status,
    });
    setModalViewOpen(false);
    setModalEditOpen(true);
  };

  const openViewModal = (prof) => {
    // console.log("Abrindo ModalViewHorario, profissional:", prof);
    setSelectedProfissional(prof);
    setModalViewOpen(true);
  };

  const openConfirmDelete = (horario) => {
    console.log("Abrindo ConfirmationModal, horário:", horario);
    setSelectedHorario(horario);
    setModalConfirmOpen(true);
  };

  const closeModals = () => {
    // console.log("Fechando modais");
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
      status: "Ativo",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { diaSemana, ...rest } = dadosHorario;
      const diasValidos = [
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
        "Domingo",
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
        });
      }
      closeModals();
      await refreshHorarios();
    } catch (error) {
      console.error("Erro ao salvar horário:", error);
      alert("Erro ao salvar horário. Tente novamente.", error);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-3xl font-semibold mb-6 text-blue-600">
          Gerenciar Horários Profissionais
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Filtrar por nome"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Matrícula
            </label>
            <input
              type="text"
              value={filtroMatricula}
              onChange={(e) => setFiltroMatricula(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Filtrar por matrícula"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tipo Profissional
            </label>
            <select
              value={filtroTipoProfissional}
              onChange={(e) => setFiltroTipoProfissional(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Filtrar por tipo</option>
              <option value="medico">Médico</option>
              <option value="atendente">Atendente</option>
              <option value="diretor">Diretor</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg shadow-md">
          {isLoading ? (
            <p className="text-center text-gray-500 px-4 py-4">Carregando...</p>
          ) : profissionaisOrdenados.length === 0 ? (
            <p className="text-center text-gray-500 px-4 py-4">
              Nenhum profissional encontrado.
            </p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  {["Matrícula", "Nome do Profissional", "Cargo"].map(
                    (header, index) => (
                      <th
                        key={header}
                        onClick={() =>
                          handleSort(["matricula", "nome", "cargo"][index])
                        }
                        className={`px-4 py-3 text-left text-sm font-semibold cursor-pointer ${
                          index === 0 ? "rounded-tl-lg" : ""
                        } ${index === 2 ? "rounded-tr-lg" : ""} ${
                          sortField === ["matricula", "nome", "cargo"][index]
                            ? "bg-blue-700"
                            : ""
                        }`}
                      >
                        {header}
                        {sortField ===
                          ["matricula", "nome", "cargo"][index] && (
                          <span className="ml-1">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </th>
                    )
                  )}
                  <th className="px-4 py-3 text-left text-sm font-semibold rounded-tr-lg">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentProfissionais.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      Nenhum profissional encontrado.
                    </td>
                  </tr>
                ) : (
                  currentProfissionais.map((prof) => (
                    <tr
                      key={prof.matricula}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="w-24 px-4 py-3 text-sm text-gray-700">
                        {prof.matricula || "N/A"}
                      </td>
                      <td className="flex-1 min-w-0 px-4 py-3 text-sm text-gray-700">{`${
                        prof.nome
                      } ${prof.sobrenome || ""}`}</td>
                      <td className="flex-1 min-w-0 px-4 py-3 text-sm text-gray-700">
                        {prof.tipoProfissional || "N/A"}
                      </td>
                      <td className="flex-1 min-w-0 px-4 py-3 text-sm flex gap-3">
                        <button
                          onClick={() => openViewModal(prof)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Ver Horários"
                        >
                          <EyeIcon />
                        </button>
                        <button
                          onClick={() => openAddModal(prof)}
                          className="text-green-500 hover:text-green-700"
                          title="Adicionar Horário"
                        >
                          <PlusIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {profissionaisOrdenados.length > 0 && (
          <Pagination
            totalItems={profissionaisOrdenados.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            maxPageButtons={5}
          />
        )}

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
      </div>
    </div>
  );
};

export default GerenciarHorariosProfissionais;
