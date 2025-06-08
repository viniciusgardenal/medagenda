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
import { FaPlus, FaEye, FaEdit, FaTrash } from "react-icons/fa";

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
    <div className="flex-1">
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        Status
      </label>
      <select
        className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
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
  <div className="border-b pb-4 flex justify-between items-center">
    <h2 className="text-3xl font-bold text-blue-600 flex items-center gap-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
      Registro de Atendimentos
    </h2>
  </div>
);

const TableRow = ({ item, onRegister, onView, onEdit, onDelete }) => {
  // console.log(" Itemmmm", item);

  // A verificação 'isConsulta' estava limitando a exibição correta.
  // Vamos simplificar e acessar os dados diretamente, pois ambos os tipos de item (consulta e atendimento)
  // terão uma estrutura de dados similar após o tratamento no useEffect.
  const isPendingRegistration = item.status === "checkin_realizado";

  const dataHora = isPendingRegistration
    ? formatarDataHoraBR(`${item.dataConsulta}T${item.horaConsulta}`)
    : formatarDataHoraBR(item.atendimento?.dataAtendimento);

  return (
    <tr className="hover:bg-blue-50 transition-colors">
      <td className="px-6 py-3 text-sm text-gray-700 font-medium">
        {item.paciente?.nome} {item.paciente?.sobrenome}
      </td>
      <td className="px-6 py-3 text-sm text-gray-700">
        {item.medico?.nome} (CRM: {item.medico?.crm})
      </td>
      <td className="px-6 py-3 text-sm text-gray-700">
        {item.tipoConsulta?.nomeTipoConsulta ||
          item.idTipoConsulta?.nome ||
          "N/A"}
      </td>
      <td className="px-6 py-3 text-sm text-gray-700">{dataHora}</td>
      <td className="px-6 py-3 text-sm text-gray-700">
        {item.atendimento?.diagnostico}
      </td>
      <td className="px-6 py-3 flex gap-3">
        {isPendingRegistration ? (
          <button
            onClick={() => onRegister(item)}
            className="text-green-600 hover:text-green-700 transition-colors"
            title="Registrar Atendimento"
          >
            <FaPlus className="h-5 w-5" />
          </button>
        ) : (
          <>
            <button
              onClick={() => onView(item)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="Visualizar Atendimento"
            >
              <FaEye className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="Editar Atendimento"
            >
              <FaEdit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="text-red-600 hover:text-red-700 transition-colors"
              title="Excluir Atendimento"
            >
              <FaTrash className="h-5 w-5" />
            </button>
          </>
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
      <div className="mt-3 overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              {[
                "Paciente",
                "Médico",
                "Tipo de Consulta",
                "Data - Hora",
                "Diagnóstico/Motivo",
                "Ações",
              ].map((header, idx) => {
                const fields = ["nome", "medico", "tipo", "horario", "motivo"];
                return (
                  <th
                    key={header}
                    onClick={() => fields[idx] && handleSort(fields[idx])}
                    className={`px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider cursor-pointer ${
                      idx === 0 ? "rounded-tl-lg" : ""
                    } ${idx === 5 ? "rounded-tr-lg" : ""} ${
                      sortField === fields[idx] ? "bg-blue-700" : ""
                    }`}
                  >
                    {header}{" "}
                    {sortField === fields[idx] &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
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
    <div className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
        <HeaderSection />
        <button
          onClick={handleDownloadRelatorio}
          className="inline-flex items-center mt-6 gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition-colors"
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
          <div className="mt-6 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
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
