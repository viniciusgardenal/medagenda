import React, { useState, useEffect } from "react";
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
import {
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaSkullCrossbones,
} from "react-icons/fa";

const formatarDataHoraBR = (dataHora) => {
  if (!dataHora || !dataHora.includes("T")) return "";
  const [data, hora] = dataHora.split("T");
  const [ano, mes, dia] = data.split("-");
  const horaFormatada = hora.split(":").slice(0, 2).join(":");
  return `${dia}/${mes}/${ano} - ${horaFormatada}`;
};

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

const HeaderSection = () => (
  <div className="border-b pb-4">
    <h2 className="text-3xl font-bold text-blue-600">
      Registro de Atendimentos
    </h2>
  </div>
);

const TableRow = ({ item, onRegister, onView, onEdit, onDelete }) => {
  const isConsulta = !!item.status;
  const dataHora = isConsulta
    ? formatarDataHoraBR(`${item.dataConsulta}T${item.horaConsulta}`)
    : formatarDataHoraBR(item.dataAtendimento);

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
      <td className="px-4 py-3 text-sm text-gray-700">{dataHora}</td>
      <td className="px-4 py-3 text-sm text-gray-700">
        {isConsulta ? item.motivo : item.diagnostico || "N/A"}
      </td>
      <td className="px-4 py-3 flex gap-3">
        {isConsulta && item.status === "checkin_realizado" ? (
          <button
            onClick={() => onRegister(item)}
            className="text-green-500 hover:text-green-700"
            title="Registrar Atendimento"
          >
            <FaPlus className="h-5 w-5" />
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                console.log("Clicou em Visualizar:", item);
                onView(item);
              }}
              className="text-blue-500 hover:text-blue-700"
              title="Visualizar Atendimento"
            >
              <FaEye className="h-5 w-5" />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="text-yellow-500 hover:text-yellow-700"
              title="Editar Atendimento"
            >
              <FaEdit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="text-red-500 hover:text-red-700"
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
    <div className="text-center py-4 text-sm text-gray-500">
      Carregando dados...
    </div>
  ) : (
    <>
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
              ].map((header, idx) => {
                const fields = ["nome", "medico", "tipo", "horario", "motivo"];
                return (
                  <th
                    key={header}
                    onClick={() => fields[idx] && handleSort(fields[idx])}
                    className={`px-4 py-3 text-left text-sm font-semibold cursor-pointer ${
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
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {sorted.length > 0 && (
        <Pagination
          totalItems={sorted.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          maxPageButtons={5}
        />
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
  const [filtros, setFiltros] = useState({ filtroNome: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [sortField, setSortField] = useState("horario");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Chamando GetConsultas...");
        const response = await getConsultas({
          status: ["checkin_realizado"],
        });
        console.log("response", response);
        setItems(response.data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const itemsFiltrados = items.filter((item) => {
    const termo = filtros.filtroNome.toLowerCase();
    return (
      item.paciente?.nome?.toLowerCase().includes(termo) ||
      `${item.medico?.nome} ${item.medico?.sobrenome}`
        .toLowerCase()
        .includes(termo) ||
      item.tipoConsulta?.nomeTipoConsulta?.toLowerCase().includes(termo) ||
      formatarDataHoraBR(item.dataAtendimento).toLowerCase().includes(termo) ||
      (item.diagnostico || "").toLowerCase().includes(termo)
    );
  });

  const handleSalvarAtendimento = async () => {
    try {
      const { data } = await registrarAtendimento(
        consultaSelecionada.id,
        dadosAtendimento
      );
      
      const novo = {
        ...data,
        paciente: consultaSelecionada.paciente,
        medico: consultaSelecionada.medico,
        tipoConsulta: consultaSelecionada.tipoConsulta,
      };
      setItems([...items.filter((i) => i.id !== consultaSelecionada.id), novo]);
      closeModal();
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao registrar atendimento.");
    }
  };

  const handleEditarAtendimento = async () => {
    try {
      await atualizarAtendimento(atendimentoSelecionado.id, dadosAtendimento);
      setItems(
        items.map((item) =>
          item.id === atendimentoSelecionado.id
            ? { ...item, ...dadosAtendimento }
            : item
        )
      );
      closeModal();
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
    <div className="min-h-screen bg-gray-200 backdrop-blur-sm p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <HeaderSection />
        <button
          onClick={handleDownloadRelatorio}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700 transition"
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
          <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-300">
            {error}
          </div>
        )}
        <FilterSection filtros={filtros} setFiltros={setFiltros} />
        <AtendimentoTable
          items={itemsFiltrados}
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
