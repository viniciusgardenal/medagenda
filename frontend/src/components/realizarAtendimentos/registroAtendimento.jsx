import { useState, useEffect } from "react";
import ConfirmationModal from "../util/confirmationModal";
import {
  getConsultas,
  registrarAtendimento,
  atualizarAtendimento,
  excluirAtendimento,
  alterarConsultaEhAtendimentoCancelado,
  gerarRelatorioAtendimentos,
} from "../../config/apiServices";
import ModalAddAtendimento from "./modalAddAtendimento";
import ModalViewAtendimento from "./modalViewAtendimento";
import ModalEditAtendimento from "./modalEditAtendimento";
import Pagination from "../util/Pagination";
import TableHeader from "../util/TableHeader";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";

const formatarDataHoraBR = (dataHora) => {
  if (!dataHora || !dataHora.includes("T")) return "";
  const [data, hora] = dataHora.split("T");
  const [ano, mes, dia] = data.split("-");
  const horaFormatada = hora.split(":").slice(0, 2).join(":");
  return `${dia}/${mes}/${ano} - ${horaFormatada}`;
};

const FilterSection = ({ filtros, setFiltros }) => (
  <div className="flex flex-col md:flex-row gap-4 mt-6">
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Buscar
      </label>
      <input
        type="text"
        placeholder="Paciente, Médico, Tipo de Consulta, Data - Hora, Diagnóstico/Motivo"
        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
        value={filtros.filtroNome}
        onChange={(e) => setFiltros({ ...filtros, filtroNome: e.target.value })}
      />
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        Status
      </label>
      <select
        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-md bg-white text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700 transition-colors"
        value={filtros.filtroStatus}
        onChange={(e) =>
          setFiltros({ ...filtros, filtroStatus: e.target.value })
        }
      >
        <option value="checkin_realizado">Check-in Realizado</option>
        <option value="realizada">Realizada</option>
      </select>
    </div>
  </div>
);

const HeaderSection = () => (
  <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
    <div>
      <h2 className="text-xl font-bold text-slate-800">Registrar Atendimentos</h2>
      <p className="text-sm text-slate-500 mt-0.5">Prontuários e registros clínicos de atendimento</p>
    </div>
  </div>
);

const TableRow = ({ item, onRegister, onView, onEdit, onDelete }) => {
  const isPendingRegistration = item.status === "checkin_realizado";

  const dataHora = isPendingRegistration
    ? formatarDataHoraBR(`${item.dataConsulta}T${item.horaConsulta}`)
    : formatarDataHoraBR(item.atendimento?.dataAtendimento);

  return (
    <tr className="hover:bg-slate-50 transition-colors">
      <td className="px-6 py-3 text-sm font-medium text-slate-700">
        {item.paciente?.nome} {item.paciente?.sobrenome}
      </td>
      <td className="px-6 py-3 text-sm text-slate-600">
        {item.medico?.nome} (CRM: {item.medico?.crm})
      </td>
      <td className="px-6 py-3 text-sm text-slate-600">
        {item.tipoConsulta?.nomeTipoConsulta ||
          item.idTipoConsulta?.nome ||
          "N/A"}
      </td>
      <td className="px-6 py-3 text-sm text-slate-600">{dataHora}</td>
      <td className="px-6 py-3 text-sm text-slate-600">
        {item.atendimento?.diagnostico}
      </td>
      <td className="px-6 py-3.5">
        {isPendingRegistration ? (
          <button
            onClick={() => onRegister(item)}
            className="inline-flex items-center gap-1 rounded-md bg-amber-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-amber-800 transition-colors"
            title="Registrar Atendimento"
          >
            <Plus size={12} />
            Registrar
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(item)}
              className="p-1.5 rounded-md text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
              title="Visualizar Atendimento"
            >
              <Eye size={15} />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-md text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Editar Atendimento"
            >
              <Pencil size={15} />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-1.5 rounded-md text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Excluir Atendimento"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

const AtendimentoTable = ({
  items,
  isLoading,
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
    const fieldMap = {
      nome: (i) => i.paciente?.nome?.toLowerCase() || "",
      medico: (i) =>
        `${i.medico?.nome} ${i.medico?.sobrenome}`.toLowerCase() || "",
      tipo: (i) => i.tipoConsulta?.nomeTipoConsulta?.toLowerCase() || "z",
      horario: (i) => (i.status ? i.horaConsulta : i.dataAtendimento),
      motivo: (i) => (i.status ? i.motivo : i.diagnostico || "z").toLowerCase(),
    };
    return [...items].sort((a, b) => {
      const aVal = fieldMap[sortField](a);
      const bVal = fieldMap[sortField](b);
      return sortDirection === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });
  };

  const sorted = sortItems(items);
  const currentItems = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return isLoading ? (
    <div className="text-center py-3 text-sm text-gray-500 bg-white">
      Carregando...
    </div>
  ) : (
    <>
      <div className="mt-3 overflow-x-auto rounded-md border border-slate-200">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <TableHeader label="Paciente" field="nome" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader label="Médico" field="medico" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader label="Tipo de Consulta" field="tipo" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader label="Data - Hora" field="horario" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableHeader label="Diagnóstico/Motivo" field="motivo" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-200 w-28">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {currentItems.length ? (
              currentItems.map((item) => (
                <TableRow
                  key={item.id}
                  item={item}
                  onRegister={openRegisterModal}
                  onView={openViewModal}
                  onEdit={openEditModal}
                  onDelete={handleDeleteAtendimento}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {sorted.length > 0 && (
        <div className="mt-6">
          <Pagination
            totalItems={sorted.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            maxPageButtons={5}
          />
        </div>
      )}
    </>
  );
};

const RegistroAtendimento = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
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
    filtroStatus: "checkin_realizado", // Ou o valor padrão que você quer, ex: "todos_relevantes"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("horario");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};

      if (filtros.filtroStatus && filtros.filtroStatus !== "todos_relevantes") {
        params.status = filtros.filtroStatus;
      } else {
        params.status = ["checkin_realizado", "realizada"];
      }

      if (filtros.filtroNome) {
        params.searchTerm = filtros.filtroNome;
      }

      const response = await getConsultas(params);
      setItems(response.data.data || response.data || []);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Erro ao carregar dados. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filtros.filtroStatus, filtros.filtroNome]);

  const handleSalvarAtendimento = async () => {
    console.log("Dados do atendimento:", dadosAtendimento);
    console.log("Consulta selecionada:", consultaSelecionada.id);

    try {
      await registrarAtendimento(consultaSelecionada.id, dadosAtendimento);
      closeModal();
      fetchData(); // <-- Força o recarregamento
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao registrar atendimento.");
    }
  };

  const handleEditarAtendimento = async () => {
    // console.log("Dados do atendimento para edição:", atendimentoSelecionado);

    try {
      await atualizarAtendimento(
        atendimentoSelecionado.atendimento.id,
        dadosAtendimento
      );
      closeModal();
      fetchData(); // <-- Força o recarregamento
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao editar atendimento.");
    }
  };

  const handleDeleteAtendimento = async (atendimento) => {
    setIdToDelete(atendimento.id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setError(null);
    try {
      const atendimento = items.find((item) => item.id === idToDelete);

      console.log(atendimento);

      if (atendimento?.consulta_id) {
        await alterarConsultaEhAtendimentoCancelado(atendimento.consulta_id);
      }

      await excluirAtendimento(idToDelete);
      setItems(items.filter((item) => item.id !== idToDelete));
    } catch (error) {
      console.error("Erro ao cancelar consulta ou excluir atendimento:", error);
      const errorMessage =
        error.response?.data?.error ||
        "Erro ao excluir atendimento. Verifique a conexão com o servidor.";
      setError(errorMessage);
    } finally {
      setIsModalOpen(false);
      setIdToDelete(null);
    }
  };

  const handleSort = (field) => {
    setSortDirection(
      field === sortField && sortDirection === "asc" ? "desc" : "asc"
    );
    setSortField(field);
    setCurrentPage(1);
  };

  const closeModal = () => {
    setModalAddOpen(false);
    setModalViewOpen(false);
    setModalEditOpen(false);
    setConsultaSelecionada(null);
    setAtendimentoSelecionado(null);
    setDadosAtendimento({ diagnostico: "", prescricao: "", observacoes: "" });
  };

  const handleDownloadRelatorio = async () => {
    try {
      const response = await gerarRelatorioAtendimentos();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_atendimentos.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      const errorMessage = error.message.includes("404")
        ? "Rota de relatório não encontrada no servidor."
        : error.message || "Erro ao gerar o relatório de atendimentos.";
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-slate-200 shadow-sm p-6">
        <HeaderSection />
        <button
          onClick={handleDownloadRelatorio}
          className="inline-flex items-center mt-6 gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 transition-colors"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V8"
            />
          </svg>
          Baixar Relatório de Atendimentos
        </button>
        {error && (
          <div className="mt-6 flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
            {error}
          </div>
        )}
        <FilterSection filtros={filtros} setFiltros={setFiltros} />
        <AtendimentoTable
          items={items}
          isLoading={isLoading}
          openRegisterModal={(i) => {
            setConsultaSelecionada(i);
            setModalAddOpen(true);
          }}
          openViewModal={(i) => {
            setAtendimentoSelecionado(i);
            setModalViewOpen(true);
          }}
          openEditModal={(i) => {
            setAtendimentoSelecionado(i);
            setDadosAtendimento({
              diagnostico: i.diagnostico || "",
              prescricao: i.prescricao || "",
              observacoes: i.observacoes || "",
            });
            setModalEditOpen(true);
          }}
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
            isOpen
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
            isOpen
            onClose={closeModal}
            atendimento={atendimentoSelecionado}
            formatarDataHoraBR={formatarDataHoraBR}
          />
        )}
        {modalEditOpen && atendimentoSelecionado && (
          <ModalEditAtendimento
            isOpen
            onClose={closeModal}
            atendimento={atendimentoSelecionado}
            dadosAtendimento={dadosAtendimento}
            setDadosAtendimento={setDadosAtendimento}
            onSave={handleEditarAtendimento}
            formatarDataHoraBR={formatarDataHoraBR}
          />
        )}
        <ConfirmationModal
          isOpen={isModalOpen}
          onConfirm={confirmDelete}
          onCancel={() => {
            console.log("Cancelando exclusão, ID:", idToDelete);
            setIsModalOpen(false);
            setIdToDelete(null);
          }}
          message="Deseja excluir este atendimento?"
        />
      </div>
    </div>
  );
};

export default RegistroAtendimento;
