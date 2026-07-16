import React, { useState, useEffect } from "react";
import ModalAddHorario from "./modalAddHorario";
import ModalEditHorario from "./modalEditHorario";
import ModalViewHorario from "./modalViewHorario";
import ConfirmationModal from "./confirmationModal";
import Pagination from "../util/Pagination";
import TableHeader from "../util/TableHeader";
import { Eye, Plus } from "lucide-react";
import {
  criarHorario,
  updateHorario,
  excluirHorario,
  getHorarios,
  getProfissionais,
} from "../../config/apiServices";

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

  const sortProfissionais = (profissionaisToSort) => {
    return [...profissionaisToSort].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        matricula: (item) => {
          const matricula = item.matricula ? item.matricula.toString() : '';
          return /^\d+$/.test(matricula) ? parseInt(matricula, 10) : matricula.toLowerCase();
        },
        nome: (item) => `${item.nome} ${item.sobrenome || ""}`.toLowerCase(),
        cargo: (item) => (item.tipoProfissional || "").toLowerCase(),
      };
      
      valueA = fieldMap[sortField] ? fieldMap[sortField](a) : (sortField === 'matricula' ? 0 : '');
      valueB = fieldMap[sortField] ? fieldMap[sortField](b) : (sortField === 'matricula' ? 0 : '');

      const direction = sortDirection === "asc" ? 1 : -1;

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (valueA - valueB) * direction;
      }
      return String(valueA).localeCompare(String(valueB)) * direction;
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
      diaSemana: [horario.diaSemana], // diaSemana no modal de edição espera um array
      inicio: horario.inicio,
      fim: horario.fim,
      intervaloInicio: horario.intervaloInicio || "",
      intervaloFim: horario.intervaloFim || "",
      status: horario.status,
    });
    setModalViewOpen(false); // Fecha o modal de visualização se estiver aberto
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
    setDadosHorario({ // Resetar dados do horário
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
      const diasValidos = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
      if (diaSemana.length === 0) {
        alert("Selecione pelo menos um dia da semana.");
        setIsSaving(false);
        return;
      }
      if (!diaSemana.every((dia) => diasValidos.includes(dia))) {
        alert("Um ou mais dias da semana são inválidos!");
        setIsSaving(false);
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
        diaSemana: dadosHorario.diaSemana[0], // Pega o primeiro (e único) dia da semana para edição
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
      await refreshHorarios(); // Atualiza a lista de horários após a exclusão
    } catch (error) {
      console.error("Erro ao excluir horário:", error, error.response?.data);
      if (error.response?.status === 403) {
        alert("Acesso negado. Verifique suas permissões ou tente novamente.");
      } else {
        alert("Erro ao excluir horário. Verifique a conexão ou tente novamente.");
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  // const handleRefresh = () => { // Função não utilizada no JSX fornecido
  //  fetchData();
  // };

  // const profissionaisAtivos = profissionais.filter((prof) => // Variável não utilizada
  //  horarios.some(
  //    (h) => h.matriculaProfissional.toString() === prof.matricula.toString()
  //  )
  // ).length;

  const tableHeaders = ["Matrícula", "Nome do Profissional", "Cargo"];
  const sortableFields = ["matricula", "nome", "cargo"];


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <section className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        {/* Cabeçalho */}
        <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Horários dos Profissionais</h2>
            <p className="text-sm text-slate-500 mt-0.5">Configurar disponibilidade e escalas</p>
          </div>
          {/* Botão de adicionar global pode ser colocado aqui se necessário no futuro */}
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">
          <div className="flex-1">
            <label htmlFor="filtroNomeProfissional" className="block text-sm font-medium text-slate-700 mb-1.5">
              Nome do Profissional
            </label>
            <input
              id="filtroNomeProfissional"
              type="text"
              value={filtroNome}
              onChange={(e) => setFiltroNome(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
              placeholder="Filtrar por nome"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filtroMatriculaProfissional" className="block text-sm font-medium text-slate-700 mb-1.5">
              Matrícula
            </label>
            <input
              id="filtroMatriculaProfissional"
              type="text"
              value={filtroMatricula}
              onChange={(e) => setFiltroMatricula(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
              placeholder="Filtrar por matrícula"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="filtroTipoProfissional" className="block text-sm font-medium text-slate-700 mb-1.5">
              Tipo Profissional
            </label>
            <select
              id="filtroTipoProfissional"
              value={filtroTipoProfissional}
              onChange={(e) => setFiltroTipoProfissional(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
            >
              <option value="">Todos os Tipos</option>
              <option value="medico">Médico</option>
              <option value="atendente">Atendente</option>
              <option value="diretor">Diretor</option>
              {/* Adicione outros tipos conforme necessário */}
            </select>
          </div>
        </div>

        {/* Tabela de Profissionais */}
        <div className="mt-6 overflow-x-auto rounded-md border border-slate-200">
          {isLoading ? (
            <p className="text-center text-gray-500 py-4 text-sm">Carregando profissionais...</p>
          ) : (
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <TableHeader label="Matrícula" field="matricula" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Nome do Profissional" field="nome" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <TableHeader label="Cargo" field="cargo" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {currentProfissionais.length === 0 ? (
                  <tr>
                    <td
                      colSpan={tableHeaders.length + 1}
                      // ALTERAÇÃO: Padding reduzido de px-6 py-4 para px-4 py-3
                      className="px-4 py-3 text-center text-gray-500 text-sm"
                    >
                      {profissionaisFiltrados.length === 0 && (filtroNome || filtroMatricula || filtroTipoProfissional)
                        ? "Nenhum profissional encontrado após filtragem."
                        : "Nenhum profissional encontrado."
                      }
                    </td>
                  </tr>
                ) : (
                  currentProfissionais.map((prof) => (
                    <tr
                      key={prof.matricula}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      {/* ALTERAÇÃO: Padding reduzido de px-6 py-4 para px-4 py-3 */}
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">
                        {prof.matricula || "N/A"}
                      </td>
                      {/* ALTERAÇÃO: Padding reduzido de px-6 py-4 para px-4 py-3 */}
                      <td className="px-4 py-3 text-sm text-slate-600">{`${
                        prof.nome
                      } ${prof.sobrenome || ""}`}</td>
                      {/* ALTERAÇÃO: Padding reduzido de px-6 py-4 para px-4 py-3 */}
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {prof.tipoProfissional || "N/A"}
                      </td>
                      {/* ALTERAÇÃO: Padding reduzido de px-6 py-4 para px-4 py-3 */}
                      <td className="px-4 py-3 text-sm flex gap-2">
                        <button
                          onClick={() => openViewModal(prof)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Ver Horários"
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          onClick={() => openAddModal(prof)}
                          className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                          title="Adicionar Horário"
                        >
                          <Plus size={15} />
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
        {profissionaisOrdenados.length > itemsPerPage && (
          <div className="mt-6">
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
          profissionais={profissionais} // Passando a lista de profissionais
          selectedProfissional={selectedProfissional}// Passando o profissional selecionado
          horarios={horarios}  
        />
        <ModalEditHorario
          isOpen={modalEditOpen}
          onClose={closeModals}
          horario={selectedHorario} // Horário específico para edição
          dadosHorario={dadosHorario} // Dados do formulário
          setDadosHorario={setDadosHorario} // Para atualizar os dados do formulário
          onSave={handleUpdate}
          isSaving={isSaving}
          profissionais={profissionais} // Lista de profissionais para referência (ex: nome)
          selectedProfissional={selectedProfissional} // Profissional associado ao horário
        />
        <ModalViewHorario
          isOpen={modalViewOpen}
          onClose={closeModals}
          profissional={selectedProfissional}
          horarios={horarios.filter( // Filtra horários para o profissional selecionado
            (h) =>
              selectedProfissional && h.matriculaProfissional.toString() ===
              selectedProfissional.matricula.toString()
          )}
          onEdit={openEditModal} // Função para abrir modal de edição de um horário específico
          onDelete={openConfirmDelete} // Função para abrir modal de confirmação de exclusão
        />
        <ConfirmationModal
          isOpen={modalConfirmOpen}
          onConfirm={handleDelete}
          onCancel={closeModals}
          message={
            selectedHorario
              ? `Deseja excluir o horário de ${
                  (profissionais.find(p => p.matricula.toString() === selectedHorario.matriculaProfissional.toString())?.nome || "") + 
                  " " +
                  (profissionais.find(p => p.matricula.toString() === selectedHorario.matriculaProfissional.toString())?.sobrenome || "")
                } (${selectedHorario.diaSemana}: ${selectedHorario.inicio} - ${selectedHorario.fim})?`
              : "Deseja realmente excluir este item?"
          }
          isSaving={isSaving}
        />
      </section>
    </div>
  );
};

export default GerenciarHorariosProfissionais;