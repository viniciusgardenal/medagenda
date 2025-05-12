import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../context/authContext";
import {
  getConsultas,
  registrarAtendimento,
  getAtendimentoPorId,
  atualizarAtendimento,
  excluirAtendimento,
  getAtendimentos,
} from "../../config/apiServices";
import ModalAddAtendimento from "./modalAddAtendimento";
import ModalViewAtendimento from "./modalViewAtendimento";
import ModalEditAtendimento from "./modalEditAtendimento";
import Pagination from "../util/Pagination";

// Componente para cada linha da tabela
const TableRow = ({ item, onRegister, onView, onEdit, onDelete, formatarDataHoraBR }) => {
  const isConsulta = !!item.status; // Se tem status, é uma consulta
  console.log("Renderizando linha:", item); // Log para depuração
  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-4 py-3 text-sm text-gray-700">
        {item.paciente?.nome} {item.paciente?.sobrenome}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {item.medico?.nome} (CRM: {item.medico?.crm})
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {item.tipoConsulta?.nomeTipoConsulta || "N/A"}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {isConsulta
          ? formatarDataHoraBR(item.dataConsulta, item.horaConsulta)
          : formatarDataHoraBR(item.dataAtendimento.split("T")[0], item.dataAtendimento.split("T")[1])}
      </td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {isConsulta ? item.motivo : item.diagnostico || "N/A"}
      </td>
      <td className="px-4 py-3 flex gap-3">
        {isConsulta && item.status === "agendada" && (
          <button
            onClick={() => {
              console.log("Clicou em Registrar:", item);
              onRegister(item);
            }}
            className="text-green-500 hover:text-green-700"
            title="Registrar Atendimento"
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
                d="M9 12h6m-3-3v6m9-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}
        {!isConsulta && (
          <>
            <button
              onClick={() => {
                console.log("Clicou em Visualizar:", item);
                onView(item);
              }}
              className="text-blue-500 hover:text-blue-700"
              title="Visualizar Atendimento"
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
              onClick={() => {
                console.log("Clicou em Editar:", item);
                onEdit(item);
              }}
              className="text-yellow-500 hover:text-yellow-700"
              title="Editar Atendimento"
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
              onClick={() => {
                console.log("Clicou em Excluir:", item);
                onDelete(item);
              }}
              className="text-red-500 hover:text-red-700"
              title="Excluir Atendimento"
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
          </>
        )}
      </td>
    </tr>
  );
};

// Componente para os filtros de busca
const FilterSection = ({ filtros, setFiltros }) => (
  <div className="flex gap-4">
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Buscar
      </label>
      <input
        type="text"
        placeholder="Paciente, Médico, Tipo de Consulta, Data - Hora, Diagnóstico/Motivo"
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={filtros.filtroNome}
        onChange={(e) => setFiltros({ ...filtros, filtroNome: e.target.value })}
      />
    </div>
  </div>
);

// Componente para o cabeçalho
const HeaderSection = () => (
  <div className="border-b pb-4">
    <h2 className="text-3xl font-bold text-blue-600">
      Registro de Atendimentos
    </h2>
  </div>
);

// Componente para a tabela e paginação
const AtendimentoTable = ({
  items,
  isLoading,
  formatarDataHoraBR,
  openRegisterModal,
  openViewModal,
  openEditModal,
  handleDeleteAtendimento,
  sortField,
  sortDirection,
  handleSort,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}) => {
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      let valueA, valueB;
      const fieldMap = {
        nome: (item) => item.paciente?.nome?.toLowerCase() || "",
        medico: (item) =>
          `${item.medico?.nome} ${item.medico?.sobrenome}`.toLowerCase() || "",
        tipo: (item) => item.tipoConsulta?.nomeTipoConsulta?.toLowerCase() || "z",
        horario: (item) =>
          item.status ? item.horaConsulta : item.dataAtendimento,
        motivo: (item) =>
          item.status ? item.motivo?.toLowerCase() : item.diagnostico?.toLowerCase() || "z",
      };
      valueA = fieldMap[sortField](a);
      valueB = fieldMap[sortField](b);
      const direction = sortDirection === "asc" ? 1 : -1;
      return valueA > valueB ? direction : -direction;
    });
  };

  const itemsOrdenados = sortItems(items);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = itemsOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      {isLoading ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Carregando dados...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                {[
                  "Paciente",
                  "Médico",
                  "Tipo de Consulta",
                  "Data - Hora",
                  "Diagnóstico/Motivo",
                  "Ações",
                ].map((header, index) => (
                  <th
                    key={header}
                    onClick={() =>
                      ["nome", "medico", "tipo", "horario", "motivo"][index] &&
                      handleSort(
                        ["nome", "medico", "tipo", "horario", "motivo"][index]
                      )
                    }
                    className={`px-4 py-3 text-left text-sm font-semibold cursor-pointer ${
                      index === 0 ? "rounded-tl-lg" : ""
                    } ${index === 5 ? "rounded-tr-lg" : ""} ${
                      ["nome", "medico", "tipo", "horario", "motivo"].includes(
                        sortField
                      ) &&
                      sortField ===
                        ["nome", "medico", "tipo", "horario", "motivo"][index]
                        ? "bg-blue-700"
                        : ""
                    }`}
                  >
                    {header}
                    {sortField ===
                      ["nome", "medico", "tipo", "horario", "motivo"][
                        index
                      ] && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-4 text-center text-gray-500"
                  >
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => (
                  <TableRow
                    key={item.id}
                    item={item}
                    onRegister={openRegisterModal}
                    onView={openViewModal}
                    onEdit={openEditModal}
                    onDelete={handleDeleteAtendimento}
                    formatarDataHoraBR={formatarDataHoraBR}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {itemsOrdenados.length > 0 && (
        <Pagination
          totalItems={itemsOrdenados.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          maxPageButtons={5}
        />
      )}
    </>
  );
};

const RegistroAtendimento = () => {
  const { user } = useAuthContext();
  const [items, setItems] = useState([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalViewOpen, setModalViewOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [consultaSelecionada, setConsultaSelecionada] = useState(null);
  const [atendimentoSelecionado, setAtendimentoSelecionado] = useState(null);
  const [dadosAtendimento, setDadosAtendimento] = useState({
    diagnostico: "",
    prescricao: "",
    observacoes: "",
  });
  const [filtros, setFiltros] = useState({
    filtroNome: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("horario");
  const [sortDirection, setSortDirection] = useState("asc");

  const formatarDataHoraBR = (data, hora) => {
    if (!data || !hora) return "";
    try {
      const [ano, mes, dia] = data.split("-");
      const dataBR = `${dia}/${mes}/${ano}`;
      const horaBR = hora.split(":").slice(0, 2).join(":");
      return `${dataBR} - ${horaBR}`;
    } catch (error) {
      return `${data} - ${hora}`;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Buscar consultas
        const consultasResponse = await getConsultas();
        console.log("Consultas recebidas:", consultasResponse.data);
        const consultas = consultasResponse.data.filter(
          (c) => c.status === "agendada" || c.status === "realizada"
        );

        // Buscar atendimentos
        const atendimentosResponse = await getAtendimentos();
        console.log("Atendimentos recebidos:", atendimentosResponse.data);
        const atendimentos = atendimentosResponse.data.map((atendimento) => ({
          id: atendimento.id,
          consultaId: atendimento.consultaId,
          paciente: atendimento.consulta?.paciente || { nome: "Desconhecido", sobrenome: "" },
          medico: atendimento.consulta?.medico || { nome: "Desconhecido", crm: "N/A" },
          tipoConsulta: atendimento.consulta?.tipoConsulta || { nomeTipoConsulta: "N/A" },
          dataAtendimento: atendimento.dataAtendimento,
          diagnostico: atendimento.diagnostico,
          prescricao: atendimento.prescricao,
          observacoes: atendimento.observacoes,
        }));

        setItems([...consultas.filter((c) => c.status === "agendada"), ...atendimentos]);
        setCurrentPage(1);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Sem dependências, carrega uma vez

  const itemsFiltrados = items.filter((item) => {
    const { filtroNome } = filtros;
    if (!filtroNome) return true;
    const termoBusca = filtroNome.toLowerCase();
    return (
      (item.paciente?.nome?.toLowerCase() || "").includes(termoBusca) ||
      `${item.medico?.nome} ${item.medico?.sobrenome}`.toLowerCase().includes(termoBusca) ||
      (item.tipoConsulta?.nomeTipoConsulta?.toLowerCase() || "").includes(termoBusca) ||
      formatarDataHoraBR(
        item.status ? item.dataConsulta : item.dataAtendimento.split("T")[0],
        item.status ? item.horaConsulta : item.dataAtendimento.split("T")[1]
      ).toLowerCase().includes(termoBusca) ||
      (item.status ? item.motivo : item.diagnostico || "N/A").toLowerCase().includes(termoBusca)
    );
  });

  const handleSalvarAtendimento = async () => {
    setError(null);
    try {
      const response = await registrarAtendimento(consultaSelecionada.id, dadosAtendimento);
      console.log("Atendimento registrado:", response.data);
      const novoAtendimento = {
        id: response.data.id,
        consultaId: consultaSelecionada.id,
        paciente: consultaSelecionada.paciente,
        medico: consultaSelecionada.medico,
        tipoConsulta: consultaSelecionada.tipoConsulta,
        dataAtendimento: response.data.dataAtendimento,
        diagnostico: response.data.diagnostico,
        prescricao: response.data.prescricao,
        observacoes: response.data.observacoes,
      };
      setItems([
        ...items.filter((item) => item.id !== consultaSelecionada.id),
        novoAtendimento,
      ]);
      setModalAddOpen(false);
      setDadosAtendimento({ diagnostico: "", prescricao: "", observacoes: "" });
      setConsultaSelecionada(null);
    } catch (error) {
      console.error("Erro ao registrar atendimento:", error);
      const errorMessage =
        error.response?.data?.error || "Erro ao registrar atendimento. Verifique a conexão com o servidor.";
      setError(errorMessage);
    }
  };

  const handleEditarAtendimento = async () => {
    setError(null);
    try {
      const response = await atualizarAtendimento(atendimentoSelecionado.id, dadosAtendimento);
      console.log("Atendimento atualizado:", response.data);
      setItems(
        items.map((item) =>
          item.id === atendimentoSelecionado.id
            ? { ...item, ...dadosAtendimento }
            : item
        )
      );
      setModalEditOpen(false);
      setDadosAtendimento({ diagnostico: "", prescricao: "", observacoes: "" });
      setAtendimentoSelecionado(null);
    } catch (error) {
      console.error("Erro ao editar atendimento:", error);
      const errorMessage =
        error.response?.data?.error || "Erro ao editar atendimento. Verifique a conexão com o servidor.";
      setError(errorMessage);
    }
  };

  const handleDeleteAtendimento = async (atendimento) => {
    if (window.confirm("Tem certeza que deseja excluir este atendimento?")) {
      setError(null);
      try {
        await excluirAtendimento(atendimento.id);
        setItems(items.filter((item) => item.id !== atendimento.id));
      } catch (error) {
        console.error("Erro ao excluir atendimento:", error);
        const errorMessage =
          error.response?.data?.error || "Erro ao excluir atendimento. Verifique a conexão com o servidor.";
        setError(errorMessage);
      }
    }
  };

  const openRegisterModal = (consulta) => {
    console.log("Abrindo modal de registro:", consulta);
    setConsultaSelecionada(consulta);
    setDadosAtendimento({ diagnostico: "", prescricao: "", observacoes: "" });
    setModalAddOpen(true);
  };

  const openViewModal = (atendimento) => {
    console.log("Abrindo modal de visualização:", atendimento);
    setAtendimentoSelecionado(atendimento);
    setModalViewOpen(true);
    console.log("Estado das modais:", { modalViewOpen: true, modalEditOpen, atendimentoSelecionado });
  };

  const openEditModal = (atendimento) => {
    console.log("Abrindo modal de edição:", atendimento);
    setAtendimentoSelecionado(atendimento);
    setDadosAtendimento({
      diagnostico: atendimento.diagnostico || "",
      prescricao: atendimento.prescricao || "",
      observacoes: atendimento.observacoes || "",
    });
    setModalEditOpen(true);
    console.log("Estado das modais:", { modalViewOpen, modalEditOpen: true, atendimentoSelecionado });
  };

  const closeModal = () => {
    console.log("Fechando modal");
    setModalAddOpen(false);
    setModalViewOpen(false);
    setModalEditOpen(false);
    setConsultaSelecionada(null);
    setAtendimentoSelecionado(null);
    setDadosAtendimento({ diagnostico: "", prescricao: "", observacoes: "" });
  };

  const handleSort = (field) => {
    console.log("Ordenando por:", field);
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-200 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <HeaderSection />

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}

        <FilterSection filtros={filtros} setFiltros={setFiltros} />

        <AtendimentoTable
          items={itemsFiltrados}
          isLoading={isLoading}
          formatarDataHoraBR={formatarDataHoraBR}
          openRegisterModal={openRegisterModal}
          openViewModal={openViewModal}
          openEditModal={openEditModal}
          handleDeleteAtendimento={handleDeleteAtendimento}
          sortField={sortField}
          sortDirection={sortDirection}
          handleSort={handleSort}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
        />

        {modalAddOpen && consultaSelecionada && (
          <ModalAddAtendimento
            isOpen={modalAddOpen}
            onClose={closeModal}
            consulta={consultaSelecionada}
            dadosAtendimento={dadosAtendimento}
            setDadosAtendimento={setDadosAtendimento}
            onSave={handleSalvarAtendimento}
            formatarDataHoraBR={formatarDataHoraBR}
          />
        )}

        {modalViewOpen && atendimentoSelecionado && (
          <ModalViewAtendimento
            isOpen={modalViewOpen}
            onClose={closeModal}
            atendimento={atendimentoSelecionado}
            formatarDataHoraBR={formatarDataHoraBR}
          />
        )}

        {modalEditOpen && atendimentoSelecionado && (
          <ModalEditAtendimento
            isOpen={modalEditOpen}
            onClose={closeModal}
            atendimento={atendimentoSelecionado}
            dadosAtendimento={dadosAtendimento}
            setDadosAtendimento={setDadosAtendimento}
            onSave={handleEditarAtendimento}
            formatarDataHoraBR={formatarDataHoraBR}
          />
        )}
      </div>
    </div>
  );
};

export default RegistroAtendimento;